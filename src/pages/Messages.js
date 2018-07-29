import React, { Component } from "react";
import styled from "styled-components";
import { Image, Button, Header, Label } from "semantic-ui-react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import api from "../services/api";
import {
	switchMessages, setConversations, selectConversation,
	updateConversation, addConversation, setupNewConversation,
	deleteChat
} from "../services/actions/conversations";
import Conversation from "../components/Conversation";
import FriendsList from "../components/FriendsList";
import refreshToken from "../utils/refreshToken";
import moment from "moment";
import NavBar from "../containers/NavBar";

const
	Wrapper = styled.div`
		@media (max-width: 420px) {
			display: ${props => props.onHome && "none"};
			height: 100vh;
			width: 100%;
			overflow: hidden;
			position: absolute;
			z-index: 3;
			background: #fff;
			padding-top: 49.33px;
			::-webkit-scrollbar {
				display: none !important;
			}
		}
		@media (min-width: 420px) {
			height: 100vh;
			position: fixed;
			right: 0;
			width: 260px;
			background: rgba( 255, 255, 255, 0.4 );
		}
	`,
	PageHeader = styled.div`
		border-bottom: 1px solid rgba(0, 0, 0, .1);
		text-align: center;
		padding: 15px 10px;
		font-size: 17px;
		font-weight: bold;
		@media (min-width: 420px) {
			display: none;
		}
	`,
	NewConversationButton = styled( Button )`
		position: fixed;
		right: 10px;
		bottom: 10px;
		z-index: 3;
		background: rgb(133, 217, 191) !important;
		font-size: 1.28rem !important;
		margin: 0 !important;
		@media (min-width: 420px) {
			bottom: 50px;
			background: none !important;
			position: absolute;
			font-size: 1rem !important;
			i {
				color: rgba(0,0,0,0.4) !important;
			}
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
		@media (min-width: 420px) {
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
		@media (min-width: 420px) {
			font-size: 1rem !important;
			font-weight: 500 !important;
		}
	`,
	LastMessage = styled( Header.Subheader )`
		white-space: nowrap !important;
		overflow: hidden !important;
		text-overflow: ellipsis !important;
		@media (min-width: 420px) {
			font-size: 0.9rem !important;
		}
	`,
	LastMessageTime = styled.span`
		font-size: 0.87rem;
		color: rgba(0,0,0,0.78);
		align-self: self-start;
		@media (min-width: 420px) {
			font-size: 0.85rem !important;
		}
	`,
	NewMessagesCount = styled( Label )`
		position: absolute;
		right: 1.1rem;
		bottom: 0.5rem;
	`;

var interval;
class Messages extends Component {
	constructor() {
		super();
		this.state = {
			friends: [],
			displayFriendsList: false,
			displayConversation: false,
			messageInput: "",
			sentMessages: 0,
			spam: false
		};
	}

	// Must await to get chats for checking if the conversation
	// already exists
	async componentDidMount() {
		interval = setInterval( this.resetMessagesLimit, 10000 );
		await this.getActiveChats();
		if ( this.props.messageTarget ) {
			this.handleNewConversation( this.props.messageTarget );
		}
	}

	componentWillUnmount() {
		clearInterval( interval );
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
		this.setState({
			displayConversation: true,
			displayFriendsList: false
		});
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

	handleFriendsList = async() => {
		const friends = await api.getFriends();
		if ( friends === "jwt expired" ) {
			try {
				await refreshToken();
			} catch ( err ) {
				console.log( err );
			}
			this.handleFriendsList();
		} else {
			this.setState({ friends: friends.data, displayFriendsList: true });
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
		this.setState({
			displayFriendsList: false,
			displayConversation: false
		});
	}

	handleSpam = () => {
		this.setState({ spam: true });
		setTimeout(() => {
			this.setState({ spam: false });
		}, 10000 );
	}

	render() {
		const {
			conversations, selectedConversation, newConversation,
			messageTarget, onHome
		} = this.props;
		if ( this.state.displayConversation && !onHome ) {
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
					back={this.backToOpenConversations}
					messageInput={this.state.messageInput}
					spam={this.state.spam}
				/>
			);
		}
		if ( this.state.displayFriendsList && !onHome ) {
			return (
				<FriendsList
					friends={this.state.friends}
					handleNewConversation={this.handleNewConversation}
					back={this.backToOpenConversations}
				/>
			);
		}
		if ( !messageTarget ) {
			return (
				<React.Fragment>
					<Wrapper onHome={this.props.onHome}>
						{this.state.displayFriendsList && onHome ?
							<FriendsList
								friends={this.state.friends}
								handleNewConversation={this.handleNewConversation}
								back={this.backToOpenConversations}
							/>
							:
							<React.Fragment>
								<NavBar hideOnLargeScreen socket={this.props.socket} />
								<PageHeader>Conversations</PageHeader>

								<div className="conversationsList">
									{this.props.conversations.map(( chat, index ) =>
										<OpenConversation
											key={index}
											onClick={() => this.handleSelectConversation( index ) }
											newMessages={chat.newMessagesCount > 0}
										>
											<UserImg
												circular
												src={chat.target.profileImage ?
													require( "../images/" + chat.target.profileImage )
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
								</div>
								<NewConversationButton
									onClick={this.handleFriendsList}
									primary
									circular
									icon="comment"
								/>
							</React.Fragment>
						}
					</Wrapper>

					{this.state.displayConversation && onHome &&
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
							back={this.backToOpenConversations}
							messageInput={this.state.messageInput}
							spam={this.state.spam}
						/>
					}
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
	chatNotifications: PropTypes.array.isRequired,
	messageTarget: PropTypes.object,
	socket: PropTypes.object.isRequired,
	onHome: PropTypes.bool
};

const
	mapStateToProps = state => ({
		conversations: state.conversations.allConversations,
		selectedConversation: state.conversations.selectedConversation,
		newConversation: state.conversations.newConversation,
		chatNotifications: state.conversations.notifications
	}),

	mapDispatchToProps = dispatch => ({
		setConversations: convers => dispatch( setConversations( convers )),
		addConversation: conver => dispatch( addConversation( conver )),
		deleteChat: targetUsername => dispatch( deleteChat( targetUsername )),
		selectConversation: index => dispatch( selectConversation( index )),
		setupNewConversation: conver => dispatch( setupNewConversation( conver )),
		switchMessages: ( id ) => dispatch( switchMessages( id )),
		updateConversation: ( message, index ) =>
			dispatch( updateConversation( message, index )),
	});

export default connect( mapStateToProps, mapDispatchToProps )( Messages );
