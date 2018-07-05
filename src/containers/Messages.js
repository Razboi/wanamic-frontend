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

const
	Wrapper = styled.div`
		height: 100vh;
		width: 100%;
		overflow: hidden;
		position: absolute;
		z-index: 3;
		background: #fff;
		padding-top: 49.33px;
	`,
	PageHeader = styled.div`
		border-bottom: 1px solid #000;
		padding: 15px 10px;
		font-size: 17px;
		font-weight: bold;
	`,
	NewConversationButton = styled( Button )`
		position: fixed;
		right: 10px;
		bottom: 10px;
		z-index: 3;
	`,
	OpenConversation = styled.div`
		display: flex;
		position: relative;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		padding: 0.66rem 1rem;
		border-bottom: 1px solid rgba(0, 0, 0, .1);
		background: ${props => props.newMessages ? "rgba(0, 0, 0, .07)" : "none"};
	`,
	UserImg = styled( Image )`
		width: 35px !important;
		height: 35px !important;
	`,
	TextInfo = styled( Header )`
		display: flex;
		flex: 1 0 0%;
		flex-direction: column;
		margin: 0 0 0 0.5rem !important;
		overflow: hidden !important;
	`,
	UserFullname = styled.span`
		font-size: 1.1rem !important;
	`,
	LastMessage = styled( Header.Subheader )`
		white-space: nowrap !important;
		overflow: hidden !important;
		text-overflow: ellipsis !important;
	`,
	LastMessageTime = styled.span`
		font-size: 0.87rem;
		color: rgba(0,0,0,0.78);
		align-self: self-start;
	`,
	NewMessagesCount = styled( Label )`
		position: absolute;
		right: 1.1rem;
		bottom: 0.5rem;
	`;


class Messages extends Component {
	constructor() {
		super();
		this.state = {
			friends: [],
			displayFriendsList: false,
			displayConversation: false,
			messageInput: ""
		};
	}

	componentDidMount() {
		this.getActiveChats();
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

	handleDeleteChat = async targetUsername => {
		const response = await api.deleteChat( targetUsername );
		if ( response === "jwt expired" ) {
			try {
				await refreshToken();
			} catch ( err ) {
				console.log( err );
			}
			this.handleDeleteChat();
		} else {
			this.backToOpenConversations();
			this.props.deleteChat( targetUsername );
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
			{ messageInput } = this.state,
			conversation = newConversation ?
				newConversation
				:
				conversations[ selectedConversation ];

		if ( messageInput ) {
			const res = await api.sendMessage(
				conversation.target.username, messageInput
			);
			if ( res === "jwt expired" ) {
				try {
					await refreshToken();
				} catch ( err ) {
					console.log( err );
				}
				this.handleSendMessage();
			} else {
				this.setState({ messageInput: "" });
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
		this.setState({
			displayFriendsList: false,
			displayConversation: false
		});
	}

	render() {
		const {
			conversations, selectedConversation, newConversation
		} = this.props;
		if ( this.state.displayConversation ) {
			return (
				<Conversation
					conversation={newConversation ?
						newConversation
						:
						conversations[ selectedConversation ]
					}
					handleKeyPress={this.handleKeyPress}
					handleChange={this.handleChange}
					handleDeleteChat={this.handleDeleteChat}
					back={this.backToOpenConversations}
					messageInput={this.state.messageInput}
				/>
			);
		}
		if ( this.state.displayFriendsList ) {
			return (
				<FriendsList
					friends={this.state.friends}
					handleNewConversation={this.handleNewConversation}
					back={this.backToOpenConversations}
				/>
			);
		}
		return (
			<Wrapper>
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
									@{chat.messages[ 0 ].author}: {chat.messages[ 0 ].content}
								</LastMessage>
							</TextInfo>
							<LastMessageTime>
								{moment( chat.messages[ 0 ].createdAt ).fromNow( true )}
							</LastMessageTime>
							{chat.newMessagesCount > 0 &&
								<NewMessagesCount
									size="tiny" circular color="red"
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
					size="big"
				/>
			</Wrapper>
		);
	}
}

Messages.propTypes = {
	conversations: PropTypes.array.isRequired,
	selectedConversation: PropTypes.number.isRequired,
	switchMessages: PropTypes.func.isRequired,
	chatNotifications: PropTypes.number.isRequired,
};

const
	mapStateToProps = state => ({
		conversations: state.conversations.allConversations,
		selectedConversation: state.conversations.selectedConversation,
		newConversation: state.conversations.newConversation,
		chatNotifications: state.conversations.chatNotifications
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
