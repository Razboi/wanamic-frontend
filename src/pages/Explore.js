import React, { Component } from "react";
import styled from "styled-components";
import api from "../services/api";
import ExploreUsers from "../components/ExploreUsers";
import Profile from "./Profile";
import ExploreContent from "../components/ExploreContent";
import InfiniteScroll from "react-infinite-scroller";
import NavBar from "../containers/NavBar";
import refreshToken from "../utils/refreshToken";
import PostDetails from "../containers/PostDetails";
import Comments from "../containers/Comments";
import {
	setPosts, addToPosts, switchPostDetails, switchComments, switchShare
} from "../services/actions/posts";
import { switchNotifications } from "../services/actions/notifications";
import { switchMessages } from "../services/actions/conversations";
import { connect } from "react-redux";
import _ from "lodash";

const
	Wrapper = styled.div`
		overflow-y: scroll;
		height: 100%;
		width: 100%;
		@media (max-width: 420px) {
			::-webkit-scrollbar {
				display: none !important;
			}
		};
		@media (min-width: 420px) {
			background: rgb(230, 240, 236);
		};
	`,
	PageContent = styled.div`
		display: grid;
		height: 100%;
		min-height: 100vh;
		width: 100%;
		margin-top: 49.33px;
		grid-template-columns: 100%;
		grid-template-areas:
			"h"
			"c";
		@media (max-width: 420px) {
			grid-template-rows: 49.33px auto;
		}
		@media (min-width: 420px) {
			grid-template-rows: 80px auto;
		}
	`,
	Header = styled.div`
		grid-area: h;
		height: 100%;
		@media (max-width: 420px) {
			display: flex;
			justify-content: space-around;
			align-items: center;
		}
		@media (min-width: 420px) {
			grid-area: h;
			width: 200px;
			margin: 0 auto;
			display: flex;
			align-items: center;
			justify-content: space-between;
		}
	`,
	UserSubheader = styled.div`
		@media (min-width: 420px) {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			padding: 0.5rem;
	    border-radius: 3px;
	    border: 1px solid rgba(0,0,0,0.1);
			box-shadow: ${props => props.active ?
		"none" : "0 3px 8px rgba(0, 0, 0, .25)"};
	    background: #fff;
			:hover {
				cursor: pointer;
			};
		}
		@media (max-width: 420px) {
			height: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	`,
	ContentSubheader = styled.div`
		@media (min-width: 420px) {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			padding: 0.5rem;
	    border-radius: 3px;
	    border: 1px solid rgba(0,0,0,0.1);
			box-shadow: ${props => props.active ?
		"none" : "0 3px 8px rgba(0, 0, 0, .25)"};
	    background: #fff;
			:hover {
				cursor: pointer;
			};
		}
		@media (max-width: 420px) {
			height: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	`,
	MainComponent = styled.div`
		grid-area: c;
		padding: 0 16px;
	`,
	HeaderImage = styled.span`
		display: block;
		background-image: url(${props => props.image});
		background-repeat: no-repeat;
		margin: 0;
		position: relative;
		@media (max-width: 420px) {
			height: 24px;
			width: 24px;
		}
		@media (min-width: 420px) {
			height: 32px;
			width: 32px;
		}
	`,
	SearchBar = styled.input`
		color: #222 !important;
		text-align: center !important;
		border: 1px solid rgba( 0,0,0,.4 ) !important;
		border-radius: 2px !important;
		box-shadow: 0 1px 2px rgba(0, 0, 0, .125);
		font-family: inherit;
		::placeholder {
			color: #333;
		}
		@media (max-width: 420px) {
			width: 90%;
			height: 34px;
		}
		@media (min-width: 420px) {
			width: 800px;
			height: 40px;
		}
	`,
	SearchWrapper = styled.div`
		z-index: 3;
		display: flex;
		align-items: flex-start;
		justify-content: center;
		width: 100%;
		position: fixed !important;
		transition: bottom 0.7s linear;
		left: 0;
		@media (max-width: 420px) {
			height: 44px;
			bottom: ${props => props.hide ? "-44px" : "0px"};
		}
		@media (min-width: 420px) {
			height: 54px;
			align-items: center;
			bottom: ${props => props.hide ? "-54px" : "25px"};
		}
	`,
	PostDetailsDimmer = styled.div`
		position: fixed;
		height: 100vh;
		width: 100vw;
		z-index: 5;
		background: rgba(0,0,0,0.6);
		display: flex;
		align-items: center;
		justify-content: center;
	`,
	OutsideClickHandler = styled.div`
		width: 100%;
		height: 100%;
	`;

