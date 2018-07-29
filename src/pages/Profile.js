import React, { Component } from "react";
import UserProfile from "../containers/UserProfile";
import PropTypes from "prop-types";


class ProfilePage extends Component {

	componentDidMount() {
		const { match } = this.props;
		if ( match && match.params.username === "post" ) {
			window.history.back();
		}
	}

	backToMain = () => {
		this.props.history.push( "/" );
	}
	goToUserSettings = () => {
		this.props.history.push( "/settings" );
	}

	render() {
		const
			{ match, user } = this.props,

			username = user ?
				user.username
				:
				match.params.username;

		if ( match && match.params.username === "post" ) {
			return null;
		}

		return (
			<UserProfile
				socket={this.props.socket}
				history={this.props.history}
				username={username}
				backToMain={ this.props.explore ?
					this.props.backToMenu
					:
					this.backToMain}
				goToUserSettings={this.goToUserSettings}
				next={this.props.next}
				explore={this.props.explore}
				user={this.props.user}
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
