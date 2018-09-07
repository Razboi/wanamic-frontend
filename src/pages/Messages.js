import React, { Component } from "react";
import styled from "styled-components";
import { Image, Button, Header, Label } from "semantic-ui-react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import api from "../services/api";
import {
	switchMessages, setConversations, selectConversation,
	updateConversation, addConversation, setupNewConversation,
	deleteChat, switchConversation
} from "../services/actions/conversations";
import Conversation from "../components/Conversation";
import SocialCircleList from "../components/SocialCircleList";
import refreshToken from "../utils/refreshToken";
import moment from "moment";
import NavBar from "../containers/NavBar";

const
	Wrapper = styled.div`
		@media (max-width: 1300px) {
			display: ${props => props.largeScreen && "none"};
			height: 100vh;
			width: 100%;
			overflow-y: auto;
			position: absolute;
			z-index: 3;
			background: #fff;
			padding: 49.33px 0;
			::-webkit-scrollbar {
				display: none !important;
			}
		}
		@media (min-width: 760px) and (max-width: 1300px) {
			display: ${props => props.onHome && "none"};
		}
		@media (min-width: 1300px) {
			display: ${props => props.hideSidebar && "none"};
			position: fixed;
			right: 10px;
			bottom: 0;
			height: 350px;
			width: 260px;
			background: rgba( 255, 255, 255, 0.35 );
			border-radius: 2px;
			z-index: 2;
		}
	`,
	PopupWrapper = styled.div`
		@media (min-width: 760px)  {
			position: absolute;
			bottom: -393px;
			left: 0;
			background: #fff;
			border-radius: 2px;
			box-shadow: 0 3px 8px rgba(0, 0, 0, .25);
			border: 1px solid rgba(0,0,0,0.1);
			z-index: 5;
			border-top: 0;
		};
		@media (min-width: 760px) and (max-width: 960px)  {
			right: 0;
			left: auto;
		}
		@media (max-width: 760px) {
			display: none;
		}
	`,
	PopupConversations = styled.div`
		height: 400px;
		width: 400px;
		overflow-y: auto;
		padding-bottom: 4rem;
	`,
	PageHeader = styled.div`
		border-bottom: 1px solid rgba(0, 0, 0, .1);
		text-align: center;
		padding: 15px 10px;
		font-size: 17px;
		font-weight: bold;
		@media (min-width: 760px) and (min-height: 450px) {
			display: ${props => !props.isPopup && "none"};
			color: #333;
			padding: 7px 0;
			font-size: 1rem;
			background: rgba(133,217,191,0.34);
			border-bottom: 0;
		}
	`,
	ConversationsList = styled.div`
	@media (max-width: 1300px) {
		display: ${props => props.largeScreen && "none"};
		height: 100%;
		::-webkit-scrollbar {
			display: none !important;
		}
	}
	@media (min-width: 1300px) {
		height: 100%;
		overflow-y: auto;
		padding-bottom: 4rem;
		::-webkit-scrollbar {
			display: block !important;
			width: 10px !important;
		}
	}
	`,
	Buttons = styled.div`
		display: flex;
		position: absolute;
		bottom: 0;
		width: 100%;
		background: #fff;
		border-top: 1px solid rgba(0,0,0,0.05);
	`,
	NewConversationButton = styled( Button )`
		z-index: 3;
		background: rgb(133, 217, 191) !important;
		font-size: 1.28rem !important;
		position: fixed;
		bottom: 1rem;
		right: 1rem;
		@media (min-width: 760px) and (min-height: 450px) {
			position: static;
			bottom: auto;
			right: auto;
			background: none !important;
			font-size: 1rem !important;
			margin: 0 0 0 auto !important;
			i {
				color: rgba(0,0,0,0.25) !important;
			}
		}
	`,
	HideButton = styled( Button )`
		font-size: 1rem !important;
		i {
			color: rgba(0,0,0,0.25) !important;
		}
		z-index: 3;
		margin: 0 auto 0 0 !important;
		background: none !important;
		@media (max-width: 760px) {
			display: none;
		}
	`,
	OpenConversation = styled.div`
		display: flex;
		position: relative;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		padding: 1rem;
		background: ${props => props.newMessages ?
		"rgba(133, 217, 191, 0.22)" : "none"};
		:hover {
			cursor: pointer;
		}
	`,
	UserImg = styled( Image )`
		width: 35px !important;
		height: 35px !important;
		@media (min-width: 760px) {
			width: 30px !important;
			height: 30px !important;
		}
	`,
	TextInfo = styled( Header )`
		display: flex;
		flex: 1 0 0%;
		flex-direction: column;
		margin: 0 0 0 0.5rem !important;
		overflow: hidden !important;
		font-family: inherit !important;
	`,
	UserFullname = styled.span`
		white-space: nowrap !important;
		overflow: hidden !important;
		text-overflow: ellipsis !important;
		font-size: 1.1rem !important;
		color: #111 !important;
		@media (min-width: 760px) {
			font-size: 1rem !important;
			font-weight: 500 !important;
		}
	`,
	LastMessage = styled( Header.Subheader )`
		white-space: nowrap !important;
		overflow: hidden !important;
		text-overflow: ellipsis !important;
		@media (min-width: 760px) {
			font-size: 0.9rem !important;
		}
	`,
	LastMessageTime = styled.span`
		font-size: 0.87rem;
		color: rgba(0,0,0,0.78);
		align-self: self-start;
		@media (min-width: 760px) {
			font-size: 0.85rem !important;
		}
	`,
	NewMessagesCount = styled( Label )`
		position: absolute;
		right: 1.1rem;
		bottom: 0.5rem;
	`,
	ChatTab = styled.div`
		position: fixed;
		bottom: 0;
		right: 10px;
		background: #fff;
		display: ${props => props.hideSidebar ? "none" : "flex"};
		align-items: center;
		justify-content: flex-start;
		font-weight: 600;
    font-family: inherit;
		width: 260px;
		:hover {
			cursor: pointer;
		}
		@media (max-width: 760px) {
			display: none;
		}
	`,
	DisplayChatButton = styled( Button )`
		font-size: 1rem !important;
		i {
			color: rgba(0,0,0,0.25) !important;
		}
		z-index: 3;
		background: none !important;
	`;

