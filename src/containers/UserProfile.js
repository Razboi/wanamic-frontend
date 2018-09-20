import React, { Component } from "react";
import styled from "styled-components";
import { Button } from "semantic-ui-react";
import { 	setPosts, addToPosts, switchMediaOptions
} from "../services/actions/posts";
import { switchMessages } from "../services/actions/conversations";
import { switchNotifications } from "../services/actions/notifications";
import api from "../services/api";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import refreshToken from "../utils/refreshToken";
import InfiniteScroll from "react-infinite-scroller";
import ProfileOptions from "../components/ProfileOptions";
import ProfileTimeLine from "../components/ProfileTimeLine";
import NavBar from "./NavBar";
import MediaOptions from "../containers/MediaOptions";

var
	backgroundImg,
	profileImg;

const
	Wrapper = styled.div`
		height: 100%;
		min-height: 100vh;
		width: 100%;
		overflow: auto;
		display: flex;
		flex-direction: column;
		background: rgb(230, 240, 236);
		padding-bottom: 300px;
		@media (max-width: 1100px) {
			::-webkit-scrollbar {
			display: none !important;
			}
		}
	`,
	NullAccountWarning = styled.div`
		height: 100vh;
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		background: rgb(230, 240, 236);
	`,
	ShareMediaButton = styled.div`
		position: fixed;
		left: 50%;
		transform: translateX(-50%);
		bottom: 5px;
		z-index: 3;
		border-radius: 100%;
		padding: 1rem;
		background: rgba(133, 217, 191, 0.9) !important;
		display: flex;
		align-items: center;
		justify-content: center;
		:hover {
			cursor: pointer;
		}
	`,
	PlusImage = styled.span`
		height: 24px;
		width: 24px;
		display: block;
		background-image: url(${props => props.image});
		background-repeat: no-repeat;
		margin: 0;
		position: relative;
		transform: ${props => props.active ? "rotate(45deg)" : "none"};
		transition: transform 0.5s;
		background-size: 100%;
	`,
	StyledInfiniteScroll = styled( InfiniteScroll )`
		height: 100%;
		width: 100%;
	`,
	UserInfoWrapper = styled.div`
		background: #fff;
	`,
	TimeLine = styled.div`
		@media (min-width: 1100px) {
			max-width: 1230px;
			background: none;
			display: flex;
			justify-content: flex-start;
			align-items: flex-start;
			margin: 0 auto;
			position: relative;
		}
		@media (min-width: 600px) {
			margin: 0 auto;
		}
	`,
	UserInfo = styled.div`
		margin-top: -5rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		z-index: 2;
		@media (min-width: 1100px) {
			display: none;
		}
	`,
	FloatingUserInfo = styled.div`
		display: flex;
		flex-direction: column;
		align-items: center;
		z-index: 2;
		width: 300px;
		margin-top: -10rem;
		padding: 0 5px;
		@media (max-width: 1100px) {
			display: none;
		}
	`,
	UserInfoBackground = styled.div`
		height: 250px;
		background-image: url(${props => props.backgroundImg});
		background-size: cover;
		background-position: center;
		@media (min-width: 420px) and (max-width: 600px) {
			height: 400px;
		}
		@media (min-width: 600px) {
			height: 500px;
		}
	`,
	UserImage = styled.img`
		z-index: 2;
    height: auto;
    width: auto;
		max-height: 116px;
    max-width: 116px;
		border-radius: 4px;
		border: 2px solid #fff;
		box-shadow: 0 1px 2px rgba(0, 0, 0, .125);
		@media (min-width: 420px) {
			max-height: 200px;
	    max-width: 200px;
			box-shadow: 0px 3px 8px rgba(0, 0, 0, .25);
		}
		@media (max-width: 420px) {
			margin-top: -5rem;
		}
		@media (min-width: 420px) and (max-width: 1100px) {
			margin-top: -9rem;
		}
	`,
	Fullname = styled.h2`
		font-family: inherit;
		color: #111;
		margin: 0px;
		@media (min-width: 1100px) {
			margin-top: 1rem;
		}
	`,
	Username = styled.span`
		color: rgba( 0,0,0,0.5 );
	`,
	LikesCount = styled.div`
		color: #555 !important;
		display: flex;
		margin-top: 0.5rem !important;
		border: 1px solid rgba(34,36,38,.15);
		min-width: 60px;
		padding: 0.4rem;
		border-radius: 5px;
		justify-content: space-evenly;
		align-items: center;
		font-size: 1rem;
		color: rgb(140, 140, 140);
		box-shadow: 0px 1px rgba(0,0,0,.125);
		@media (min-width: 1100px) {
			background: #fff;
		}
	`,
	Description = styled.p`
		color: #222;
		margin: 2rem 0 0.5rem 0;
		text-align: center;
		font-size: 1.025rem;
		padding: 0 0.66rem;
		@media (min-width: 1100px) {
			padding: 0;
		}
	`,
	Hobbies = styled.div`
		display: flex;
		flex-wrap: wrap;
		width: 90%;
		align-items: center;
		justify-content: center;
		margin: 1rem 0;
	`,
	Hobbie = styled.div`
		border: 1px solid #EFEEEE;
		color: #333;
		border-radius: 2px;
		padding: 0.5rem;
		font-size: 1rem;
		font-weight: bold;
		margin: 0.5rem 0 0 0.5rem;
		box-shadow: 0 2px 2px rgba(0, 0, 0, .125);
		@media (min-width: 1100px) {
			background: #fff;
		}
	`,
	TabsWrapper = styled.div`
		color: #222;
		width: 100%;
		margin-top: 2rem;
		padding: 1rem 0;
		border-top: 2px solid rgba(0,0,0,.1);
		box-shadow: 0 1px 2px rgba(0,0,0,.125);
		@media (min-width: 1100px) {
			margin: 0;
		}
	`,
	Tabs = styled.div`
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		width: 100%;
		@media (min-width: 1100px) {
			width: 600px;
			margin: 0 auto;
			color: #111;
			font-size: 1.05rem;
			:hover {
				cursor: pointer;
			}
		}
	`,
	Tab = styled.span`
		font-weight: ${props => props.active && "600"};
	`,
	NextButton = styled( Button )`
		position: fixed;
		bottom: 10px;
		right: 10px;
		background: rgba( 0,0,0,0.5 ) !important;
		color: #fff !important;
		z-index: 4;
	`,
	BackButton = styled( Button )`
		position: fixed;
		bottom: 10px;
		left: 10px;
		background: rgba( 0,0,0,0.5 ) !important;
		color: #fff !important;
		z-index: 4;
	`,
	HeartImage = styled.span`
		height: 16px;
		width: 16px;
		display: block;
		background-image: url(${props => props.image});
		background-repeat: no-repeat;
		background-size: 100%;
		margin: 0 0.5rem 0 0;
	`,
	MediaDimmer = styled.div`
		filter: ${props => props.blur ? "blur(15px)" : "none"};
		padding-top: 49.33px;
	`,
	Page = styled.div``,
	RequestMessage = styled.div`
		position: absolute;
		top: 49.33px;
		left: 0px;
		background: rgba(0,0,0,0.60);
		width: 100%;
		padding: 1rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		color: #fff;
		font-family: inherit !important;
	`,
	RequestButton = styled( Button )`
		font-family: inherit !important;
		background: rgb(133, 217, 191) !important;
		border-radius: 2px !important;
	`;


