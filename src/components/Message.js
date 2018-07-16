import React, { Component } from "react";
import styled from "styled-components";
import moment from "moment";
import PropTypes from "prop-types";
import { scrolled } from "react-stay-scrolled";

const
	MessageWrapper = styled.div`
		overflow: hidden;
		position: relative;
		width: 60%
		margin-bottom: 1rem;
    border-radius: 6px;
    padding: 10px;
		margin-left: ${props => props.fromUser ?
		"auto" : "none"};
		background-color: ${props => props.fromUser ?
		"lightblue" : "lightgrey"};
	`,
	MessageContent = styled.p`
		font-size: 1.1rem;
		word-break: break-word;
	`,
	MessageDateTime = styled.span`
		position: absolute;
		right: 5px;
		bottom: 0;
		color: #808080;
		font-size: 0.75rem;
	`;

class Message extends Component {
	componentDidMount() {
		this.props.stayScrolled();
	}
	render() {
		return (
			<MessageWrapper
				fromUser={
					this.props.message.author.username === localStorage.getItem( "username" )
				}
			>
				<MessageContent>{this.props.message.content}</MessageContent>

				<MessageDateTime>
					{moment( this.props.message.createdAt ).format( "HH:mm" )}
				</MessageDateTime>
			</MessageWrapper>
		);
	}
}

Message.propTypes = {
	message: PropTypes.object.isRequired
};

export default scrolled( Message );