class Messages extends Component {
	constructor() {
		super();
		this.state = {
			socialCircle: [],
			displaySocialCircle: false,
			messageInput: "",
			sentMessages: 0,
			spam: false,
			chat: true
		};
	}

	// Must await to get chats for checking if the conversation
	// already exists
	async componentDidMount() {
		this.interval = setInterval( this.resetMessagesLimit, 10000 );
		await this.getActiveChats();
	}

	componentWillUnmount() {
		clearInterval( this.interval );
	}

	componentDidUpdate( prevProps ) {
		const { messageTarget } = this.props;
		if ( messageTarget && messageTarget !== prevProps.messageTarget ) {
			this.handleNewConversation( this.props.messageTarget );
		}
	}

	resetMessagesLimit = () => {
		this.setState({ sentMessages: 0 });
	}

	getActiveChats = async() => {
		const chats = await api.getChats();
		if ( chats === "jwt expired" ) {
			try {
				await refreshToken();
			} catch ( err ) {
				console.log( err );
			}
			this.getActiveChats();
		} else {
			this.props.setConversations( chats.data );
		}
	}

	handleChange = e => {
		this.setState({ [ e.target.name ]: e.target.value });
	}

	handleKeyPress = e => {
		if ( e.key === "Enter" ) {
			e.preventDefault();
			this.handleSendMessage();
		}
	}

	handleDeleteChat = async target => {
		const response = await api.deleteChat( target._id );
		if ( response === "jwt expired" ) {
			try {
				await refreshToken();
			} catch ( err ) {
				console.log( err );
			}
			this.handleDeleteChat();
		} else {
			this.backToOpenConversations();
			this.props.deleteChat( target );
		}
	}

	displayConversation = () => {
		this.props.switchConversation( true );
		this.setState({ displaySocialCircle: false });
	}

