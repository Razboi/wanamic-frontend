import React, { Component } from "react";
import styled from "styled-components";
import { Image } from "semantic-ui-react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import moment from "moment";
import api from "../services/api";
import {
	checkNotifications, addToNotifications, setNotifications
} from "../services/actions/notifications";
import { switchPostDetails } from "../services/actions/posts";
import { withRouter } from "react-router";
import refreshToken from "../utils/refreshToken";
import NotificationButton from "../components/NotificationButton";
import NavBar from "../containers/NavBar";
import InfiniteScroll from "react-infinite-scroller";

const
	Wrapper = styled.div`
		height: 100vh;
		width: 100%;
		overflow-y: auto;
		@media (max-width: 760px) {
			padding-top: 49.33px;
			::-webkit-scrollbar {
				display: none !important;
			};
		};
		@media (min-width: 760px) and (min-height: 400px) {
			height: 400px;
			width: 400px;
			position: absolute;
			bottom: -393px;
			left: 0;
			background: #fff;
			border-radius: 2px;
			box-shadow: 0 3px 8px rgba(0, 0, 0, .25);
			border: 1px solid rgba(0,0,0,0.1);
			z-index: 5;
			border-top: 0;
		};
	`,
	StyledInfiniteScroll = styled( InfiniteScroll )`
		height: 100%;
		width: 100%;
	`,
	Header = styled.div`
		color: #111;
		padding: 15px 0px;
		font-size: 17px;
		font-weight: bold;
		border-bottom: 1px solid rgba(0, 0, 0, .1);
		text-align: center;
		@media (min-width: 960px) {
			color: #333;
			padding: 7px 0;
			font-size: 1rem;
			background: rgba(133,217,191,0.34);
			border-bottom: 0;
		}
	`,
	Notification = styled.div`
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		padding: 1rem;
		background: #fff;
		:hover {
			cursor: pointer;
		}
	`,
	NotificationImg = styled( Image )`
		width: 35px !important;
		height: 35px !important;
		align-self: flex-start;
	`,
	MediaImg = styled( Image )`
		max-width: 40px !important;
		height: 40px !important;
	`,
	NotificationData = styled.div`
		display: flex;
		flex: 1 0 0%;
		flex-direction: column;
		margin: 0 0.5rem;
	`,
	TimeAgo = styled.span`
		color: rgba(0,0,0,0.45) !important;
	`,
	Content = styled.p`
		color: ${props => props.alert ? "red" : "#222"};
		margin-bottom: 0px;
		font-size: 15px;
	`,
	LoaderDimmer = styled.div`
		position: absolute;
		left: 0;
		top: 0;
		height: 100%;
		width: 100%;
		z-index: 5;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	`;

class Notifications extends Component {
	constructor() {
		super();
		this.state = {
			displayDetails: false,
			displayComments: false,
			postId: "",
			alreadyFollowing: [],
			network: undefined,
			skip: 0,
			hasMore: true,
			loader: false
		};
	}

	componentDidMount() {
		this.getNotifications();
		this.getNetwork();
		this.checkNotifications();
	}

	getNetwork = async() => {
		try {
			const network = await api.getUserNetwork(
				localStorage.getItem( "username" ));
			if ( network === "jwt expired" ) {
				await refreshToken();
				this.getNetwork();
			} else if ( network.data ) {
				this.setState({ network: network.data.requester });
			}
		} catch ( err ) {
			console.log( err );
		}
	}

	handleDetails = ( notification, notificationIndex ) => {
		switch ( true ) {
		case notification.follow || notification.friendRequest:
			this.props.history.push( "/" + notification.author.username );
			break;
		default:
			this.getPost( notification.object );
		}
	}

	getPost = async postId => {
		let post;
		try {
			post = await api.getPost( postId );
		} catch ( err ) {
			console.log( err );
		}
		this.props.switchPostDetails( post.data );
	}

	checkNotifications = () => {
		api.checkNotifications()
			.then( res => {
				if ( res === "jwt expired" ) {
					refreshToken()
						.then(() => this.checkNotification())
						.catch( err => console.log( err ));
				} else {
					this.props.checkNotifications();
				}
			}).catch( err => console.log( err ));
	}

	switchDetails = () => {
		this.setState({ displayDetails: !this.state.displayDetails });
	}

	handleFollow = async user => {
		var network = this.state.network;
		try {
			const notification = await api.followUser( user.username );
			if ( notification === "jwt expired" ) {
				await refreshToken();
				this.handleFollow();
			} else if ( notification.data ) {
				this.props.socket.emit( "sendNotification", notification.data );
				network.following.push( user._id );
				this.setState({ network: network });
			}
		} catch ( err ) {
			console.log( err );
		}
	}

	unFollow = async user => {
		var network = this.state.network;
		try {
			const response = await api.unfollowUser( user.username );
			if ( response === "jwt expired" ) {
				await refreshToken();
				this.unFollow();
			} else {
				const index = network.following.indexOf( user._id );
				network.following.splice( index, 1 );
				this.setState({ network: network });
			}
		} catch ( err ) {
			console.log( err );
		}
	}

