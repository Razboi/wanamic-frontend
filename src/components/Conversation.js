import React, { Component } from "react";
import { Icon, Input, Header, Image, Dropdown } from "semantic-ui-react";
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
		grid-template-rows: 10% 83% 7%;
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
		position: relative;
		padding: 10px;
		overflow-y: scroll;
	`,
	StyledInput = styled( Input )`
		grid-area: inp;
	`,
	HeaderWrapper = styled.div`
		grid-area: hea;
		display: flex;
		justify-content: space-evenly;
		flex-direction: row;
		align-items: center;
		border-bottom: 1px solid rgba(0, 0, 0, .5);
	`,
	BackArrow = styled( Icon )`
		font-size: 1.3rem !important;
		i {
			font-size: 1.3rem !important;
		};
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
			font-size: 1.3rem !important;
		};
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
			handleKeyPress
		} = this.props;
		this.setUserImage();
		return (
			<ConversationWrapper>
				<HeaderWrapper>
					<BackArrow
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

					<StyledDropdown icon="setting" direction="left">
						<Dropdown.Menu className="postDropdown">
							<Dropdown.Item
								className="postDeleteOption"
								text="Delete Conversation"
								onClick={() =>
									this.props.handleDeleteChat(
										conversation.target.username
									)}
							/>
						</Dropdown.Menu>
					</StyledDropdown>
				</HeaderWrapper>
				<MessagesWrapper component="div" className="messagesWrapper">
					{conversation.messages.map(( message, index ) =>
						<Message message={message} key={index} />
					)}
				</MessagesWrapper>

				<StyledInput
					autoFocus
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
	handleDeleteChat: PropTypes.func.isRequired,
	back: PropTypes.func.isRequired,
	messageInput: PropTypes.string.isRequired
};


export default Conversation;
