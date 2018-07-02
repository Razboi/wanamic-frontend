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
		try {
			this.props.receiver.profileImage ?
				userImage = require( "../images/" + this.props.receiver.profileImage )
				:
				userImage = require( "../images/defaultUser.png" );
		} catch ( err ) {
			console.log( err );
		}
	}

	render() {
		this.setUserImage();
		return (
			<ConversationWrapper>
				<HeaderWrapper>
					<Icon
						className="arrowBack"
						name="arrow left"
						onClick={this.props.switchConversation}
					/>
					<UserInfo>
						<FriendImg
							circular
							src={userImage}
						/>
						<TextInfo>
							<Fullname>{this.props.receiver.fullname}</Fullname>
							<Username>@{this.props.receiver.username}</Username>
						</TextInfo>
					</UserInfo>
				</HeaderWrapper>
				<MessagesWrapper className="messagesWrapper">
					{this.props.messages.map(( message, index ) =>
						<Message message={message} key={index} />
					)}
				</MessagesWrapper>
				<StyledInput
					name="messageInput"
					value={this.props.messageInput}
					placeholder="Write a message"
					onChange={this.props.handleChange}
					onKeyPress={this.props.handleKeyPress}
				/>
			</ConversationWrapper>
		);
	}
}

Conversation.propTypes = {
	receiver: PropTypes.object.isRequired,
	messages: PropTypes.array.isRequired,
	handleKeyPress: PropTypes.func.isRequired,
	handleChange: PropTypes.func.isRequired,
	switchConversation: PropTypes.func.isRequired,
	messageInput: PropTypes.string.isRequired
};


export default Conversation;