	unFriend = async user => {
		var network = this.state.network;
		try {
			const response = await api.deleteFriend( user.username );
			if ( response === "jwt expired" ) {
				await refreshToken();
				this.unFriend();
			} else {
				const index = network.friends.indexOf( user._id );
				network.friends.splice( index, 1 );
				this.setState({ network: network });
			}
		} catch ( err ) {
			console.log( err );
		}
	}

	acceptRequest = async user => {
		var network = this.state.network;
		try {
			const response = await api.acceptRequest( user.username );
			if ( response === "jwt expired" ) {
				await refreshToken();
				this.acceptRequest();
			} else {
				network.friends.push( user._id );
				this.setState({ network: network });
			}
		} catch ( err ) {
			console.log( err );
		}
	}

	getNotifications = async() => {
		if ( this.state.hasMore && !this.state.loader ) {
			try {
				this.setState({ loader: true });
				const res = await api.getNotifications( this.state.skip );
				if ( res === "jwt expired" ) {
					await refreshToken();
					this.getNotifications();
				} else if ( res.data ) {
					this.state.skip === 0 ?
						this.props.setNotifications( res.data.notifications )
						:
						this.props.addToNotifications( res.data.notifications );
					this.setState({
						hasMore: res.data.notifications.length === 10,
						skip: this.state.skip + 1,
						loader: false
					});
				}
			} catch ( err ) {
				console.log( err );
			}
		}
	}

	render() {
		const
			s3Bucket = "https://d3dlhr4nnvikjb.cloudfront.net/",
			{ displayPostDetails, history } = this.props;
		if ( displayPostDetails && history.location.pathname !== "/notifications" ) {
			return null;
		}
		return (
			<Wrapper>
				<StyledInfiniteScroll
					pageStart={this.state.skip}
					hasMore={this.state.hasMore}
					loadMore={this.getNotifications}
					initialLoad={false}
					useWindow={false}
				>
					{!this.props.isPopup &&
						<NavBar socket={this.props.socket} />
					}
					<Header>Notifications</Header>
					{this.state.network &&
					<div>
						{this.state.loader &&
							<LoaderDimmer>
								<div className="lds-ring"><div></div><div></div><div></div><div></div></div>
							</LoaderDimmer>
						}
						{this.props.notifications.map(( notification, index ) =>
							notification.author &&
								notification.alert ?
								<Notification key={index}>
									<Content alert>
										{notification.content} <a href="/information/content">Content Policy of Wanamic</a>
									</Content>
								</Notification>
								:
								<Notification key={index}>
									<NotificationImg
										onClick={() => this.handleDetails( notification, index )}
										circular
										src={notification.author.profileImage ?
											process.env.REACT_APP_STAGE === "dev" ?
												require( "../images/" + notification.author.profileImage )
												:
												s3Bucket + notification.author.profileImage
											:
											require( "../images/defaultUser.png" )
										}
									/>
									<NotificationData
										onClick={() => this.handleDetails( notification, index )}
									>
										<Content>
											<b>{notification.author.fullname}</b> {notification.content}
										</Content>
										<TimeAgo>
											{moment( notification.createdAt ).fromNow()}
										</TimeAgo>
									</NotificationData>
									{notification.mediaImg &&
										<MediaImg
											onClick={() => this.handleDetails( notification, index )}
											src={notification.externalImg ?
												notification.mediaImg
												:
												process.env.REACT_APP_STAGE === "dev" ?
													require( "../images/" + notification.mediaImg )
													:
													s3Bucket + notification.mediaImg}
										/>
									}
									<NotificationButton
										network={this.state.network}
										notification={notification}
										acceptRequest={() =>
											this.acceptRequest( notification.author )}
										handleFollow={() =>
											this.handleFollow( notification.author )}
										unFollow={() =>
											this.unFollow( notification.author )}
										unFriend={() =>
											this.unFriend( notification.author )}
									/>
								</Notification>
						)}
					</div>}
				</StyledInfiniteScroll>
			</Wrapper>
		);
	}
}

Notifications.propTypes = {
	notifications: PropTypes.array.isRequired,
	checkNotifications: PropTypes.func.isRequired,
	socket: PropTypes.object.isRequired,
	history: PropTypes.object.isRequired,
	isPopup: PropTypes.bool
};

const
	mapStateToProps = state => ({
		notifications: state.notifications.allNotifications,
		displayComments: state.posts.displayComments,
		displayPostDetails: state.posts.displayPostDetails
	}),

	mapDispatchToProps = dispatch => ({
		checkNotifications: () => dispatch( checkNotifications()),
		setNotifications: notif => dispatch( setNotifications( notif )),
		addToNotifications: notif => dispatch( addToNotifications( notif )),
		switchPostDetails: post => dispatch( switchPostDetails( post ))
	});

export default withRouter(
	connect( mapStateToProps, mapDispatchToProps )( Notifications )
);
