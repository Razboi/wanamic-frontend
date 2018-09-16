import React, { Component } from "react";
import styled from "styled-components";
import { Button } from "semantic-ui-react";
import PropTypes from "prop-types";

const StyledButton = styled( Button )`
	font-family: inherit !important;
	background: ${props => props.primary ?
		"rgb(133, 217, 191)" : "#fff"} !important;
	color: ${props => props.primary ?
		"#fff" : "rgb(133, 217, 191)"} !important;
	border-radius: 2px !important;
	border: ${props => props.primary ?
		"none" : "1px solid rgb(133, 217, 191)"} !important;
`;

class NotificationButton extends Component {
	render() {
		const { notification, network } = this.props;
		if ( notification.friendRequest ) {
			return (
				<React.Fragment>
					{network.friends.includes( notification.author._id ) ?
						<StyledButton
							onClick={this.props.unFriend}
							size="tiny"
							content="Friend"
						/>
						:
						<StyledButton
							onClick={this.props.acceptRequest}
							primary
							size="tiny"
							content="Accept"
						/>
					}
				</React.Fragment>
			);
		}
		return null;
	}
}

NotificationButton.propTypes = {
	notification: PropTypes.object.isRequired,
	network: PropTypes.object.isRequired,
	acceptRequest: PropTypes.func.isRequired,
	unFollow: PropTypes.func.isRequired,
	unFriend: PropTypes.func.isRequired,
	handleFollow: PropTypes.func.isRequired
};

export default NotificationButton;