	handleNewConversation = async selectedUser => {
		const { conversations, setupNewConversation } = this.props;
		for ( const [ i, conversation ] of conversations.entries()) {
			if ( conversation.target.username === selectedUser.username ) {
				this.handleSelectConversation( i );
				return;
			}
		}
		const newConversation = {
			target: selectedUser,
			messages: []
		};
		setupNewConversation( newConversation );
		this.displayConversation();
	}

	handleSelectConversation = index => {
		this.props.selectConversation( index );
		this.displayConversation();
		this.clearChatNotifications( this.props.conversations[ index ]);
		if ( this.props.largeScreen && this.props.displayPopup ) {
			this.props.switchMessages();
		}
	}

	clearChatNotifications = async conversation => {
		const response = await api.clearChatNotifications(
			conversation.target.username
		);
		if ( response === "jwt expired" ) {
			try {
				await refreshToken();
			} catch ( err ) {
				console.log( err );
			}
			this.clearChatNotifications( conversation );
		}
	}

	handleSocialCircle = async() => {
		const socialCircle = await api.getFriends();
		if ( socialCircle === "jwt expired" ) {
			try {
				await refreshToken();
			} catch ( err ) {
				console.log( err );
			}
			this.handleSocialCircle();
		} else {
			this.setState({
				socialCircle: socialCircle.data,
				displaySocialCircle: true
			});
		}
	}

	handleSendMessage = async() => {
		const
			{ conversations, selectedConversation, newConversation
			} = this.props,
			{ messageInput, sentMessages } = this.state,
			conversation = newConversation ?
				newConversation
				:
				conversations[ selectedConversation ];
		if ( !messageInput ) {
			return;
		}
		if ( sentMessages >= 7 ) {
			this.handleSpam();
		} else {
			const res = await api.sendMessage(
				conversation.target._id, messageInput
			);
			if ( res === "jwt expired" ) {
				try {
					await refreshToken();
				} catch ( err ) {
					console.log( err );
				}
				this.handleSendMessage();
			} else {
				this.setState( state => ({
					messageInput: "", sentMessages: state.sentMessages + 1
				}));
				this.props.socket.emit( "sendMessage", res.data.newMessage );
				if ( newConversation ) {
					this.props.addConversation( res.data.newConversation );
					return;
				}
				this.props.updateConversation(
					res.data.newMessage, selectedConversation );
			}
		}
	}

	backToOpenConversations = () => {
		if ( this.props.toggleConversation ) {
			this.props.toggleConversation();
			return;
		}
		this.setState({ displaySocialCircle: false });
		this.props.switchConversation( false );
		if ( this.props.profilePage && this.props.messageTarget ) {
			this.props.startChat( undefined );
		}
		if ( this.props.newConversation ) {
			this.props.setupNewConversation( undefined );
		}
	}

	handleSpam = () => {
		this.setState({ spam: true });
		setTimeout(() => {
			this.setState({ spam: false });
		}, 10000 );
	}

	toggleChat = () => {
		if ( this.props.largeScreen ) {
			this.setState( state => ({ chat: !state.chat }));
		}
	}


