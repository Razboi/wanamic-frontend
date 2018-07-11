import React, { Component } from "react";
import { Button } from "semantic-ui-react";
import styled from "styled-components";
import PropTypes from "prop-types";

const
	FollowButton = styled( Button )`
		position: absolute !important;
		top: 0 !important;
		right: 0 !important;
		margin: 0 !important;
	`;

class FollowButtonComponent extends Component {
	render() {
		const {
			user, handleFollow, alreadyFollowing, alreadyFriends,
			handleUnfollow, handleUnfriend
		} = this.props;
		if ( alreadyFollowing ) {
			return (
				<FollowButton
					size="tiny"
					onClick={() => handleUnfollow( user.username )}
					content="Following"
					primary={true}
				/>
			);
		}
		if ( alreadyFriends ) {
			return (
				<FollowButton
					size="tiny"
					onClick={() => handleUnfriend( user.username )}
					content="Friends"
					primary={true}
				/>
			);
		}
		return (
			<FollowButton
				size="tiny"
				onClick={() => handleFollow( user.username )}
				content="Follow"
			/>
		);
	}
}

FollowButtonComponent.propTypes = {
	user: PropTypes.object.isRequired,
	handleFollow: PropTypes.func.isRequired,
	handleUnfollow: PropTypes.func.isRequired,
	handleUnfriend: PropTypes.func,
	alreadyFollowing: PropTypes.bool,
	alreadyFriends: PropTypes.bool,
};

export default FollowButtonComponent;
