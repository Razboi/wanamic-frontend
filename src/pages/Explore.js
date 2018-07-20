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
import PostDetails from "../containers/PostDetails";
import {
	setPosts, addToPosts, switchPostDetails
} from "../services/actions/posts";
import { connect } from "react-redux";

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
	`,
	SearchBar = styled.input`
		@media (max-width: 420px) {
			width: 90%;
			height: 34px;
			color: #303030 !important;
			text-align: center !important;
			border: 1px solid rgba( 0,0,0,.4 ) !important;
			border-radius: 2px !important;
			box-shadow: 0 1px 2px rgba(0, 0, 0, .125);
		}
	`,
	SearchWrapper = styled.div`
		@media (max-width: 420px) {
			z-index: 3;
			height: 44px;
			display: flex;
			align-items: center;
			justify-content: center;
			width: 100%;
			position: fixed !important;
			bottom: 0;
		}
	`;

class ExplorePage extends Component {
	constructor() {
		super();
		this.state = {
			hobbies: "",
			usernameSearch: "",
			renderProfile: false,
			typeOfSearch: "",
			skip: 1,
			userSkip: 0,
			hasMore: true,
			content: true,
			user: {},
			selectedPost: {},
			search: "",
			searching: false
		};
	}

	componentDidMount() {
		this.refreshPosts();
	}

	refreshPosts = async() => {
		const posts = await api.exploreContent( 0 );
		if ( posts === "jwt expired" ) {
			await refreshToken();
			this.refreshPosts();
		} else if ( posts.data ) {
			this.props.setPosts( posts.data, true );
		}
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

	matchHobbies = () => {
		api.matchHobbies( this.state.hobbies, this.state.userSkip )
			.then( res => {
				if ( res === "jwt expired" ) {
					refreshToken()
						.then(() => this.matchHobbies())
						.catch( err => console.log( err ));
				} else if ( res.data ) {
					this.setState({
						user: res.data, renderProfile: true, typeOfSearch: "hobbie",
						skip: this.state.userSkip + 1
					});
				}
			}).catch( err => console.log( err ));
	}

	matchUsername = () => {
		api.getUserInfo( this.state.usernameSearch )
			.then( res => {
				if ( res === "jwt expired" ) {
					refreshToken()
						.then(() => this.matchUsername())
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
		case "hobbie":
			this.matchHobbies();
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
						this.props.addToPosts( res.data, true );
						this.setState({
							hasMore: res.data.length > 10,
							skip: this.state.skip + 1
						});
					}
				}).catch( err => console.log( err ));
		}
	}

	displayPostDetails = post => {
		this.setState({
			selectedPost: post
		});
		this.props.switchPostDetails();
	}

	hidePostDetails = () => {
		this.setState({
			selectedPost: {}
		});
		this.props.switchPostDetails();
	}

	handleKeyPress = e => {
		if ( e.key === "Enter" ) {
			if ( this.state.search ) {
				this.setState({ searching: true, skip: 1 });
				this.searchContent();
			} else if ( this.state.searching ) {
				this.setState({ searching: false, skip: 1 });
				this.refreshPosts();
			}
		}
	}

	searchContent = async() => {
		try {
			const posts = await api.searchContent( 0, this.state.search );
			this.props.setPosts( posts.data, true );
		} catch ( err ) {
			console.log( err );
		}
	}

	loadSearch = async() => {
		if ( this.state.hasMore ) {
			try {
				const posts = await api.searchContent(
					this.state.skip, this.state.search );
				this.props.addToPosts( posts.data, true );
				this.setState({
					hasMore: posts.data.length > 10,
					skip: this.state.skip + 1
				});
			} catch ( err ) {
				console.log( err );
			}
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
		if ( this.props.displayPostDetails ) {
			return (
				<PostDetails
					post={this.props.posts[ this.state.selectedPost ]}
					switchDetails={this.hidePostDetails}
					socket={this.props.socket}
				/>
			);
		}
		return (
			<Wrapper className="exploreMainWrapper">
				<StyledInfiniteScroll
					pageStart={this.state.skip}
					hasMore={this.state.hasMore}
					loadMore={this.state.searching ?
						this.loadSearch : this.getPosts}
					initialLoad={false}
					useWindow={false}
				>
					<NavBar socket={this.props.socket} />
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
							<React.Fragment>
								<ExploreContent
									className="exploreContent"
									posts={this.props.posts}
									displayPostDetails={this.displayPostDetails}
								/>
								<SearchWrapper>
									<SearchBar
										placeholder="What are you interested in?"
										name="search"
										onChange={this.handleChange}
										value={this.state.search}
										onKeyPress={this.handleKeyPress}
									/>
								</SearchWrapper>
							</React.Fragment>
							:
							<ExploreUsers
								className="exploreUsers"
								getSugested={this.getSugestedUser}
								getRandom={this.getRandomUser}
								matchHobbies={this.matchHobbies}
								matchUsername={this.matchUsername}
								handleChange={this.handleChange}
							/>
						}
					</MainComponent>
				</StyledInfiniteScroll>
			</Wrapper>
		);
	}
}

const
	mapStateToProps = state => ({
		posts: state.posts.explore,
		displayPostDetails: state.posts.displayPostDetails
	}),

	mapDispatchToProps = dispatch => ({
		setPosts: ( posts, onExplore ) =>
			dispatch( setPosts( posts, onExplore )),
		addToPosts: ( posts, onExplore ) =>
			dispatch( addToPosts( posts, onExplore )),
		switchPostDetails: () => dispatch( switchPostDetails())
	});


export default connect( mapStateToProps, mapDispatchToProps )( ExplorePage );