	render() {
		const
			s3Bucket = "https://d3dlhr4nnvikjb.cloudfront.net/",
			{ conversations, selectedConversation, newConversation,
				largeScreen, profilePage, displayPopup, hideSidebar,
				onHome } = this.props;
		if ( this.props.displayConversation && !largeScreen ) {
			return (
				<Conversation
					conversation={newConversation ?
						newConversation
						:
						conversations[ selectedConversation ]
					}
					newConversation={!!newConversation}
					handleKeyPress={this.handleKeyPress}
					handleChange={this.handleChange}
					handleDeleteChat={this.handleDeleteChat}
					handleSendMessage={this.handleSendMessage}
					back={this.backToOpenConversations}
					messageInput={this.state.messageInput}
					spam={this.state.spam}
					history={this.props.history}
				/>
			);
		}
		if ( this.state.displaySocialCircle && !largeScreen ) {
			return (
				<SocialCircleList
					socialCircle={this.state.socialCircle}
					handleNewConversation={this.handleNewConversation}
					back={this.backToOpenConversations}
				/>
			);
		}
		if ( largeScreen ) {
			return (
				<React.Fragment>
					{this.state.chat ?
						<Wrapper
							hideSidebar={hideSidebar}
							largeScreen={largeScreen}
							onHome={onHome}
						>
							{this.state.displaySocialCircle && largeScreen ?
								<SocialCircleList
									socialCircle={this.state.socialCircle}
									handleNewConversation={this.handleNewConversation}
									back={this.backToOpenConversations}
								/>
								:
								<React.Fragment>
									<PageHeader>Conversations</PageHeader>

									<ConversationsList>
										{this.props.conversations.map(( chat, index ) =>
											<OpenConversation
												key={index}
												onClick={() => this.handleSelectConversation( index ) }
												newMessages={chat.newMessagesCount > 0}
											>
												<UserImg
													circular
													src={chat.target.profileImage ?
														process.env.REACT_APP_STAGE === "dev" ?
															require( "../images/" + chat.target.profileImage )
															:
															s3Bucket + chat.target.profileImage
														:
														require( "../images/defaultUser.png" )
													}
												/>
												<TextInfo>
													<UserFullname>
														{chat.target.fullname}
													</UserFullname>
													<LastMessage>
														@{chat.messages[ chat.messages.length - 1 ].author.username}: {
															chat.messages[ chat.messages.length - 1 ].content}
													</LastMessage>
												</TextInfo>
												<LastMessageTime>
													{moment(
														chat.messages[ chat.messages.length - 1 ].createdAt
													).fromNow( true )}
												</LastMessageTime>
												{chat.newMessagesCount > 0 &&
													<NewMessagesCount
														size="tiny" circular
													>
														{chat.newMessagesCount}
													</NewMessagesCount>
												}
											</OpenConversation>
										)}
									</ConversationsList>
									<Buttons>
										<HideButton
											onClick={this.toggleChat}
											primary
											circular
											icon="chevron right"
										/>
										<NewConversationButton
											onClick={this.handleSocialCircle}
											primary
											circular
											icon="comment"
										/>
									</Buttons>
								</React.Fragment>
							}
						</Wrapper>
						:
						<ChatTab hideSidebar={hideSidebar} onClick={this.toggleChat}>
							<DisplayChatButton
								primary
								circular
								icon="chevron left"
							/>
							<span>Chat</span>
						</ChatTab>
					}

					{this.props.displayConversation && largeScreen &&
							<Conversation
								conversation={newConversation ?
									newConversation
									:
									conversations[ selectedConversation ]
								}
								newConversation={!!newConversation}
								handleKeyPress={this.handleKeyPress}
								handleChange={this.handleChange}
								handleDeleteChat={this.handleDeleteChat}
								handleSendMessage={this.handleSendMessage}
								back={this.backToOpenConversations}
								messageInput={this.state.messageInput}
								spam={this.state.spam}
								history={this.props.history}
							/>
					}

					{displayPopup &&
						<PopupWrapper>
							{this.state.displaySocialCircle && largeScreen ?
								<SocialCircleList
									socialCircle={this.state.socialCircle}
									handleNewConversation={this.handleNewConversation}
									back={this.backToOpenConversations}
								/>
								:
								<React.Fragment>
									<PageHeader isPopup>Conversations</PageHeader>

									<PopupConversations>
										{this.props.conversations.map(( chat, index ) =>
											<OpenConversation
												key={index}
												onClick={() => this.handleSelectConversation( index ) }
												newMessages={chat.newMessagesCount > 0}
											>
												<UserImg
													circular
													src={chat.target.profileImage ?
														process.env.REACT_APP_STAGE === "dev" ?
															require( "../images/" + chat.target.profileImage )
															:
															s3Bucket + chat.target.profileImage
														:
														require( "../images/defaultUser.png" )
													}
												/>
												<TextInfo>
													<UserFullname>
														{chat.target.fullname}
													</UserFullname>
													<LastMessage>
														@{chat.messages[ chat.messages.length - 1 ].author.username}: {
															chat.messages[ chat.messages.length - 1 ].content}
													</LastMessage>
												</TextInfo>
												<LastMessageTime>
													{moment(
														chat.messages[ chat.messages.length - 1 ].createdAt
													).fromNow( true )}
												</LastMessageTime>
												{chat.newMessagesCount > 0 &&
													<NewMessagesCount
														size="tiny" circular
													>
														{chat.newMessagesCount}
													</NewMessagesCount>
												}
											</OpenConversation>
										)}
									</PopupConversations>
									<Buttons>
										<NewConversationButton
											onClick={this.handleSocialCircle}
											primary
											circular
											icon="comment"
										/>
									</Buttons>
								</React.Fragment>
							}
						</PopupWrapper>
					}
				</React.Fragment>
			);
		}

		if ( !largeScreen && !profilePage ) {
			return (
				<React.Fragment>
					<Wrapper>
						<React.Fragment>
							<NavBar hideOnLargeScreen socket={this.props.socket} />
							<PageHeader>Conversations</PageHeader>

							{this.props.conversations.map(( chat, index ) =>
								<OpenConversation
									key={index}
									onClick={() => this.handleSelectConversation( index ) }
									newMessages={chat.newMessagesCount > 0}
								>
									<UserImg
										circular
										src={chat.target.profileImage ?
											process.env.REACT_APP_STAGE === "dev" ?
												require( "../images/" + chat.target.profileImage )
												:
												s3Bucket + chat.target.profileImage
											:
											require( "../images/defaultUser.png" )
										}
									/>
									<TextInfo>
										<UserFullname>
											{chat.target.fullname}
										</UserFullname>
										<LastMessage>
											@{chat.messages[ chat.messages.length - 1 ].author.username}: {
												chat.messages[ chat.messages.length - 1 ].content}
										</LastMessage>
									</TextInfo>
									<LastMessageTime>
										{moment(
											chat.messages[ chat.messages.length - 1 ].createdAt
										).fromNow( true )}
									</LastMessageTime>
									{chat.newMessagesCount > 0 &&
												<NewMessagesCount size="tiny" circular>
													{chat.newMessagesCount}
												</NewMessagesCount>
									}
								</OpenConversation>
							)}

							<NewConversationButton
								onClick={this.handleSocialCircle}
								primary
								circular
								icon="comment"
							/>
						</React.Fragment>
					</Wrapper>
				</React.Fragment>
			);
		}
		return null;
	}
}

