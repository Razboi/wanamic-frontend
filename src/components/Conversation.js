import React, { Component } from "react";
import {
	Icon, Input, Image, Dropdown, Message as MessageInfo
} from "semantic-ui-react";
import styled from "styled-components";
import PropTypes from "prop-types";
import Message from "./Message";
import StayScrolled from "react-stay-scrolled";

var userImage;

const
	ConversationWrapper = styled.div`
		overflow: hidden;
		position: fixed;
		bottom: 0;
		left: 0;
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
			"inp";
		@media (min-width: 760px) {
			height: 350px;
			width: 300px;
			position: fixed;
			left: 20px;
			bottom: 0px;
			border: 1px solid rgba(0,0,0,.066);
		}
	`,
	MessagesWrapper = styled( StayScrolled )`
		grid-area: mes;
		display: flex;
		flex-direction: column;
		position: relative !important;
		padding: 10px;
		overflow-y: auto;
		::-webkit-scrollbar {
			display: block !important;
			width: 5px !important;
		}
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
		position: relative;
		display: flex;
		justify-content: space-between;
		flex-direction: row;
		align-items: center;
		box-shadow: 0 1px 2px #555;
		z-index: 2;
		padding: 10px;
	`,
	CloseIcon = styled( Icon )`
		margin-bottom: 3px !important;
		color: rgba(0,0,0,0.25) !important;
		font-size: 1.1em !important;
		:hover {
			 cursor: pointer;
		}
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
		overflow: visible !important;
	`,
	TextInfo = styled.div`
		display: flex;
		align-items: center;
		margin: 0 !important;
		font-family: inherit !important;
	`,
	Fullname = styled.span`
		font-size: 1rem;
		word-break: break-word;
		font-weight: 600;
		color: #111;
	`,
	StyledDropdown = styled( Dropdown )`
		i {
			color: rgba(0,0,0,0.25) !important;
			font-size: 1.433rem !important;
			@media (min-width: 760px) {
				font-size: 1rem !important;
			}
		};
	`,
	SpamWarning = styled( MessageInfo )`
		position: absolute !important;
		left: 5px;
		right: 5px;
		bottom: -100px;
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
					<UserInfo>
						<FriendImg
							circular
							src={userImage}
						/>
						<TextInfo>
							<Fullname>{conversation.target.fullname}</Fullname>
						</TextInfo>
					</UserInfo>

					<div>
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
						<CloseIcon
							name="close"
							onClick={back}
						/>
					</div>

					{spam &&
						<SpamWarning warning>
							<MessageInfo.Header>
									You are sending messages too fast.
							</MessageInfo.Header>
							<p>To prevent spam you must wait a couple seconds.</p>
						</SpamWarning>
					}
				</HeaderWrapper>

				<MessagesWrapper component="div" className="messagesWrapper">
					{conversation.messages.map(( message, index ) =>
						<Message message={message} key={index} />
					)}
				</MessagesWrapper>

				<StyledInput
					maxLength="2200"
					autoFocus
					name="messageInput"
					value={messageInput}
					placeholder={"Write to @" + conversation.target.username}
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
