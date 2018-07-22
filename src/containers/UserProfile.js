import React, { Component } from "react";
import styled from "styled-components";
import { Button, Icon } from "semantic-ui-react";
import api from "../services/api";
import PropTypes from "prop-types";
import refreshToken from "../utils/refreshToken";
import NewsFeed from "../components/NewsFeed";
import InfiniteScroll from "react-infinite-scroller";
import ProfileOptions from "../components/ProfileOptions";

var
	backgroundImg,
	profileImg;

const
	Wrapper = styled.div`
		min-height: 100vh;
		height: 100%;
		width: 100%;
		display: flex;
		flex-direction: column;
		background: rgba( 0,0,0,0.1 );
	`,
	StyledInfiniteScroll = styled( InfiniteScroll )`
		height: 100%;
		width: 100%;
	`,
	UserInfoWrapper = styled.div`
		background: #fff;
	`,
	BackIcon = styled( Icon )`
		font-size: 1.3rem !important;
		position: absolute;
		top: 0.66rem;
		left: 0.66rem;
		color: #fff;
		z-index: 2;
	`,
	UserInfo = styled.div`
		margin-top: -5rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		z-index: 2;
	`,
	UserInfoBackground = styled.div`
		height: 180px;
		background-image: url(${props => props.backgroundImg});
		background-size: cover;
		filter: brightness(85%);
	`,
	UserImage = styled.img`
		@media (max-width: 420px) {
			z-index: 2;
			width: 116px;
			height: 116px;
			border-radius: 4px;
			border: 2px solid #fff;
			box-shadow: 0 1px 2px rgba(0, 0, 0, .125);
		}
	`,
	Fullname = styled.h2`
		font-family: inherit;
		color: #111;
		@media (max-width: 420px) {
			margin: 0px;
		}
	`,
	Username = styled.span`
		@media (max-width: 420px) {
			color: rgba( 0,0,0,0.5 );
		}
	`,
	LikesCount = styled.div`
		color: #555 !important;
		@media (max-width: 420px) {
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
		}
	`,
	Description = styled.p`
		color: #222;
		@media (max-width: 420px) {
			margin: 2rem 0 0.5rem 0;
			text-align: left;
			font-size: 1.025rem;
			padding: 0 0.66rem;
		}
	`,
	Hobbies = styled.div`
		@media (max-width: 420px) {
			display: flex;
			flex-wrap: wrap;
	    width: 90%;
	    align-items: center;
	    justify-content: center;
			margin: 1rem 0;
		}
	`,
	Hobbie = styled.div`
		@media (max-width: 420px) {
			border: 1px solid #EFEEEE;
			color: #333;
			border-radius: 2px;
	    padding: 0.5rem;
	    font-size: 1rem;
	    font-weight: bold;
			margin: 0.5rem 0 0 0.5rem;
			box-shadow: 0 2px 2px rgba(0, 0, 0, .125);
		}
	`,
	Tabs = styled.div`
		color: #222;
		@media (max-width: 420px) {
			display: flex;
			flex-direction: row;
			width: 100%;
    	justify-content: space-around;
			margin-top: 2rem;
			padding: 1rem 0;
    	border-top: 2px solid #D3D3D3;
			border-bottom: 1px solid #bec2c9;;
		}
	`,
	UserPostsWrapper = styled.div`
		background: #fff;
		margin-top: 1rem;
	`,
	StyledNewsFeed = styled( NewsFeed )`
		height: 100%;
	`,
	EmptyPostsAlert = styled.div`
		display: flex;
		background: #fff;
		margin-top: 1rem;
		min-height: 100px;
		align-items: center;
		justify-content: center;
	`,
	NextButton = styled( Button )`
		position: fixed;
		bottom: 10px;
		right: 10px;
		background: rgba( 0,0,0,0.5 ) !important;
		color: #fff !important;
	`,
	HeartImage = styled.span`
		height: 16px;
		width: 16px;
		display: block;
		background-image: url(${props => props.image});
		background-repeat: no-repeat;
		margin: 0 0.5rem 0 0;
	`;


