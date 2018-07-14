import React, { Component } from "react";
import UserProfile from "../containers/UserProfile";
import Messages from "../pages/Messages";
import UserAlbum from "../containers/UserAlbum";
import UserNetwork from "../containers/UserNetwork";
import UserInformation from "../containers/UserInformation";
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
		const username = this.props.user ?
			this.props.user.username
			:
			this.props.match.params.username;
		if ( this.state.displayConversation ) {
			return (
				<Messages
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
					username={username}
					toggleTab={this.toggleTab}
				/>
			);
		}
		if ( this.state.tab === "Network" ) {
			return (
				<UserNetwork
					username={username}
					toggleTab={this.toggleTab}
					socket={this.props.socket}
				/>
			);
		}
		if ( this.state.tab === "Information" ) {
			return (
				<UserInformation
					username={username}
					toggleTab={this.toggleTab}
				/>
			);
		}
		return (
			<UserProfile
				socket={this.props.socket}
				username={username}
				backToMain={ this.props.explore ?
					this.props.backToMenu
					:
					this.backToMain}
				goToUserSettings={this.goToUserSettings}
				toggleConversation={this.toggleConversation}
				toggleTab={this.toggleTab}
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
