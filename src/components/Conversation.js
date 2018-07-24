import React, { Component } from "react";
import {
	Icon, Input, Header, Image, Dropdown, Message as MessageInfo
} from "semantic-ui-react";
import styled from "styled-components";
import PropTypes from "prop-types";
import Message from "./Message";
import StayScrolled from "react-stay-scrolled";

var userImage;

const
	ConversationWrapper = styled.div`
		overflow: hidden;
		position: absolute;
		height: 100vh;
		width: 100%;
		z-index: 4;
		background: #fff;
		display: grid;
		grid-template-columns: 100%;
		grid-template-rows: 57px auto 52px;
		grid-template-areas:
			"hea"
			"mes"
			"inp"
	`,
	MessagesWrapper = styled( StayScrolled )`
		grid-area: mes;
		::-webkit-scrollbar {
			display: none !important;
		}
		display: flex;
		flex-direction: column;
		position: relative;
		padding: 10px;
		overflow-y: scroll;
	`,
	StyledInput = styled( Input )`
		grid-area: inp;
		padding: 2px 5px 5px 5px;
		background: none !important;
		input {
			height: 44px !important;
			border-radius: 25px !important;
			font-family: inherit !important;
			color: #222 !important;
			border: 1px solid rgba(0,0,0,0.3) !important;
		}
		input::placeholder {
			color: #444 !important;
		}
		input:focus {
			border: 1px solid rgba(0,0,0,0.3) !important;
		}
	`,
	HeaderWrapper = styled.div`
		grid-area: hea;
		display: flex;
		justify-content: ${props => props.newconversation ?
		"center" : "space-evenly"};
		flex-direction: row;
		align-items: center;
		box-shadow: 0 1px 2px #555;
		z-index: 2;
	`,
	BackArrow = styled( Icon )`
		font-size: 1.3rem !important;
		margin: ${props => props.newconversation ?
		"0 1rem 0 -1rem" : "0"} !important;
	`,
	UserInfo = styled.div`
		display: flex;
		align-items: center;
	`,
	FriendImg = styled( Image )`
		width: 35px !important;
		height: 35px !important;
		align-self: flex-start;
		margin-right: 0.5rem !important;
	`,
	TextInfo = styled( Header )`
		display: flex;
		align-items: center;
		margin: 0 !important;
	`,
	Fullname = styled.span`
		font-size: 1.1475rem !important;
	`,
	Username = styled( Header.Subheader )`
		margin: 0 !important;
	`,
	StyledDropdown = styled( Dropdown )`
		i {
			color: rgba(0,0,0,0.45) !important;
			font-size: 1.433rem !important;
		};
	`,
	SpamWarning = styled( MessageInfo )`
		position: fixed !important;
		left: 5px;
		right: 5px;
		z-index: 2;
		word-break: break-word;
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
			conversation, back, messageInput, handleChange,
			handleKeyPress, newConversation, spam
		} = this.props;
		this.setUserImage();
		return (
			<ConversationWrapper>
				<HeaderWrapper newconversation={newConversation ? 1 : 0}>
					<BackArrow
						newconversation={newConversation ? 1 : 0}
						className="arrowBack"
						name="arrow left"
						onClick={back}
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

					{!newConversation &&
						<StyledDropdown icon="setting" direction="left">
							<Dropdown.Menu className="postDropdown">
								<Dropdown.Item
									className="postDeleteOption"
									text="Delete Conversation"
									onClick={() =>
										this.props.handleDeleteChat(
											conversation.target
										)}
								/>
							</Dropdown.Menu>
						</StyledDropdown>}
				</HeaderWrapper>

				<MessagesWrapper component="div" className="messagesWrapper">
					{spam &&
						<SpamWarning warning>
							<MessageInfo.Header>
									You are sending messages too fast.
							</MessageInfo.Header>
							<p>To prevent spam you must wait a couple seconds.</p>
						</SpamWarning>
					}

					{conversation.messages.map(( message, index ) =>
						<Message message={message} key={index} />
					)}
				</MessagesWrapper>

				<StyledInput
					maxLength="2200"
					autoFocus
					name="messageInput"
					value={messageInput}
					placeholder="Write a message.."
					onChange={handleChange}
					onKeyPress={handleKeyPress}
				/>
			</ConversationWrapper>
		);
	}
}

Conversation.propTypes = {
	conversation: PropTypes.object.isRequired,
	newConversation: PropTypes.bool.isRequired,
	handleKeyPress: PropTypes.func.isRequired,
	handleChange: PropTypes.func.isRequired,
	handleDeleteChat: PropTypes.func.isRequired,
	back: PropTypes.func.isRequired,
	messageInput: PropTypes.string.isRequired,
	spam: PropTypes.bool.isRequired,
};


export default Conversation;