var lastScrollPosition = 0;
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
			searching: false,
			scrollingDown: false
		};
		this.throttledScroll = _.throttle( this.handleScroll, 500 );
	}

	componentDidMount() {
		window.scrollTo( 0, 0 );
		window.addEventListener( "scroll", this.throttledScroll );
		this.refreshPosts();
	}

	componentWillUnmount() {
		window.removeEventListener( "scroll", this.throttledScroll );
	}

	handleScroll = e => {
		const currentScrollPosition = window.pageYOffset;

		if ( currentScrollPosition > lastScrollPosition + 20 ) {
			this.setState({ scrollingDown: true });
			lastScrollPosition = currentScrollPosition;
		} else if ( currentScrollPosition < lastScrollPosition - 20 ) {
			this.setState({ scrollingDown: false });
			lastScrollPosition = currentScrollPosition;
		}
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

	hidePopups = () => {
		if ( this.props.displayNotifications ) {
			this.props.switchNotifications();
		}
		if ( this.props.displayMessages ) {
			this.props.switchMessages();
		}
		if ( this.props.displayPostDetails ) {
			this.props.switchPostDetails();
		}
		if ( this.props.displayComments ) {
			this.props.switchComments();
		}
		if ( this.props.displayShare ) {
			this.props.switchShare();
		}
	}


	render() {
		var
			connectImage,
			contentImage;
		const { displayComments, displayPostDetails } = this.props;
		try {
			if ( window.innerWidth > 420 ) {
				connectImage = !this.state.content ?
					require( "../images/big_connect_color.png" )
					:
					require( "../images/big_connect.png" );
				contentImage = this.state.content ?
					require( "../images/big_content_color.png" )
					:
					require( "../images/big_content.png" );
			} else {
				connectImage = !this.state.content ?
					require( "../images/connect_color.png" )
					:
					require( "../images/connect.png" );
				contentImage = this.state.content ?
					require( "../images/content_color.png" )
					:
					require( "../images/content.png" );
			}
		} catch ( err ) {
			console.log( err );
		}

		if ( this.state.renderProfile ) {
			return (
				<Profile
					className="exploreProfile"
					user={this.state.user}
					backToMenu={this.backToMenu}
					next={this.nextUser}
					explore={true}
					socket={this.props.socket}
					history={this.props.history}
				/>
			);
		}
		return (
			<Wrapper className="exploreMainWrapper">
				{( displayPostDetails || displayComments ) &&
					<PostDetailsDimmer>
						<OutsideClickHandler onClick={this.hidePopups} />
						{displayPostDetails &&
							<PostDetails
								post={this.props.posts[ this.state.selectedPost ]}
								switchDetails={this.hidePostDetails}
								socket={this.props.socket}
								index={this.state.selectedPost}
							/>}
						{displayComments &&
							<Comments
								socket={this.props.socket}
							/>}
					</PostDetailsDimmer>
				}

				<InfiniteScroll
					pageStart={this.state.skip}
					hasMore={this.state.hasMore}
					loadMore={this.state.searching ?
						this.loadSearch : this.getPosts}
					initialLoad={false}
					useWindow={true}
				>
					<NavBar
						hide={this.state.scrollingDown}
						socket={this.props.socket}
					/>

					<PageContent onClick={this.hidePopups}>
						<Header>
							<UserSubheader active={!this.state.content}>
								<HeaderImage
									image={connectImage}
									className="userIcon"
									onClick={() => this.setState({ content: false })}
								/>
							</UserSubheader>
							<ContentSubheader active={this.state.content}>
								<HeaderImage
									image={contentImage}
									className="contentIcon"
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
									<SearchWrapper hide={this.state.scrollingDown}>
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
					</PageContent>
				</InfiniteScroll>
			</Wrapper>
		);
	}
}

const
	mapStateToProps = state => ({
		posts: state.posts.explore,
		displayPostDetails: state.posts.displayPostDetails,
		displayMessages: state.conversations.displayMessages,
		displayComments: state.posts.displayComments,
		displayShare: state.posts.displayShare,
		displayNotifications: state.notifications.displayNotifications
	}),

	mapDispatchToProps = dispatch => ({
		setPosts: ( posts, onExplore ) =>
			dispatch( setPosts( posts, onExplore )),
		addToPosts: ( posts, onExplore ) =>
			dispatch( addToPosts( posts, onExplore )),
		switchPostDetails: () => dispatch( switchPostDetails()),
		switchNotifications: () => dispatch( switchNotifications()),
		switchMessages: () => dispatch( switchMessages()),
		switchComments: () => dispatch( switchComments()),
		switchShare: () => dispatch( switchShare())
	});


export default connect( mapStateToProps, mapDispatchToProps )( ExplorePage );
