import React, { Component } from "react";
import styled from "styled-components";
import { Icon } from "semantic-ui-react";
import api from "../services/api";
import ExploreUsers from "../components/ExploreUsers";
import Profile from "./Profile";
import ExploreContent from "../components/ExploreContent";
import InfiniteScroll from "react-infinite-scroller";
import NavBar from "../containers/NavBar";
import refreshToken from "../utils/refreshToken";

const
	Wrapper = styled.div`
		@media (max-width: 420px) {
			overflow: auto;
			::-webkit-scrollbar {
				display: none !important;
			}
			height: 100vh;
			width: 100%;
		}
	`,
	StyledInfiniteScroll = styled( InfiniteScroll )`
		@media (max-width: 420px) {
			height: 100%;
			width: 100%;
			display: grid;
			margin-top: 49.33px;
			grid-template-columns: 100%;
			grid-template-rows: 49.33px auto;
			grid-template-areas:
				"h"
				"c"
		}
	`,
	Header = styled.div`
		@media (max-width: 420px) {
			grid-area: h;
			height: 100%;
			display: grid;
			grid-template-columns: 50% 50%;
			grid-template-rows: 100%;
			grid-template-areas:
				"shu shc"
		}
	`,
	UserSubheader = styled.div`
		@media (max-width: 420px) {
			grid-area: shu;
			justify-self: center;
			align-self: center;
		}
	`,
	ContentSubheader = styled.div`
		@media (max-width: 420px) {
			grid-area: shc;
			justify-self: center;
			align-self: center;
		}
	`,
	MainComponent = styled.div`
		@media (max-width: 420px) {
			grid-area: c;
		}
	`,
	HeaderIcon = styled( Icon )`
		@media (max-width: 420px) {
			color: ${props => props.active ?
		"#000" : "rgba( 0,0,0,.5 )"} !important;
		}
	`;

class ExplorePage extends Component {
	constructor() {
		super();
		this.state = {
			keywords: "",
			usernameSearch: "",
			renderProfile: false,
			typeOfSearch: "",
			skip: 1,
			hasMore: true,
			content: true,
			posts: [],
			user: {}
		};
	}

	componentDidMount() {
		this.refreshPosts();
	}

	refreshPosts = () => {
		api.exploreContent( 0 )
			.then( res => {
				if ( res === "jwt expired" ) {
					refreshToken()
						.then(() => this.refreshPosts())
						.catch( err => console.log( err ));
				} else if ( res.data ) {
					this.setState({ posts: res.data });
				}
			}).catch( err => console.log( err ));
	}

	getSugestedUser = () => {
		api.getSugested( this.state.skip )
			.then( res => {
				if ( res === "jwt expired" ) {
					refreshToken()
						.then(() => this.getSugestedUser())
						.catch( err => console.log( err ));
				} else if ( res.data ) {
					this.setState({
						user: res.data,
						renderProfile: true,
						typeOfSearch: "sugested",
						skip: this.state.skip + 1
					});
				}
			}).catch( err => console.log( err ));
	}

	getRandomUser = () => {
		api.getRandom()
			.then( res => {
				if ( res === "jwt expired" ) {
					refreshToken()
						.then(() => this.getRandomUser())
						.catch( err => console.log( err ));
				} else if ( res.data ) {
					this.setState({
						user: res.data,
						renderProfile: true,
						typeOfSearch: "random"
					});
				}
			}).catch( err => console.log( err ));
	}

	getKeywordUser = () => {
		var keywordsArray = ( this.state.keywords ).split( /\s*#/ );
		keywordsArray.shift();
		api.matchKwUsers( keywordsArray, this.state.skip )
			.then( res => {
				if ( res === "jwt expired" ) {
					refreshToken()
						.then(() => this.getKeywordUser())
						.catch( err => console.log( err ));
				} else if ( res.data ) {
					this.setState({
						user: res.data, renderProfile: true, typeOfSearch: "keyword",
						skip: this.state.skip + 1
					});
				}
			}).catch( err => console.log( err ));
	}

	getUsername = () => {
		api.getUserInfo( this.state.usernameSearch )
			.then( res => {
				if ( res === "jwt expired" ) {
					refreshToken()
						.then(() => this.getUsername())
						.catch( err => console.log( err ));
				} else if ( res.data ) {
					this.setState({ user: res.data, renderProfile: true });
				}
			}).catch( err => console.log( err ));
	}

	handleChange = e => {
		this.setState({ [ e.target.name ]: e.target.value });
	}

	backToMenu = () => {
		this.setState({ renderProfile: false, skip: 0 });
	}

	nextUser = () => {
		switch ( this.state.typeOfSearch ) {
		case "sugested":
			this.getSugestedUser();
			break;
		case "random":
			this.getRandomUser();
			break;
		case "keyword":
			this.getKeywordUser();
			break;
		default:
			this.getSugestedUser();
		}
	}

	getPosts = () => {
		if ( this.state.hasMore ) {
			api.exploreContent( this.state.skip )
				.then( res => {
					if ( res === "jwt expired" ) {
						refreshToken()
							.then(() => this.getPosts())
							.catch( err => console.log( err ));
					} else if ( res.data ) {
						this.setState({
							posts: [ ...this.state.posts, ...res.data ],
							hasMore: res.data.length > 10,
							skip: this.state.skip + 1
						});
					}
				}).catch( err => console.log( err ));
		}
	}


	render() {
		if ( this.state.renderProfile ) {
			return (
				<Profile
					className="exploreProfile"
					user={this.state.user}
					backToMenu={this.backToMenu}
					next={this.nextUser}
					explore={true}
					socket={this.props.socket}
				/>
			);
		}
		return (
			<Wrapper className="exploreMainWrapper">
				<StyledInfiniteScroll
					pageStart={this.state.skip}
					hasMore={this.state.hasMore}
					loadMore={this.getPosts}
					initialLoad={false}
					useWindow={false}
				>
					<NavBar />
					<Header>
						<UserSubheader>
							<HeaderIcon
								active={!this.state.content ? 1 : 0}
								className="userIcon"
								name="user"
								size="large"
								onClick={() => this.setState({ content: false })}
							/>
						</UserSubheader>
						<ContentSubheader>
							<HeaderIcon
								active={this.state.content ? 1 : 0}
								className="contentIcon"
								name="content"
								size="large"
								onClick={() => this.setState({ content: true })}
							/>
						</ContentSubheader>
					</Header>
					<MainComponent>
						{this.state.content ?
							<ExploreContent
								className="exploreContent"
								posts={this.state.posts}
							/>
							:
							<ExploreUsers
								className="exploreUsers"
								getSugested={this.getSugestedUser}
								getRandom={this.getRandomUser}
								getKeywordUser={this.getKeywordUser}
								getUsername={this.getUsername}
								handleChange={this.handleChange}
							/>
						}
					</MainComponent>
				</StyledInfiniteScroll>
			</Wrapper>
		);
	}
}


export default ExplorePage;
