import React, { Component } from "react";
import styled from "styled-components";
import UserAlbum from "../containers/UserAlbum";
import UserNetwork from "../containers/UserNetwork";
import UserInformation from "../containers/UserInformation";
import PropTypes from "prop-types";
import NewsFeed from "../components/NewsFeed";

const
	UserPostsWrapper = styled.div`
		background: #fff;
		margin-top: 1rem;
		@media (min-width: 420px) {
			background: none;
			padding: 0 5px;
		}
	`,
	StyledNewsFeed = styled( NewsFeed )`
		height: 100%;
	`,
	EmptyPostsAlert = styled.div`
		display: flex;
		background: #fff;
		margin-top: 1rem;
		min-height: 100px;
		align-items: center;
		justify-content: center;
		@media (min-width: 420px) {
			width: 600px;
			margin-top: 3rem;
			padding: 0 5px;
		}
	`;

class ProfileTimeline extends Component {

	render() {
		const { username, user, toggleTab } = this.props;
		if ( this.props.tab === "Album" ) {
			return (
				<UserAlbum
					username={username}
					toggleTab={toggleTab}
					socket={this.props.socket}
				/>
			);
		}
		if ( this.props.tab === "Network" ) {
			return (
				<UserNetwork
					username={username}
					toggleTab={toggleTab}
					socket={this.props.socket}
					history={this.props.history}
				/>
			);
		}
		if ( this.props.tab === "Information" ) {
			return (
				<UserInformation
					username={username}
					toggleTab={toggleTab}
				/>
			);
		}
		return (
			<React.Fragment>
				{this.props.profilePosts.length > 0 ?
					<UserPostsWrapper>
						<StyledNewsFeed
							posts={this.props.profilePosts}
							socket={this.props.socket}
						/>
					</UserPostsWrapper>
					:
					<EmptyPostsAlert>
						@{user.username} hasn't posted yet.
					</EmptyPostsAlert>}
			</React.Fragment>
		);
	}
}

ProfileTimeline.propTypes = {
	tab: PropTypes.string,
	socket: PropTypes.object.isRequired,
	history: PropTypes.object.isRequired,
	username: PropTypes.string.isRequired,
	toggleTab: PropTypes.func.isRequired,
	profilePosts: PropTypes.array.isRequired,
	user: PropTypes.object.isRequired
};

export default ProfileTimeline;
