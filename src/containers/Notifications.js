import React, { Component } from "react";
import styled from "styled-components";
import { Divider } from "semantic-ui-react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import moment from "moment";
import PostDetails from "./PostDetails";
import Comments from "./Comments";
import api from "../services/api";
import { switchComments } from "../services/actions/posts";
import { checkNotification } from "../services/actions/notifications";
import { withRouter } from "react-router";

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
		padding: 10px;
		background: ${props => props.checked ? "#fff" : "#D3D3D3"}
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
	`,
	StyledDivider = styled( Divider )`
		margin: 0px !important;
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
		if ( notification.follow || notification.friendRequest ) {
			this.props.history.push( "/" + notification.author );
		}
		if ( notification.comment ) {
			this.props.switchComments( notification.object );
		}
		if ( !notification.follow && !notification.comment ) {
			this.setState({ postId: notification.object, displayDetails: true });
		}
		api.checkNotification( notification._id )
			.catch( err => console.log( err ));
		if ( !notification.checked ) {
			this.props.checkNotification( notificationIndex );
		}
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
							<Content><b>{notification.author}</b> {notification.content}</Content>
							<TimeAgo>{moment( notification.createdAt ).fromNow()}</TimeAgo>
						</Notification>
						<StyledDivider />
					</React.Fragment>
				)}
			</Wrapper>
		);
	}
}

Notifications.propTypes = {
	notifications: PropTypes.array.isRequired
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