class UserProfile extends Component {
	constructor() {
		super();
		this.state = {
			mediaButton: true,
			user: undefined,
			posts: [],
			hasMore: true,
			skip: 1,
			inexistent: false,
			userRequested: false,
			targetRequested: false,
			tab: "Posts",
			chat: false,
			messageTarget: undefined
		};
	}

	static getDerivedStateFromProps( props, state ) {
		if ( props.user && props.user !== state.user ) {
			return {
				user: props.user
			};
		}
		return null;
	}

	componentDidMount() {
		this.getUserInfo();
		this.checkPendingRequest();
		this.refreshTimeline();
	}

	componentDidUpdate( prevProps, prevState ) {
		if ( this.state.user !== prevState.user ) {
			this.setImages();
			this.checkPendingRequest();
			this.refreshTimeline();
			window.scrollTo( 0, 0 );
			if ( this.state.user ) {
				document.title = `${this.state.user.fullname} @${this.state.user.username}`;
			}
		} else if ( this.props.username !== prevProps.username ) {
			this.getUserInfo();
			this.checkPendingRequest();
			this.refreshTimeline();
			window.scrollTo( 0, 0 );
		}
	}

	getUserInfo = async() => {
		if ( this.props.user && this.props.explore ) {
			this.setImages();
		} else {
			try {
				const res = await api.getUserInfo( this.props.username );
				this.setState({ user: res.data });
			} catch ( err ) {
				console.log( err );
				if ( err.response.status === 404 ) {
					this.setState({ inexistent: true });
				} else if ( err.response.status === 401 ) {
					await refreshToken();
					this.getUserInfo();
				}
			}
		}
		document.title = `${this.state.user.fullname} @${this.state.user.username}`;
	}

