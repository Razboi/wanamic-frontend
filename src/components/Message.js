import React, { Component } from "react";
import styled from "styled-components";
import { Divider } from "semantic-ui-react";
import moment from "moment";
import PropTypes from "prop-types";

const
	MessageAuthor = styled.h4`
		margin: 0px;
	`,
	MessageContent = styled.p`
		margin: 5px 0px;
	`,
	MessageDateTime = styled.span`
		color: #808080;
		margin-left: 5px;
	`,
	MessageHeader = styled.span`
		display: flex;
		flex-direction: row;
	`,
	MessageWrapper = styled.div`
		position: relative;
	`;

class Message extends Component {
	render() {
		return (
			<MessageWrapper>
				<MessageHeader>
					<MessageAuthor>{this.props.message.author}</MessageAuthor>
					<MessageDateTime>
						{moment( this.props.message.createdAt ).fromNow()}
					</MessageDateTime>
				</MessageHeader>
				<MessageContent>{this.props.message.content}</MessageContent>

				<Divider />
			</MessageWrapper>
		);
	}
}

Message.propTypes = {
	message: PropTypes.object.isRequired
};

export default Message;
