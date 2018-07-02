import React, { Component } from "react";
import { Icon, Input, Header, Image } from "semantic-ui-react";
import styled from "styled-components";
import PropTypes from "prop-types";
import Message from "./Message";

var userImage;

const
	ConversationWrapper = styled.div`
		position: absolute;
		height: 100vh;
		width: 100%;
		z-index: 4;
		background: #fff;
		display: grid;
		grid-template-columns: 100%;
		grid-template-rows: 10% 83% 7%;
		grid-template-areas:
			"hea"
			"mes"
			"inp"
	`,
	MessagesWrapper = styled.div`
		grid-area: mes;
		padding: 10px;
		overflow-y: scroll;
	`,
	StyledInput = styled( Input )`
		grid-area: inp;
	`,
	HeaderWrapper = styled.div`
		grid-area: hea;
		display: flex;
		flex-direction: row;
		align-items: center;
		padding-left: 0.5rem;
		border-bottom: 1px solid rgba(0, 0, 0, .5);
	`,
	UserInfo = styled.div`
		display: flex;
		align-items: center;
		flex: 1 0 0%;
		margin-left: 0.5rem;
	`,
	FriendImg = styled( Image )`
		width: 35px !important;
		height: 35px !important;
		align-self: flex-start;
	`,
	TextInfo = styled( Header )`
		display: flex;
		align-items: center;
		margin-top: 0 !important;
		margin-left: 0.66rem !important;
	`,
	Fullname = styled.span`
		font-size: 1.1475rem !important;
	`,
	Username = styled( Header.Subheader )`
		margin-left: 0.25rem !important;
	`;


class Conversation extends Component {
	setUserImage = () => {
		const { conversation } = this.props;
		try {
			conversation.target.profileImage ?
				userImage = require( "../images/" + conversation.target.profileImage )
				:
				userImage = require( "../images/defaultUser.png" );
		} catch ( err ) {
			console.log( err );
		}
	}

	render() {
		const {
			conversation, switchConversation, messageInput, handleChange,
			handleKeyPress
		} = this.props;
		this.setUserImage();
		return (
			<ConversationWrapper>
				<HeaderWrapper>
					<Icon
						className="arrowBack"
						name="arrow left"
						onClick={switchConversation}
					/>
					<UserInfo>
						<FriendImg
							circular
							src={userImage}
						/>
						<TextInfo>
							<Fullname>{conversation.target.fullname}</Fullname>
							<Username>@{conversation.target.username}</Username>
						</TextInfo>
					</UserInfo>
				</HeaderWrapper>
				<MessagesWrapper className="messagesWrapper">
					{conversation.messages.map(( message, index ) =>
						<Message message={message} key={index} />
					)}
				</MessagesWrapper>
				<StyledInput
					name="messageInput"
					value={messageInput}
					placeholder="Write a message"
					onChange={handleChange}
					onKeyPress={handleKeyPress}
				/>
			</ConversationWrapper>
		);
	}
}

Conversation.propTypes = {
	conversation: PropTypes.object.isRequired,
	handleKeyPress: PropTypes.func.isRequired,
	handleChange: PropTypes.func.isRequired,
	switchConversation: PropTypes.func.isRequired,
	messageInput: PropTypes.string.isRequired
};


export default Conversation;
