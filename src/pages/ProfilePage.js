import React, { Component } from "react";
import UserProfile from "../containers/UserProfile";
import ChatsList from "../containers/ChatsList";
import UserAlbum from "../containers/UserAlbum";
import PropTypes from "prop-types";


class ProfilePage extends Component {
	constructor() {
		super();
		this.state = {
			displayConversation: false,
			messageTarget: {},
			tab: undefined
		};
	}

	backToMain = () => {
		this.props.history.push( "/" );
	}
	goToUserSettings = () => {
		this.props.history.push( "/settings" );
	}
	toggleConversation = user => {
		this.setState({
			displayConversation: !this.state.displayConversation,
			messageTarget: user
		});
	}
	toggleTab = tab => {
		this.setState({ tab: tab });
	}
	render() {
		if ( this.state.displayConversation ) {
			return (
				<ChatsList
					messageTarget={this.state.messageTarget}
					toggleConversation={this.toggleConversation}
					toggleTab={this.toggleTab}
					socket={this.props.socket}
				/>
			);
		}
		if ( this.state.tab === "Album" ) {
			return (
				<UserAlbum
					username={this.props.match.params.username}
					toggleTab={this.toggleTab}
				/>
			);
		}
		return (
			<UserProfile
				socket={this.props.socket}
				username={this.props.match.params.username}
				backToMain={this.backToMain}
				goToUserSettings={this.goToUserSettings}
				toggleConversation={this.toggleConversation}
				toggleTab={this.toggleTab}
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
