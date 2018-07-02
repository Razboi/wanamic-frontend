import React, { Component } from "react";
import styled from "styled-components";
import { Image, Button, Header } from "semantic-ui-react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import api from "../services/api";
import {
	switchMessages, addMessage, setConversations, selectConversation,
	updateConversation, addConversation
} from "../services/actions/conversations";
import Conversation from "../components/Conversation";
import FriendsList from "../components/FriendsList";
import refreshToken from "../utils/refreshToken";

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
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		padding: 1rem;
		border-bottom: 1px solid rgba(0, 0, 0, .1);
	`,
	UserImg = styled( Image )`
		width: 30px !important;
		height: 30px !important;
	`,
	TextInfo = styled( Header )`
		display: flex;
		flex: 1 0 0%;
		flex-direction: column;
		margin-left: 0.5rem !important;
		margin-top: 0 !important;
		overflow: hidden !important;
	`,
	UserFullname = styled.span`
		font-size: 1.1rem !important;
	`,
	LastMessage = styled( Header.Subheader )`
		white-space: nowrap !important;
		overflow: hidden !important;
		text-overflow: ellipsis !important;
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
			this.handleSendMessage();
		}
	}

	handleNewConversation = async receiver => {
		// CHECK IF CONVER ALREADY ON OPENCHATS
		const conversation = await api.getConversation( receiver.username );
		if ( conversation === "jwt expired" ) {
			try {
				await refreshToken();
			} catch ( err ) {
				console.log( err );
			}
			this.handleNewConversation();
		} else if ( conversation.data ) {
			this.handleSelectConversation( conversation.data );
		} else {
			this.setState({
				displayConversation: true,
				displayFriendsList: false
			});
		}
	}

	handleSelectConversation = ( conversation, index ) => {
		this.setState({
			displayConversation: true,
			displayFriendsList: false
		});
		conversation.index = index;
		this.props.selectConversation( conversation );
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
			{ messageInput } = this.state,
			conversation = this.props.currentConversation;
		if ( messageInput ) {
			const
				newMessage = {
					author: localStorage.getItem( "username" ),
					content: messageInput,
					receiver: conversation.target.username
				},
				response = await api.sendMessage(
					conversation.target.username, messageInput
				);
			if ( response === "jwt expired" ) {
				try {
					await refreshToken();
				} catch ( err ) {
					console.log( err );
				}
				this.handleSendMessage();
			} else {
				this.setState({ messageInput: "" });
				this.props.socket.emit( "sendMessage", newMessage );
				response.data.newConversation ?
					this.props.addConversation( response.data.newConversation )
					:
					this.props.updateConversation( newMessage, conversation.index );
			}
		}
	}

	switchFriendsList = () => {
		this.setState({ displayFriendsList: !this.state.displayFriendsList });
	}

	switchConversation = () => {
		this.setState({ displayConversation: !this.state.displayConversation });
	}

	render() {
		if ( this.state.displayConversation ) {
			return (
				<Conversation
					conversation={this.props.currentConversation}
					handleKeyPress={this.handleKeyPress}
					handleChange={this.handleChange}
					switchConversation={this.switchConversation}
					messageInput={this.state.messageInput}
				/>
			);
		}
		if ( this.state.displayFriendsList ) {
			return (
				<FriendsList
					friends={this.state.friends}
					handleNewConversation={this.handleNewConversation}
					switchFriendsList={this.switchFriendsList}
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
							onClick={() =>
								this.handleSelectConversation( chat, index )
							}
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
	currentConversation: PropTypes.object.isRequired,
	switchMessages: PropTypes.func.isRequired
};

const
	mapStateToProps = state => ({
		conversations: state.conversations.allConversations,
		currentConversation: state.conversations.currentConversation
	}),

	mapDispatchToProps = dispatch => ({
		setConversations: convers => dispatch( setConversations( convers )),
		addConversation: conver => dispatch( addConversation( conver )),
		selectConversation: conver => dispatch( selectConversation( conver )),
		switchMessages: ( id ) => dispatch( switchMessages( id )),
		addMessage: message => dispatch( addMessage( message )),
		updateConversation: ( message, index ) =>
			dispatch( updateConversation( message, index )),
	});

export default connect( mapStateToProps, mapDispatchToProps )( Messages );
