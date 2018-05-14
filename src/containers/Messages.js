import React, { Component } from "react";
import styled from "styled-components";
import { Divider, Button, Icon, Input } from "semantic-ui-react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import api from "../services/api";
import { switchMessages, addMessage, setMessages } from "../services/actions/messages";
import Message from "../components/Message";

const
	Wrapper = styled.div`
		height: 100vh;
		width: 100%;
		position: absolute;
		z-index: 3;
		background: #fff;
		padding-top: 49.33px;
	`,
	FriendListWrapper = styled.div`
		height: 100vh;
		width: 100%;
		position: absolute;
		z-index: 4;
		background: #fff;
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
	`,
	Friend = styled.div`
		padding: 10px;
	`,
	StyledDivider = styled( Divider )`
		margin: 0px !important;
	`,
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
	`;


class Messages extends Component {
	constructor() {
		super();
		this.state = {
			friends: [],
			displayFriendsList: false,
			messages: [],
			displayConversation: false,
			receiver: undefined,
			messageInput: "",
			conversations: []
		};
	}

	componentDidMount() {
		api.getChats()
			.then( res => this.setState({ conversations: res.data }))
			.catch( err => console.log( err ));
	}

	handleChange = e => {
		this.setState({ [ e.target.name ]: e.target.value });
	}

	handleKeyPress = e => {
		if ( e.key === "Enter" ) {
			this.handleSendMessage();
		}
	}

	handleNewConversation = () => {
		api.getFriends()
			.then( res => this.setState({ friends: res.data, displayFriendsList: true }))
			.catch( err => console.log( err ));
	}

	handleSelectReceiver = receiver => {
		api.getConversation( receiver.username )
			.then( res => {
				this.setState({
					receiver: receiver,
					displayConversation: true,
					displayFriendsList: false
				});
				this.props.setMessages( res.data, 0 );
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
				.catch( err => console.log( err ));
			this.setState({ messageInput: "" });
			this.props.socket.emit( "sendMessage", newMessage );
			this.props.addMessage( newMessage );
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
				<ConversationWrapper>
					<HeaderWrapper>
						<Icon name="arrow left" onClick={this.switchConversation} />
						<HeaderTxt>{this.state.receiver.username}</HeaderTxt>
					</HeaderWrapper>
					<MessagesWrapper>
						{this.props.messages.map(( message, index ) =>
							<Message message={message} key={index} />
						)}
					</MessagesWrapper>
					<StyledInput
						name="messageInput"
						value={this.state.messageInput}
						placeholder="Write a message"
						onChange={this.handleChange}
						onKeyPress={this.handleKeyPress}
					/>
				</ConversationWrapper>
			);
		}
		if ( this.state.displayFriendsList ) {
			return (
				<FriendListWrapper>
					<HeaderWrapper>
						<Icon
							name="arrow left"
							onClick={this.switchFriendsList}
						/>
						<HeaderTxt>Friends</HeaderTxt>
					</HeaderWrapper>
					{this.state.friends.map(( friend, index ) =>
						<React.Fragment key={index}>
							<Friend onClick={() => this.handleSelectReceiver( friend )}>
								<span>
									<b>{friend.username}</b>
								</span>
							</Friend>
							<StyledDivider />
						</React.Fragment>
					)}
				</FriendListWrapper>
			);
		}
		return (
			<Wrapper>
				<Header>Conversations</Header>
				{this.state.conversations.map(( receiver, index ) =>
					<React.Fragment key={index}>
						<Friend onClick={() => this.handleSelectReceiver( receiver )}>
							<span>
								<b>{receiver.username}</b>
							</span>
						</Friend>
						<StyledDivider />
					</React.Fragment>
				)}
				<NewConversationButton
					onClick={this.handleNewConversation}
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
