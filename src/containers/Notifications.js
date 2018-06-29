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
		padding: 1rem;
		background: ${props => props.checked ? "#fff" : "rgba(0, 0, 0, .1)"};
		border-bottom: 1px solid rgba(0, 0, 0, .1);
	`,
	NotificationImg = styled( Image )`
		width: 35px !important;
		height: 35px !important;
	`,
	NotificationData = styled.div`
		display: flex;
		flex-direction: column;
		margin-left: 0.5rem;
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
			postId: ""
		};
	}

	handleDetails = ( notification, notificationIndex ) => {
		switch ( true ) {
		case notification.follow || notification.friendRequest:
			this.props.history.push( "/" + notification.author );
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
		return (
			<Wrapper>
				<Header>Notifications</Header>
				{this.props.notifications.map(( notification, index ) =>
					<React.Fragment key={index}>
						<Notification
							onClick={() => this.handleDetails( notification, index )}
							checked={notification.checked}
						>
							<NotificationImg
								circular
								src={notification.authorImg ?
									require( "../images/" + notification.authorImg )
									:
									require( "../images/defaultUser.png" )
								}
							/>
							<NotificationData>
								<Content>
									<b>{notification.authorFullname}</b> {notification.content}
								</Content>
								<TimeAgo>
									{moment( notification.createdAt ).fromNow()}
								</TimeAgo>
							</NotificationData>
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
