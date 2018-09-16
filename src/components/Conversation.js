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
		position: fixed;
		bottom: 0;
		left: 0;
		height: 100%;
		width: 100%;
		z-index: 20;
		background: #fff;
		display: grid;
		grid-template-columns: 100%;
		grid-template-rows: 57px 1fr 52px;
		grid-template-areas:
			"hea"
			"mes"
			"inp";
		@media (max-width: 760px) {
			top: 0;
		}
		@media (min-width: 760px) {
			height: 350px;
			width: 300px;
			position: fixed;
			left: 20px;
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
	InputWrapper = styled.div`
		grid-area: inp;
		display: flex;
		align-items: center;
		border-radius: 25px !important;
		border: 1px solid rgba(0,0,0,0.233) !important;
		margin: 2px 5px 5px 5px;
		padding: 5px;
	`,
	StyledInput = styled( Input )`
		background: none !important;
		width: 100%;
		input {
			height: 44px !important;
			font-family: inherit !important;
			color: #222 !important;
			border: none !important;
			background: none !important;
			padding: none;
		}
		input::placeholder {
			color: #444 !important;
		}
		input:focus {
			border: none !important;
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
		z-index: 4;
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
		:hover {
			cursor: pointer;
		}
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
	`,
	SendButton = styled.div`
		height: 45px;
		width: 45px;
		border-radius: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		:hover {
			cursor: pointer;
		}
	`,
	SendButtonImage = styled.span`
		height: 26px;
		width: 26px;
		display: block;
		background-image: url(${props => props.image});
		background-repeat: no-repeat;
		margin: 0;
		position: relative;
		background-size: 100%;
	`;


class Conversation extends Component {
	constructor() {
		super();
		this.previousHref = window.location.href;
	}

	componentDidMount() {
		if ( window.innerWidth <= 760 ) {
			window.history.pushState( null, null, "/conversation" );
			window.onpopstate = e => this.handlePopstate( e );
		}
	}

	componentWillUnmount() {
		window.onpopstate = () => {};
	}

	handlePopstate = e => {
		e.preventDefault();
		this.handleBack();
	}

	handleBack = () => {
		window.history.pushState( null, null, this.previousHref );
		this.props.back();
	}

	setUserImage = () => {
		const
			s3Bucket = "https://d3dlhr4nnvikjb.cloudfront.net/",
			{ conversation } = this.props;
		try {
			if ( conversation.target.profileImage ) {
				process.env.REACT_APP_STAGE === "dev" ?
					userImage = require( "../images/" + conversation.target.profileImage )
					:
					userImage = s3Bucket + conversation.target.profileImage;
			} else {
				userImage = require( "../images/defaultUser.png" );
			}
		} catch ( err ) {
			console.log( err );
		}
	}

	goToProfile = () => {
		this.handleBack();
		this.props.history.push( `/${this.props.conversation.target.username}` );
	}

	render() {
		const {
			conversation, messageInput, handleChange,
			handleKeyPress, newConversation, spam
		} = this.props;
		this.setUserImage();
		return (
			<ConversationWrapper>
				<HeaderWrapper newconversation={newConversation ? 1 : 0}>
					<UserInfo onClick={this.goToProfile}>
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
							onClick={this.handleBack}
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

				<InputWrapper>
					<StyledInput
						maxLength="2200"
						autoFocus
						name="messageInput"
						value={messageInput}
						placeholder={"Write to @" + conversation.target.username}
						onChange={handleChange}
						onKeyPress={handleKeyPress}
					/>
					<SendButton onClick={this.props.handleSendMessage}>
						<SendButtonImage image={require( "../images/send.svg" )} />
					</SendButton>
				</InputWrapper>
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
	history: PropTypes.object.isRequired,
	handleSendMessage: PropTypes.func.isRequired
};


export default Conversation;
