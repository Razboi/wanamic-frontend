import React, { Component } from "react";
import styled from "styled-components";
import { Header, Image } from "semantic-ui-react";
import api from "../services/api";
import moment from "moment";
import DropdownOptions from "../components/DropdownOptions";
import PropTypes from "prop-types";
import refreshToken from "../utils/refreshToken";
import extract from "../utils/extractMentionsHashtags";

var userPicture;

const
	Wrapper = styled.div`
		position: relative;
		margin-bottom: 2rem;
	`,
	CommentHeader = styled( Header )`
		min-height: 60px;
		display: flex;
		flex-direction: row;
		padding: 1rem !important;
		margin: 0 !important;
		align-items: center !important;
		font-family: inherit !important;
	`,
	HeaderInfo = styled.div`
		display: flex;
		flex-direction: column;
		margin: 0 2rem 0 0.5rem;
	`,
	AuthorImg = styled( Image )`
		overflow: visible !important;
		width: 30px !important;
		height: 30px !important;
		@media (min-width: 420px) {
			width: 35px !important;
			height: 35px !important;
		}
	`,
	AuthorFullname = styled.span`
		font-size: 1.05rem !important;
		color: #111 !important;
		word-break: break-word !important;
	`,
	AuthorUsername = styled.span`
		font-size: 1rem;
		color: rgba(0,0,0,0.65);
		font-weight: normal;
		margin-left: 0.25rem;
		word-break: break-word !important;
	`,
	DateTime = styled( Header.Subheader )`
		color: rgba(0,0,0,0.45) !important;
		font-size: 1rem !important;
	`,
	Content = styled.p`
		align-self: center;
		word-break: break-word;
		display: flex;
		padding: 0px 1rem;
		min-height: 25px;
		color: #111 !important;
		margin-bottom: 0.5rem;
	`,
	StyledOptions = {
		position: "absolute",
		right: "1rem",
		top: "1rem",
		i: {
			color: "#555"
		}
	},
	ReplyOption = styled.span`
		font-size: 1rem;
		color: #333;
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
			content: ""
		};
	}

	handleChange = e => {
		this.setState({ [ e.target.name ]: e.target.value });
	}

	static getDerivedStateFromProps( nextProps, prevState ) {
		return {
			content: nextProps.comment.content
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

	handleUpdate = async updatedContent => {
		if ( !updatedContent || !this.state.content === updatedContent ) {
			return;
		}
		try {
			const
				mentions = await extract(
					updatedContent, { symbol: false }),
				res = await api.updateComment(
					this.props.comment._id, updatedContent, mentions );
			if ( res === "jwt expired" ) {
				await refreshToken();
				this.handleUpdate();
			} else {
				this.setState({ content: updatedContent });
				this.props.handleUpdate( res.data.updatedComment );
				for ( const notification of res.data.mentionsNotifications ) {
					this.props.socket.emit( "sendNotification", notification );
				}
			}
		} catch ( err ) {
			console.log( err );
		}
	};

	render() {
		const
			s3Bucket = "https://d3dlhr4nnvikjb.cloudfront.net/",
			{ comment } = this.props;
		try {
			if ( comment.author.profileImage ) {
				process.env.REACT_APP_STAGE === "dev" ?
					userPicture = require( "../images/" + comment.author.profileImage )
					:
					userPicture = s3Bucket + comment.author.profileImage;
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
							{comment.author.fullname}
							<AuthorUsername>
								@{comment.author.username}
							</AuthorUsername>
						</AuthorFullname>
						<DateTime className="postDate">
							{moment( comment.createdAt ).fromNow()}
						</DateTime>
					</HeaderInfo>

					{ !this.props.fakeOptions &&
						<DropdownOptions
							style={StyledOptions}
							author={comment.author}
							currentContent={comment.content}
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
	handleUpdate: PropTypes.func.isRequired,
	handleReply: PropTypes.func.isRequired,
	socket: PropTypes.object.isRequired
};

export default Comment;