Messages.propTypes = {
	conversations: PropTypes.array.isRequired,
	selectedConversation: PropTypes.number.isRequired,
	switchMessages: PropTypes.func.isRequired,
	messageTarget: PropTypes.object,
	socket: PropTypes.object.isRequired,
	onHome: PropTypes.bool,
	largeScreen: PropTypes.bool,
	profilePage: PropTypes.bool,
	displayPopup: PropTypes.bool,
	hideSidebar: PropTypes.bool
};

const
	mapStateToProps = state => ({
		conversations: state.conversations.allConversations,
		selectedConversation: state.conversations.selectedConversation,
		newConversation: state.conversations.newConversation,
		displayConversation: state.conversations.displayConversation
	}),

	mapDispatchToProps = dispatch => ({
		setConversations: convers => dispatch( setConversations( convers )),
		addConversation: conver => dispatch( addConversation( conver )),
		deleteChat: targetUsername => dispatch( deleteChat( targetUsername )),
		selectConversation: index => dispatch( selectConversation( index )),
		setupNewConversation: conver => dispatch( setupNewConversation( conver )),
		switchMessages: () => dispatch( switchMessages()),
		switchConversation: shouldDisplay =>
			dispatch( switchConversation( shouldDisplay )),
		updateConversation: ( message, index ) =>
			dispatch( updateConversation( message, index )),
	});

export default connect( mapStateToProps, mapDispatchToProps )( Messages );