	checkPendingRequest = async() => {
		if ( !this.props.authenticated ) {
			return;
		}
		try {
			const res = await api.isRequested( this.props.username );
			if ( res === "jwt expired" ) {
				await refreshToken();
				this.checkPendingRequest();
			} else {
				this.setState({
					userRequested: res.data.user,
					targetRequested: res.data.target
				});
			}
		} catch ( err ) {
			console.log( err );
		}
	}

	setImages() {
		const
			s3Bucket = "https://d3dlhr4nnvikjb.cloudfront.net/",
			{ user } = this.state;

		try {
			if ( user.headerImage ) {
				process.env.REACT_APP_STAGE === "dev" ?
					backgroundImg = require( "../images/" + user.headerImage )
					:
					backgroundImg = s3Bucket + user.headerImage;
			} else {
				backgroundImg = require( "../images/defaultbg.png" );
			}
			if ( user.profileImage ) {
				process.env.REACT_APP_STAGE === "dev" ?
					profileImg = require( "../images/" + user.profileImage )
					:
					profileImg = s3Bucket + user.profileImage;
			} else {
				profileImg = require( "../images/defaultUser.png" );
			}
		} catch ( err ) {
			console.log( err );
		}
	}

	getTimeline = async() => {
		if ( this.state.hasMore ) {
			try {
				const posts = await api.getTimeline(
					this.state.skip, this.props.username
				);
				this.props.addToPosts( posts.data );
				this.setState({
					hasMore: posts.data.length === 10,
					skip: this.state.skip + 1
				});
			} catch ( err ) {
				if ( err.response.data === "jwt expired" ) {
					await refreshToken();
					this.getTimeline();
				} else {
					console.log( err );
				}
			}
		}
	}

	refreshTimeline = async() => {
		try {
			const posts = await api.getTimeline( 0, this.props.username );
			if ( posts === "jwt expired" ) {
				await refreshToken();
				this.refreshTimeline();
			} else if ( posts.data ) {
				this.props.setPosts( posts.data );
				this.setState({
					hasMore: posts.data.length === 10,
					skip: 1
				});
			}
		} catch ( err ) {
			console.log( err );
		}
	}

	addFriend = async() => {
		try {
			const response = await api.addFriend( this.props.username );
			this.setState({ userRequested: true });
			this.props.socket.emit( "sendNotification", response.data );
		} catch ( err ) {
			if ( err.response.data === "jwt expired" ) {
				await refreshToken();
				this.addFriend();
			} else {
				console.log( err );
			}
		}
	}

