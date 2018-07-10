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
		@media (max-width: 420px) {
			margin: 0px;
		}
	`,
	Username = styled.span`
		@media (max-width: 420px) {
			color: rgba( 0,0,0,0.5 );
		}
	`,
	Description = styled.p`
		@media (max-width: 420px) {
			margin: 1rem 0;
			text-align: left;
			font-size: 1.025rem;
			padding: 0 0.66rem;
		}
	`,
	Hobbies = styled.div`
		@media (max-width: 420px) {
			text-align: center;
			font-size: 1.025rem;
			color: rgba( 0,0,0,0.5 );
			padding: 0 0.66rem;
		}
	`,
	Tabs = styled.div`
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
	BackButton = styled( Button )`
		position: absolute;
		bottom: 10px;
		left: 10px;
	`,
	NextButton = styled( Button )`
		position: absolute;
		bottom: 10px;
		right: 10px;
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
			pendingRequest: false
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

	getUserInfo = () => {
		if ( this.props.user && this.props.explore ) {
			this.setImages();
		} else {
			api.getUserInfo( this.props.username )
				.then( res => {
					this.setState({ user: res.data });
				})
				.catch( err => {
					console.log( err );
					this.setState({ inexistent: true });
				});
		}
	}

	checkPendingRequest = () => {
		api.isRequested( this.props.username )
			.then( res => {
				if ( res === "jwt expired" ) {
					refreshToken()
						.then(() => this.checkPendingRequest())
						.catch( err => console.log( err ));
				} else {
					this.setState({ pendingRequest: res.data });
				}
			}).catch( err => console.log( err ));
	}

	setImages() {
		const { user } = this.state;

		try {
			if ( user.headerImage ) {
				backgroundImg = require( "../images/" + user.headerImage );
			} else {
				backgroundImg = require( "../images/defaultbg.png" );
			}
		} catch ( err ) {
			console.log( err );
		}

		try {
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

	handleAddFriend = () => {
		api.addFriend( this.props.username )
			.then( res => {
				if ( res === "jwt expired" ) {
					refreshToken()
						.then(() => this.handleAddFriend())
						.catch( err => console.log( err ));
				} else {
					this.props.socket.emit( "sendNotification", res.data );
				}
			}).catch( err => console.log( err ));
	}

	handleFollow = () => {
		api.followUser( this.props.username )
			.then( res => {
				if ( res === "jwt expired" ) {
					refreshToken()
						.then(() => this.handleFollow())
						.catch( err => console.log( err ));
				} else {
					this.props.socket.emit( "sendNotification", res.data );
					this.refreshTimeline();
				}
			}).catch( err => console.log( err ));
	}

	handleReqAccept = () => {
		api.acceptRequest( this.props.username )
			.then( res => {
				if ( res === "jwt expired" ) {
					refreshToken()
						.then(() => this.handleReqAccept())
						.catch( err => console.log( err ));
				}
			}).catch( err => console.log( err ));
	}

	handleReqDelete = () => {
		api.acceptRequest( this.props.username )
			.then( res => {
				if ( res === "jwt expired" ) {
					refreshToken()
						.then(() => this.handleReqDelete())
						.catch( err => console.log( err ));
				}
			}).catch( err => console.log( err ));
	}

	handleDeleteFriend = () => {
		api.deleteFriend( this.props.username )
			.then( res => {
				if ( res === "jwt expired" ) {
					refreshToken()
						.then(() => this.handleDeleteFriend())
						.catch( err => console.log( err ));
				}
			}).catch( err => console.log( err ));
	}

	handleMessage = messageTarget => {
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
							<Description>{user.description}</Description>
							<Hobbies>{user.keywords}</Hobbies>
							<ProfileOptions
								user={this.state.user}
								handleFollow={this.handleFollow}
								handleAddFriend={this.handleAddFriend}
								handleDeleteFriend={this.handleDeleteFriend}
								goToUserSettings={this.props.goToUserSettings}
								requested={this.state.pendingRequest}
								handleMessage={() => this.handleMessage( user )}
							/>
							<Tabs>
								<span onClick={() => this.props.toggleTab( "Info" )}>
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
					<UserPostsWrapper>
						<StyledNewsFeed
							posts={this.state.posts}
							socket={this.props.socket}
						/>
					</UserPostsWrapper>

					{this.props.explore && this.props.next &&
						<NextButton
							className="nextButton"
							primary
							content="Next"
							onClick={this.props.next}
						/>
					}
					{this.props.explore && this.props.backToMenu &&
						<BackButton
							className="backButton"
							secondary
							content="Back to menu"
							onClick={this.props.backToMenu}
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
