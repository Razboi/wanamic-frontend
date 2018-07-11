import React, { Component } from "react";
import { Button } from "semantic-ui-react";
import PropTypes from "prop-types";

class NotificationButton extends Component {
	render() {
		const { notification, network } = this.props;
		if ( notification.friendRequest ) {
			return (
				<React.Fragment>
					{network.friends.includes( notification.author._id ) ?
						<Button
							onClick={this.props.unFriend}
							size="tiny"
							content="Friend"
						/>
						:
						<Button
							onClick={this.props.acceptRequest}
							primary
							size="tiny"
							content="Accept"
						/>
					}
				</React.Fragment>
			);
		}
		if ( notification.follow ) {
			return (
				<React.Fragment>
					{network.friends.includes( notification.author._id ) ?
						<Button
							onClick={this.props.unFriend}
							size="tiny"
							content="Friend"
						/>
						:
						network.following.includes( notification.author._id ) ?
							<Button
								onClick={this.props.unFollow}
								size="tiny"
								content="Following"
							/>
							:
							<Button
								onClick={this.props.handleFollow}
								primary
								size="tiny"
								content="Follow"
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
