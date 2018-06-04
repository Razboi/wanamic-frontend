import React, { Component } from "react";
import styled from "styled-components";
import { Divider } from "semantic-ui-react";
import api from "../services/api";
import moment from "moment";
import DropdownOptions from "../components/DropdownOptions";
import PropTypes from "prop-types";
import refreshToken from "../utils/refreshToken";

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
			updatedContent: ""
		};
	}

	handleChange = e => {
		this.setState({ [ e.target.name ]: e.target.value });
	}

	static getDerivedStateFromProps( nextProps, prevState ) {
		return {
			content: nextProps.comment.content,
			updatedContent: nextProps.comment.content
		};
	}

	handleDelete = () => {
		api.deleteComment( this.props.comment._id, this.props.comment.post )
			.then( res => {
				if ( res === "jwt expired" ) {
					refreshToken()
						.then(() => this.handleDelete())
						.catch( err => console.log( err ));
				} else {
					this.props.handleDelete( this.props.index, res.data );
				}
			}).catch( err => console.log( err ));
	};

	handleUpdate = () => {
		if ( this.state.content !== this.state.updatedContent
			&& this.state.updatedContent !== "" ) {
			api.updateComment( this.props.comment._id, this.state.updatedContent )
				.then( res => {
					if ( res === "jwt expired" ) {
						refreshToken()
							.then(() => this.handleUpdate())
							.catch( err => console.log( err ));
					} else {
						this.setState({ content: this.state.updatedContent });
					}
				}).catch( err => console.log( err ));
		}
	};

	render() {
		return (
			<CommentWrapper>
				<CommentHeader>
					<CommentAuthor>{this.props.comment.author}</CommentAuthor>
					<CommentDateTime>
						{moment( this.props.comment.createdAt ).fromNow()}
					</CommentDateTime>
				</CommentHeader>
				<CommentContent>{this.state.content}</CommentContent>

				<DropdownOptions
					author={this.props.comment.author}
					updatedContent={this.state.updatedContent}
					handleUpdate={this.handleUpdate}
					handleDelete={this.handleDelete}
					handleChange={this.handleChange}
				/>
				<Divider />
			</CommentWrapper>
		);
	}
}

Comment.propTypes = {
	comment: PropTypes.object.isRequired,
	handleDelete: PropTypes.func.isRequired
};

export default Comment;
