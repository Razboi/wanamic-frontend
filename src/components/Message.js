import React, { Component } from "react";
import styled from "styled-components";
import moment from "moment";
import PropTypes from "prop-types";
import { scrolled } from "react-stay-scrolled";

const
	MessageWrapper = styled.div`
		display: inline-block;
		position: relative;
		max-width: 60%
		min-width: 60px;
		margin-bottom: 1rem;
    border-radius: 6px;
    padding: 10px;
		align-self: ${props => props.fromUser ?
		"flex-end" : "flex-start"};
		background-color: ${props => props.fromUser ?
		"rgb(133, 217, 191)" : "rgb(230,230,230)"};
		color: ${props => props.fromUser ?
		"#fff" : "#000"};
	`,
	MessageContent = styled.p`
		font-size: 1.1rem;
		word-break: break-word;
	`,
	MessageDateTime = styled.span`
		position: absolute;
		right: 5px;
		bottom: 0;
		color: ${props => props.fromUser ?
		"#EEEDDD" : "#808080"};
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

				<MessageDateTime
					fromUser={
						this.props.message.author.username === localStorage.getItem( "username" )
					}
				>
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
