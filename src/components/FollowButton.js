import React, { Component } from "react";
import { Button } from "semantic-ui-react";
import styled from "styled-components";
import PropTypes from "prop-types";

const
	FollowButton = styled( Button )`
		position: absolute !important;
		right: 0 !important;
		top: 0 !important;
		font-family: inherit !important;
		background: ${props => props.active ?
		"rgb(133, 217, 191)" : "#fff"} !important;
		color: ${props => props.active ?
		"#fff" : "rgb(133, 217, 191)"} !important;
		border-radius: 2px !important;
		border: ${props => props.active ?
		"none" : "1px solid rgb(133, 217, 191)"} !important;
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
					onClick={() => handleUnfollow( user.username, user._id )}
					content="Following"
					active
				/>
			);
		}
		if ( alreadyFriends ) {
			return (
				<FollowButton
					size="tiny"
					onClick={() => handleUnfriend( user.username, user._id )}
					content="Friends"
					active
				/>
			);
		}
		return (
			<FollowButton
				size="tiny"
				onClick={() => handleFollow( user.username, user._id )}
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
