import React, { Component } from "react";
import { Icon, Input } from "semantic-ui-react";
import styled from "styled-components";
import PropTypes from "prop-types";
import Message from "./Message";

const
	ConversationWrapper = styled.div`
		position: absolute;
		height: 100vh;
		width: 100%;
		z-index: 4;
		background: #fff;
		display: grid;
		grid-template-columns: 100%;
		grid-template-rows: 7% 86% 7%;
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
		height: 49.33px;
		display: flex;
		align-items: center;
		padding-left: 10px;
		border-bottom: 1px solid rgba(0, 0, 0, .5);
	`,
	HeaderTxt = styled.span`
		margin-left: 15px;
		font-weight: bold;
		font-size: 16px;
	`;


class Conversation extends Component {

	render() {
		return (
			<ConversationWrapper>
				<HeaderWrapper>
					<Icon
						className="arrowBack"
						name="arrow left"
						onClick={this.props.switchConversation}
					/>
					<HeaderTxt>{this.props.receiver.username}</HeaderTxt>
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
	receiver: PropTypes.obj,
	messages: PropTypes.array.isRequired,
	handleKeyPress: PropTypes.func.isRequired,
	handleChange: PropTypes.func.isRequired,
	switchConversation: PropTypes.func.isRequired,
	messageInput: PropTypes.string.isRequired
};


export default Conversation;