	unFriend = async( username, id ) => {
		var user = this.state.user;
		try {
			await api.deleteFriend( username );
			const indexOfUnfriend = user.friends.indexOf(
				localStorage.getItem( "id" ));
			user.friends.splice( indexOfUnfriend, 1 );
			this.setState({ user: user });
			this.refreshTimeline();
		} catch ( err ) {
			if ( err.response.data === "jwt expired" ) {
				await refreshToken();
				this.unFriend();
			} else {
				console.log( err );
			}
		}
	}

	acceptRequest = async() => {
		var user = this.state.user;
		try {
			const response = await api.acceptRequest( this.props.username );
			if ( response === "jwt expired" ) {
				await refreshToken();
				this.acceptRequest();
			} else {
				user.friends.push( localStorage.getItem( "id" ));
				const index = user.followers.indexOf(
					localStorage.getItem( "id" ));
				user.followers.splice( index, 1 );
				this.setState({ user: user, targetRequested: false });
				this.refreshTimeline();
			}
		} catch ( err ) {
			console.log( err );
		}
	}

	startChat = messageTarget => {
		this.setState({ messageTarget: messageTarget });
	}

	hidePopups = () => {
		if ( this.props.displayNotifications ) {
			this.props.switchNotifications();
		}
		if ( this.props.displayMessages ) {
			this.props.switchMessages();
		}
	}

	toggleTab = tab => {
		this.setState({ tab: tab });
	}

	toggleChat = () => {
		this.setState( state => ({ chat: !state.chat }));
	}

	toggleMediaButton = () => {
		this.setState({ mediaButton: !this.state.mediaButton });
	}

