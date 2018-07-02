import React, { Component } from "react";
import styled from "styled-components";
import { Icon } from "semantic-ui-react";
import api from "../services/api";
import ExploreUsers from "../components/ExploreUsers";
import UserProfile from "../containers/UserProfile";
import ExploreContent from "../components/ExploreContent";
import InfiniteScroll from "react-infinite-scroller";
import NavBar from "../containers/NavBar";
import refreshToken from "../utils/refreshToken";
import Notifications from "../containers/Notifications";
import Messages from "../containers/Messages";
import {
	setNewsfeed, addToNewsfeed, switchMediaOptions, addPost
} from "../services/actions/posts";
import { logout } from "../services/actions/auth";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { addMessage } from "../services/actions/conversations";
import { setNotifications, addNotification } from "../services/actions/notifications";

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
			grid-template-rows: 10% auto;
			grid-template-areas:
				"h"
				"c"
		}
	`,
	Header = styled.div`
		@media (max-width: 420px) {
			grid-area: h;
			height: 100%;
			border-bottom: 1px solid #D8D8D8;
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
				<UserProfile
					className="exploreProfile"
					user={this.state.user}
					username={this.state.user.username}
					backToMenu={this.backToMenu}
					next={this.nextUser}
					socket={this.props.socket}
					explore={true}
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
					{this.props.displayNotifications && <Notifications />}
					{this.props.displayMessages && <Messages socket={this.props.socket} />}
					<NavBar />
					<Header>
						<UserSubheader>
							<Icon
								className="userIcon"
								name="user"
								size="large"
								onClick={() => this.setState({ content: false })}
							/>
						</UserSubheader>
						<ContentSubheader>
							<Icon
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

ExplorePage.propTypes = {
	logout: PropTypes.func.isRequired,
	setNewsfeed: PropTypes.func.isRequired,
	switchMediaOptions: PropTypes.func.isRequired,
	history: PropTypes.shape({
		push: PropTypes.func.isRequired
	}).isRequired,
};

const
	mapStateToProps = state => ({
		newsfeed: state.posts.newsfeed,
		mediaOptions: state.posts.mediaOptions,
		displayComments: state.posts.displayComments,
		displayShare: state.posts.displayShare,
		displayNotifications: state.notifications.displayNotifications,
		displayMessages: state.conversations.displayMessages
	}),

	mapDispatchToProps = dispatch => ({
		setNewsfeed: posts => dispatch( setNewsfeed( posts )),
		addToNewsfeed: posts => dispatch( addToNewsfeed( posts )),
		addPost: post => dispatch( addPost( post )),
		addMessage: message => dispatch( addMessage( message )),
		switchMediaOptions: () => dispatch( switchMediaOptions()),
		addNotification: notification => dispatch( addNotification( notification )),
		setNotifications: ( allNotifications, newNotifications ) => {
			dispatch( setNotifications( allNotifications, newNotifications ));
		},
		logout: () => dispatch( logout())
	});

export default connect( mapStateToProps, mapDispatchToProps )( ExplorePage );
