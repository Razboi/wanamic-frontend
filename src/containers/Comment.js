import React, { Component } from "react";
import styled from "styled-components";
import { Divider } from "semantic-ui-react";
import api from "../services/api";
import moment from "moment";
import DropdownOptions from "../components/DropdownOptions";
import PropTypes from "prop-types";

const
	CommentAuthor = styled.h4`
		margin: 0px;
	`,
	CommentContent = styled.p`
		margin: 5px 0px;
	`,
	CommentDateTime = styled.span`
		color: #808080;
		margin-left: 5px;
	`,
	CommentHeader = styled.span`
		display: flex;
		flex-direction: row;
	`,
	CommentWrapper = styled.div`
		position: relative;
	`;

class Comment extends Component {
	constructor() {
		super();
		this.state = {
			content: "",
			author: "",
			post: "",
			createdAt: "",
			id: "",
			deleted: false
		};
	}

	static getDerivedStateFromProps( nextProps, prevState ) {
		return {
			content: nextProps.comment.content,
			author: nextProps.comment.author,
			post: nextProps.comment.post,
			createdAt: nextProps.comment.createdAt,
			id: nextProps.comment._id
		};
	}

	handleDelete = () => {
		api.deleteComment( this.state.id, this.state.post )
			.then(() => {
				this.props.handleDelete();
			}).catch( err => console.log( err ));
	};

	handleUpdate = updatedContent => {
		if ( this.state.content !== updatedContent ) {
			this.setState({ content: updatedContent });
			api.updateComment( this.state.id, updatedContent )
				.catch( err => console.log( err ));
		}
	};

	render() {
		if ( this.state.deleted ) {
			return null;
		}
		return (
			<CommentWrapper>
				<CommentHeader>
					<CommentAuthor>{this.state.author}</CommentAuthor>
					<CommentDateTime>
						{moment( this.state.createdAt ).fromNow()}
					</CommentDateTime>
				</CommentHeader>
				<CommentContent>{this.state.content}</CommentContent>

				<DropdownOptions
					author={this.state.author}
					handleUpdate={this.handleUpdate}
					handleDelete={this.handleDelete}
				/>
				<Divider />
			</CommentWrapper>
		);
	}
}

Comment.propTypes = {
	comment: PropTypes.object.isRequired,
	handleDelete: PropTypes.func.isRequired,
	key: PropTypes.number
};

export default Comment;