	render() {
		var
			ownProfile = this.props.username === localStorage.getItem( "username" ),
			plusImage;

		try {
			plusImage = require( "../images/plus.svg" );
		} catch ( err ) {
			console.log( err );
		}

		if ( this.state.inexistent ) {
			return (
				<NullAccountWarning>
					<h2>This account doesn't exist</h2>
				</NullAccountWarning>
			);
		}
		if ( !this.state.user ) {
			return null;
		}
		const { user } = this.state;
		return (
			<Wrapper>
				<StyledInfiniteScroll
					pageStart={this.state.skip}
					hasMore={this.state.hasMore}
					loadMore={this.getTimeline}
					initialLoad={false}
					useWindow={true}
				>

					{ownProfile && this.state.mediaButton &&
						<ShareMediaButton
							onClick={() => this.props.switchMediaOptions()}
						>
							<PlusImage
								image={plusImage}
								active={this.props.mediaOptions}
							/>
						</ShareMediaButton>
					}

					{ownProfile && this.props.mediaOptions &&
						<MediaOptions
							toggleMediaButton={this.toggleMediaButton}
							socket={this.props.socket}
							onProfile
						/>}

					<MediaDimmer blur={this.props.mediaOptions} >
						<NavBar
							profilePage
							socket={this.props.socket}
							messageTarget={this.state.messageTarget}
							startChat={this.startChat}
						/>
						{this.state.targetRequested &&
							<RequestMessage>
								<h4>{user.fullname} sent you a friend request.</h4>
								<RequestButton
									onClick={this.acceptRequest}
									content="Accept request"
									size="tiny"
									primary
								/>
							</RequestMessage>}
						<Page onClick={this.hidePopups}>
							<UserInfoBackground backgroundImg={backgroundImg} />
							<UserInfoWrapper>
								<UserInfo>
									<UserImage src={profileImg} />
									<Fullname>{user.fullname}</Fullname>
									<Username>@{user.username}</Username>
									<LikesCount>
										<HeartImage
											image={require( "../images/heart.svg" )}
										/>
										{user.totalLikes}
									</LikesCount>
									<Description>{user.description}</Description>
									<Hobbies>
										{user.hobbies && user.hobbies.map(( hobbie, index ) =>
											<Hobbie key={index}>
												{hobbie}
											</Hobbie>
										)}
									</Hobbies>
									<ProfileOptions
										user={this.state.user}
										addFriend={this.addFriend}
										unFriend={this.unFriend}
										goToUserSettings={this.props.goToUserSettings}
										userRequested={this.state.userRequested}
										targetRequested={this.state.targetRequested}
										startChat={() => this.startChat( user )}
									/>
								</UserInfo>
								<TabsWrapper>
									<Tabs>
										<Tab
											active={this.state.tab === "Posts"}
											onClick={() => this.toggleTab( "Posts" )}
										>
											Posts
										</Tab>
										<Tab
											active={this.state.tab === "Information"}
											onClick={() => this.toggleTab( "Information" )}
										>
											Information
										</Tab>
										<Tab
											active={this.state.tab === "Album"}
											onClick={() => this.toggleTab( "Album" )}
										>
											Album
										</Tab>
										<Tab
											active={this.state.tab === "Network"}
											onClick={() => this.toggleTab( "Network" )}
										>
											Network
										</Tab>
									</Tabs>
								</TabsWrapper>
							</UserInfoWrapper>

							<TimeLine>
								<FloatingUserInfo>
									<UserImage src={profileImg} />
									<Fullname>{user.fullname}</Fullname>
									<Username>@{user.username}</Username>
									<LikesCount>
										<HeartImage
											image={require( "../images/heart.svg" )}
										/>
										{user.totalLikes}
									</LikesCount>
									<Description>{user.description}</Description>
									<Hobbies>
										{user.hobbies && user.hobbies.map(( hobbie, index ) =>
											<Hobbie key={index}>
												{hobbie}
											</Hobbie>
										)}
									</Hobbies>
									<ProfileOptions
										user={this.state.user}
										follow={this.follow}
										addFriend={this.addFriend}
										unFriend={this.unFriend}
										unFollow={this.unFollow}
										goToUserSettings={this.props.goToUserSettings}
										userRequested={this.state.userRequested}
										targetRequested={this.state.targetRequested}
										startChat={() => this.startChat( user )}
									/>
								</FloatingUserInfo>

								<ProfileTimeLine
									tab={this.state.tab}
									socket={this.props.socket}
									history={this.props.history}
									username={this.props.username}
									toggleTab={this.toggleTab}
									profilePosts={this.props.feedPosts}
									user={user}
								/>
							</TimeLine>

							{this.props.explore &&
								<React.Fragment>
									<NextButton
										className="nextButton"
										circular
										icon="angle double right"
										size="large"
										onClick={this.props.next}
									/>
									<BackButton
										className="backButton"
										circular
										icon="close"
										size="large"
										onClick={this.props.backToMenu}
									/>
								</React.Fragment>
							}
						</Page>
					</MediaDimmer>

				</StyledInfiniteScroll>
			</Wrapper>
		);
	}
}

UserProfile.propTypes = {
	socket: PropTypes.object.isRequired,
	username: PropTypes.string.isRequired,
	feedPosts: PropTypes.array.isRequired,
	backToMenu: PropTypes.func,
	next: PropTypes.func
};

const
	mapStateToProps = state => ({
		mediaOptions: state.posts.mediaOptions,
		displayMessages: state.conversations.displayMessages,
		displayNotifications: state.notifications.displayNotifications,
		feedPosts: state.posts.feedPosts,
		authenticated: state.authenticated
	}),

	mapDispatchToProps = dispatch => ({
		setPosts: ( posts ) => dispatch( setPosts( posts )),
		addToPosts: ( posts ) => dispatch( addToPosts( posts )),
		switchMediaOptions: () => dispatch( switchMediaOptions()),
		switchMessages: () => dispatch( switchMessages()),
		switchNotifications: () => dispatch( switchNotifications())
	});

export default connect( mapStateToProps, mapDispatchToProps )( UserProfile );