class UserProfile extends Component {
	constructor() {
		super();
		this.state = {
			user: undefined,
			posts: [],
			hasMore: true,
			skip: 1,
			inexistent: false,
			userRequested: false,
			targetRequested: false
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
		this.refreshTimeline();
		this.checkPendingRequest();
	}

	componentDidUpdate( prevProps, prevState ) {
		if ( this.state.user !== prevState.user ) {
			this.refreshTimeline();
			this.setImages();
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
	}

	checkPendingRequest = async() => {
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
		const { user } = this.state;

		try {
			if ( user.headerImage ) {
				backgroundImg = require( "../images/" + user.headerImage );
			} else {
				backgroundImg = require( "../images/defaultbg.png" );
			}
			if ( user.profileImage ) {
				profileImg = require( "../images/" + user.profileImage );
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
				if ( posts === "jwt expired" ) {
					await refreshToken();
					this.getTimeline();
				} else if ( posts.data ) {
					this.setState({
						posts: [ ...this.state.posts, ...posts.data ],
						hasMore: posts.data.length > 10,
						skip: this.state.skip + 1
					});
				}
			} catch ( err ) {
				console.log( err );
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
				this.setState({
					posts: posts.data,
					hasMore: posts.data.length > 10,
				});
			}
		} catch ( err ) {
			console.log( err );
		}
	}

	addFriend = async() => {
		try {
			const response = await api.addFriend( this.props.username );
			if ( response === "jwt expired" ) {
				await refreshToken();
				this.addFriend();
			} else if ( response.data ) {
				this.setState({ userRequested: true });
				this.props.socket.emit( "sendNotification", response.data );
			}
		} catch ( err ) {
			console.log( err );
		}
	}

	follow = async() => {
		var user = this.state.user;
		try {
			const notification = await api.followUser( this.props.username );
			if ( notification === "jwt expired" ) {
				await refreshToken();
				this.follow();
			} else if ( notification.data ) {
				user.followers.push( localStorage.getItem( "id" ));
				this.setState({ user: user });
				this.props.socket.emit( "sendNotification", notification.data );
				this.refreshTimeline();
			}
		} catch ( err ) {
			console.log( err );
		}
	}

	unFriend = async() => {
		var user = this.state.user;
		try {
			const response = await api.deleteFriend( this.props.username );
			if ( response === "jwt expired" ) {
				await refreshToken();
				this.unFriend();
			} else {
				const index = user.friends.indexOf(
					localStorage.getItem( "id" ));
				user.friends.splice( index, 1 );
				this.setState({ user: user });
				this.refreshTimeline();
			}
		} catch ( err ) {
			console.log( err );
		}
	}

	unFollow = async() => {
		var user = this.state.user;
		try {
			const response = await api.unfollowUser( this.props.username );
			if ( response === "jwt expired" ) {
				await refreshToken();
				this.unFollow();
			} else {
				const index = user.followers.indexOf(
					localStorage.getItem( "id" ));
				user.followers.splice( index, 1 );
				this.setState({ user: user });
				this.refreshTimeline();
			}
		} catch ( err ) {
			console.log( err );
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
		this.props.toggleConversation( messageTarget );
	}

	render() {
		if ( this.state.inexistent ) {
			return (
				<h2>This account doesn't exist</h2>
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
					useWindow={false}
				>
					<BackIcon
						name="chevron left"
						onClick={this.props.backToMain}
					/>

					<UserInfoBackground backgroundImg={backgroundImg} />
					<UserInfoWrapper>
						<UserInfo>
							<UserImage src={profileImg} />
							<Fullname>{user.fullname}</Fullname>
							<Username>@{user.username}</Username>
							<LikesCount>
								<HeartImage
									image={require( "../images/small_heart.png" )}
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
								acceptRequest={this.acceptRequest}
								goToUserSettings={this.props.goToUserSettings}
								userRequested={this.state.userRequested}
								targetRequested={this.state.targetRequested}
								startChat={() => this.startChat( user )}
							/>
							<Tabs>
								<span onClick={() =>
									this.props.toggleTab( "Information" )}>
									Information
								</span>
								<span onClick={() => this.props.toggleTab( "Album" )}>
									Album
								</span>
								<span onClick={() => this.props.toggleTab( "Network" )}>
									Network
								</span>
							</Tabs>
						</UserInfo>
					</UserInfoWrapper>
					{this.state.posts.length > 0 ?
						<UserPostsWrapper>
							<StyledNewsFeed
								posts={this.state.posts}
								socket={this.props.socket}
							/>
						</UserPostsWrapper>
						:
						<EmptyPostsAlert>
							@{user.username} hasn't posted yet.
						</EmptyPostsAlert>}

					{this.props.explore &&
						<NextButton
							className="nextButton"
							circular
							icon="angle double right"
							size="large"
							onClick={this.props.next}
						/>
					}
				</StyledInfiniteScroll>
			</Wrapper>
		);
	}
}

UserProfile.propTypes = {
	socket: PropTypes.object.isRequired,
	username: PropTypes.string.isRequired,
	toggleConversation: PropTypes.func.isRequired,
	toggleTab: PropTypes.func.isRequired
};

export default UserProfile;
