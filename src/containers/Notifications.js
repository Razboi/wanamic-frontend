import React, { Component } from "react";
import styled from "styled-components";
import { Image } from "semantic-ui-react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import moment from "moment";
import PostDetails from "./PostDetails";
import Comments from "./Comments";
import api from "../services/api";
import { switchComments } from "../services/actions/posts";
import { checkNotification } from "../services/actions/notifications";
import { withRouter } from "react-router";
import refreshToken from "../utils/refreshToken";
import NotificationButton from "../components/NotificationButton";

const
	Wrapper = styled.div`
		height: 100vh;
		width: 100%;
		position: absolute;
		z-index: 3;
		background: #fff;
		padding-top: 49.33px;
	`,
	Notification = styled.div`
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		padding: 1rem;
		background: #fff;
		border-bottom: 1px solid rgba(0, 0, 0, .1);
	`,
	NotificationImg = styled( Image )`
		width: 35px !important;
		height: 35px !important;
		align-self: flex-start;
	`,
	MediaImg = styled( Image )`
		width: 40px !important;
		height: 40px !important;
	`,
	NotificationData = styled.div`
		display: flex;
		flex: 1 0 0%;
		flex-direction: column;
		margin: 0 0.5rem;
	`,
	TimeAgo = styled.span`
		color: #808080;
	`,
	Content = styled.p`
		margin-bottom: 0px;
		font-size: 15px;
	`,
	Header = styled.div`
		border-bottom: 1px solid #000;
		padding: 15px 10px;
		font-size: 17px;
		font-weight: bold;
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
		};
	}

	componentDidMount() {
		this.getNetwork();
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
		case notification.comment:
			this.props.switchComments( notification.object );
			break;
		default:
			this.setState({ postId: notification.object, displayDetails: true });
		}

		if ( !notification.checked ) {
			this.checkNotification( notification, notificationIndex );
		}
	}

	checkNotification = ( notification, notificationIndex ) => {
		api.checkNotification( notification._id )
			.then( res => {
				if ( res === "jwt expired" ) {
					refreshToken()
						.then(() => this.checkNotification( notification ))
						.catch( err => console.log( err ));
				} else {
					this.props.checkNotification( notificationIndex );
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

	render() {
		if ( this.state.displayComments ) {
			return (
				<Comments />
			);
		}
		if ( this.state.displayDetails ) {
			return (
				<PostDetails
					postId={this.state.postId}
					switchDetails={this.switchDetails}
				/>
			);
		}
		if ( !this.state.network ) {
			return null;
		}
		return (
			<Wrapper>
				<Header>Notifications</Header>
				{this.props.notifications.map(( notification, index ) =>
					<React.Fragment key={index}>
						<Notification checked={notification.checked}>
							<NotificationImg
								onClick={() => this.handleDetails( notification, index )}
								circular
								src={notification.author.profileImage ?
									require( "../images/" + notification.author.profileImage )
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
									src={notification.externalImg ?
										notification.mediaImg
										:
										require( "../images/" + notification.mediaImg )
									}
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
					</React.Fragment>
				)}
			</Wrapper>
		);
	}
}

Notifications.propTypes = {
	notifications: PropTypes.array.isRequired,
	switchComments: PropTypes.func.isRequired,
	checkNotification: PropTypes.func.isRequired,
};

const
	mapStateToProps = state => ({
		notifications: state.notifications.allNotifications
	}),

	mapDispatchToProps = dispatch => ({
		switchComments: ( id ) => dispatch( switchComments( id )),
		checkNotification: index => dispatch( checkNotification( index ))
	});

export default withRouter(
	connect( mapStateToProps, mapDispatchToProps )( Notifications )
);
