import React, { Component } from "react";
import UserProfile from "../containers/UserProfile";
import PropTypes from "prop-types";


class ProfilePage extends Component {
	backToMain = () => {
		this.props.history.push( "/" );
	}
	render() {
		return (
			<UserProfile
				socket={this.props.socket}
				username={this.props.match.params.username}
				backToMain={this.backToMain}
			/>
		);
	}
}

ProfilePage.propTypes = {
	match: PropTypes.shape({
		params: PropTypes.shape({
			username: PropTypes.string.isRequired
		})
	}),
};

export default ProfilePage;
