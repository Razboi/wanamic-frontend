import React, { Component } from "react";
import styled from "styled-components";
import { Header, Image } from "semantic-ui-react";
import api from "../services/api";
import moment from "moment";
import DropdownOptions from "../components/DropdownOptions";
import PropTypes from "prop-types";
import refreshToken from "../utils/refreshToken";

var userPicture;

const
	Wrapper = styled.div`
		position: relative;
		border-bottom: 1px solid rgba(0, 0, 0, .1);
		padding-bottom: 1rem;
	`,
	CommentHeader = styled( Header )`
		height: 60px;
		display: flex;
		flex-direction: row;
		padding: 0 1rem !important;
		margin: 0 !important;
		align-items: center !important;
	`,
	HeaderInfo = styled.div`
		display: flex;
		flex-direction: column;
		margin-left: 0.5rem;
	`,
	AuthorImg = styled( Image )`
		width: 30px !important;
		height: 30px !important;
	`,
	AuthorFullname = styled.span`
		font-size: 1.2rem !important;
		color: hsl(0,0%,13%) !important;
	`,
	AuthorUsername = styled.span`
		font-size: 1rem;
		color: rgba(0,0,0,0.65);
		font-weight: normal;
		margin-left: 0.25rem;
	`,
	DateTime = styled( Header.Subheader )`
		color: rgba(0,0,0,0.45) !important;
		font-size: 1rem !important;
	`,
	Content = styled.p`
		align-self: center;
		word-break: break-all;
		display: flex;
		padding: 0px 1rem;
		min-height: 25px;
	`,
	StyledOptions = {
		position: "absolute",
		right: "1rem",
		top: "1rem",
	},
	ReplyOption = styled.span`
		font-size: 1rem;
		color: rgba(0,0,0,0.65);
		font-weight: bold;
	`,
	CommentOptions = styled.div`
		display: flex;
		justify-content: center;
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
		try {
			if ( this.props.comment.authorImg ) {
				userPicture = require( "../images/" + this.props.comment.authorImg );
			} else {
				userPicture = require( "../images/defaultUser.png" );
			}
		} catch ( err ) {
			console.log( err );
		}
		return (
			<Wrapper>
				<CommentHeader>
					<AuthorImg circular src={userPicture} />
					<HeaderInfo>
						<AuthorFullname className="postAuthor">
							{this.props.comment.authorFullname}
							<AuthorUsername>
								@{this.props.comment.author}
							</AuthorUsername>
						</AuthorFullname>
						<DateTime className="postDate">
							{moment( this.props.comment.createdAt ).fromNow()}
						</DateTime>
					</HeaderInfo>

					{ !this.props.fakeOptions &&
						<DropdownOptions
							style={StyledOptions}
							author={this.props.comment.author}
							updatedContent={this.state.updatedContent}
							handleUpdate={this.handleUpdate}
							handleDelete={this.handleDelete}
							handleChange={this.handleChange}
						/>
					}
				</CommentHeader>
				<Content>{this.state.content}</Content>

				<CommentOptions>
					<ReplyOption onClick={this.props.handleReply}>
						Reply
					</ReplyOption>
				</CommentOptions>
			</Wrapper>
		);
	}
}

Comment.propTypes = {
	comment: PropTypes.object.isRequired,
	handleDelete: PropTypes.func.isRequired,
	handleReply: PropTypes.func.isRequired
};

export default Comment;
