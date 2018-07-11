import React, { Component } from "react";
import { Icon } from "semantic-ui-react";
import styled from "styled-components";
import PropTypes from "prop-types";


const
	Options = styled.div`
		@media (max-width: 420px) {
			display: flex;
			flex-direction: row;
			width: 100%;
			justify-content: space-evenly;
			margin-top: 2rem;
		}
	`,
	Option = styled.div`
		@media (max-width: 420px) {
			display: flex;
			flex-direction: column;
			align-items: center;
		}
	`,
	OptionIcon = styled( Icon )`
		@media (max-width: 420px) {
			margin: 0 !important;
		}
	`,
	OptionText = styled.div`
		@media (max-width: 420px) {
			font-size: 0.9rem;
			margin-top: 0.2rem;
		}
	`;

class ProfileOptions extends Component {
	render() {
		const { user } = this.props;
		if ( user.friends.includes( localStorage.getItem( "id" ))) {
			return (
				<Options>
					<Option onClick={this.props.handleDeleteFriend}>
						<OptionIcon name="remove user" size="large" />
						<OptionText>Unfriend</OptionText>
					</Option>
					<Option onClick={this.props.handleMessage}>
						<OptionIcon name="chat" size="large" />
						<OptionText>Message</OptionText>
					</Option>
				</Options>
			);
		}
		if ( user.followers.includes( localStorage.getItem( "id" ))) {
			return (
				<Options>
					<Option onClick={this.props.unFollow}>
						<OptionIcon name="remove user" size="large" />
						<OptionText>Unfollow</OptionText>
					</Option>
					<Option onClick={this.props.handleMessage}>
						<OptionIcon name="chat" size="large" />
						<OptionText>Message</OptionText>
					</Option>
				</Options>
			);
		}
		return (
			<Options>
				{this.props.user.username === localStorage.getItem( "username" ) ?
					<Option onClick={this.props.goToUserSettings}>
						<OptionIcon className="clipboard list" size="large" />
						<OptionText>Update profile</OptionText>
					</Option>
					:
					<React.Fragment>
						<Option onClick={this.props.handleAddFriend}>
							<OptionIcon name="add user" size="large" />
							<OptionText>Add Friend</OptionText>
						</Option>
						<Option onClick={this.props.handleFollow}>
							<OptionIcon name="binoculars" size="large" />
							<OptionText>Follow</OptionText>
						</Option>
						<Option onClick={this.props.handleMessage}>
							<OptionIcon name="chat" size="large" />
							<OptionText>Message</OptionText>
						</Option>
					</React.Fragment>
				}
			</Options>
		);
	}
}

ProfileOptions.propTypes = {
	user: PropTypes.object.isRequired,
	handleAddFriend: PropTypes.func.isRequired,
	handleFollow: PropTypes.func.isRequired,
	handleDeleteFriend: PropTypes.func.isRequired,
	unFollow: PropTypes.func.isRequired,
	handleMessage: PropTypes.func.isRequired,
	requested: PropTypes.bool
};


export default ProfileOptions;
