import React, { Component } from "react";
import styled from "styled-components";
import { Divider, Button } from "semantic-ui-react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import api from "../services/api";
import {
	switchMessages, addMessage, setMessages
} from "../services/actions/messages";
import Conversation from "../components/Conversation";
import FriendsList from "../components/FriendsList";
import refreshToken from "../utils/refreshToken";

const
	Wrapper = styled.div`
		height: 100vh;
		width: 100%;
		position: absolute;
		z-index: 3;
		background: #fff;
		padding-top: 49.33px;
	`,
	Header = styled.div`
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
	Friend = styled.div`
		padding: 10px;
	`,
	StyledDivider = styled( Divider )`
		margin: 0px !important;
	`;


class Messages extends Component {
	constructor() {
		super();
		this.state = {
			friends: [],
			displayFriendsList: false,
			displayConversation: false,
			receiver: {},
			messageInput: "",
			conversations: []
		};
	}

	componentDidMount() {
		this.getActiveChats();
	}

	getActiveChats = () => {
		api.getChats()
			.then( res => {
				if ( res === "jwt expired" ) {
					refreshToken()
						.then(() => this.getActiveChats())
						.catch( err => console.log( err ));
				} else {
					this.setState({ conversations: res.data });
				}
			}).catch( err => console.log( err ));
	}

	handleChange = e => {
		this.setState({ [ e.target.name ]: e.target.value });
	}

	handleKeyPress = e => {
		if ( e.key === "Enter" ) {
			this.handleSendMessage();
		}
	}

	handleFriendsList = () => {
		api.getFriends()
			.then( res => {
				if ( res === "jwt expired" ) {
					refreshToken()
						.then(() => this.handleFriendsList())
						.catch( err => console.log( err ));
				} else {
					this.setState({ friends: res.data, displayFriendsList: true });
				}
			}).catch( err => console.log( err ));
	}

	handleSelectConversation = receiver => {
		api.getConversation( receiver.username )
			.then( res => {
				if ( res === "jwt expired" ) {
					refreshToken()
						.then(() => this.handleSelectConversation())
						.catch( err => console.log( err ));
				} else {
					this.setState({
						receiver: receiver,
						displayConversation: true,
						displayFriendsList: false
					});
					this.props.setMessages( res.data, 0 );
				}
			}).catch( err => console.log( err ));
	}

	handleSendMessage = () => {
		if ( this.state.messageInput ) {
			const newMessage = {
				author: localStorage.getItem( "username" ),
				content: this.state.messageInput,
				receiver: this.state.receiver.username
			};

			api.sendMessage( this.state.receiver.username, this.state.messageInput )
				.then( res => {
					if ( res === "jwt expired" ) {
						refreshToken()
							.then(() => this.handleSendMessage())
							.catch( err => console.log( err ));
					} else {
						this.setState({ messageInput: "" });
						this.props.socket.emit( "sendMessage", newMessage );
						this.props.addMessage( newMessage );
					}
				}).catch( err => console.log( err ));
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
					receiver={this.state.receiver}
					messages={this.props.messages}
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
					handleSelectConversation={this.handleSelectConversation}
					switchFriendsList={this.switchFriendsList}
				/>
			);
		}
		return (
			<Wrapper>
				<Header>Conversations</Header>
				<div className="conversationsList">
					{this.state.conversations.map(( receiver, index ) =>
						<React.Fragment key={index}>
							<Friend onClick={() => this.handleSelectConversation( receiver )}>
								<span>
									<b>{receiver.username}</b>
								</span>
							</Friend>
							<StyledDivider />
						</React.Fragment>
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
	messages: PropTypes.array.isRequired,
	switchMessages: PropTypes.func.isRequired
};

const
	mapStateToProps = state => ({
		messages: state.messages.allMessages
	}),

	mapDispatchToProps = dispatch => ({
		switchMessages: ( id ) => dispatch( switchMessages( id )),
		addMessage: message => dispatch( addMessage( message )),
		setMessages: ( allMessages, newMessages ) => {
			dispatch( setMessages( allMessages, newMessages ));
		},
	});

export default connect( mapStateToProps, mapDispatchToProps )( Messages );
