import React, { Component } from "react";
import styled from "styled-components";
import { Icon } from "semantic-ui-react";
import api from "../services/api";
import Comment from "./Comment";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
	switchComments, setComments, setNewsfeed, addComment, deleteComment, updatePost
} from "../services/actions/posts";
import refreshToken from "../utils/refreshToken";
import { MentionsInput, Mention } from "react-mentions";

const defaultStyle = {
		control: {
			backgroundColor: "#fff",

			fontSize: 12,
			fontWeight: "normal",
		},

		highlighter: {
			overflow: "hidden",
			lineHeight: 1
		},

		input: {
			margin: 0,
		},

		"&singleLine": {
			control: {
				display: "inline-block",

				width: 130,
			},

			highlighter: {
				padding: 1,
				border: "2px inset transparent",
			},

			input: {
				padding: 1,

				border: "2px inset",
			},
		},

		"&multiLine": {
			control: {
				fontFamily: "monospace",
				border: "1px solid silver",
			},

			highlighter: {
				padding: 9,
			},

			input: {
				padding: 9,
				minHeight: 63,
				outline: 0,
				border: 0,
			},
		},

		suggestions: {
			list: {
				backgroundColor: "white",
				border: "1px solid rgba(0,0,0,0.15)",
				fontSize: 10,
			},

			item: {
				padding: "5px 15px",
				borderBottom: "1px solid rgba(0,0,0,0.15)",

				"&focused": {
					backgroundColor: "#cee4e5",
				},
			},
		},
	},

	defaultMentionStyle = {
		color: "#cee4e5",
		fontWeight: "bold"
	},
	Wrapper = styled.div`
		position: absolute;
		height: 100vh;
		width: 100%;
		overflow: hidden;
		z-index: 4;
		background: #fff;
		display: grid;
		grid-template-columns: 100%;
		grid-template-rows: 7% 79% 14%;
		grid-template-areas:
			"hea"
			"com"
			"inp"
	`,
	HeaderWrapper = styled.div`
		grid-area: hea;
		display: flex;
		align-items: center;
		padding-left: 10px;
		border-bottom: 1px solid rgba(0, 0, 0, .5);
	`,
	CommentsWrapper = styled.div`
		grid-area: com;
		padding: 10px;
		overflow-y: scroll;
	`,
	StyledInput = styled( MentionsInput )`
		grid-area: inp;
		.commentInput__control {
			height: 100% !important;
		}

	`,
	HeaderTxt = styled.span`
		margin-left: 15px;
		font-weight: bold;
		font-size: 16px;
	`;

class Comments extends Component {
	constructor() {
		super();
		this.state = {
			comment: "",
			socialCircle: [],
			mentions: []
		};
	}

	componentDidMount() {
		this.getInitialComments();
		this.getSocialCircle();
	}

	getInitialComments = () => {
		api.getPostComments( this.props.postId, 0 )
			.then( res => {
				if ( res === "jwt expired" ) {
					refreshToken()
						.then(() => this.getInitialComments())
						.catch( err => console.log( err ));
				} else {
					this.props.setComments( res.data );
				}
			}).catch( err => console.log( err ));
	}

	getSocialCircle = () => {
		api.getSocialCircle()
			.then( res => {
				if ( res === "jwt expired" ) {
					refreshToken()
						.then(() => this.getSocialCircle())
						.catch( err => console.log( err ));
				} else {
					this.setState({ socialCircle: res.data });
				}
			}).catch( err => console.log( err ));
	}

	handleChange = e => {
		this.setState({ comment: e.target.value });
	}

	handleKeyPress = e => {
		if ( e.key === "Enter" ) {
			this.handleComment();
		}
	}

	handleComment = () => {
		const mentions = this.state.mentions.filter( mention => {
			return this.state.comment.includes( mention );
		});

		api.createComment( this.state.comment, this.props.postId, mentions )
			.then( res => {
				if ( res === "jwt expired" ) {
					refreshToken()
						.then(() => this.handleComment())
						.catch( err => console.log( err ));
				} else {
					this.setState({ comment: "" });
					res.data.newNotification && this.props.socket.emit(
						"sendNotification", res.data.newNotification
					);
					this.props.addComment( res.data.newComment );
					this.props.updatePost( res.data.updatedPost );
				}
			}).catch( err => console.log( err ));
	}

	handleDelete = ( commentIndex, updatedPost ) => {
		this.props.deleteComment( commentIndex );
		this.props.updatePost( updatedPost );
	};

	handleMention = ( id, display ) => {
		if ( !this.state.mentions.includes( id )) {
			this.setState({ mentions: [ ...this.state.mentions, id ] });
		}
	}

	render() {
		return (
			<Wrapper>
				<HeaderWrapper>
					<Icon name="arrow left" onClick={() => this.props.switchComments()} />
					<HeaderTxt>Comments</HeaderTxt>
				</HeaderWrapper>
				<CommentsWrapper className="commentsWrapper">
					{this.props.comments.map(( comment, index ) =>
						<Comment
							key={index}
							index={index}
							comment={comment}
							handleDelete={this.handleDelete}
						/>
					)}
				</CommentsWrapper>
				<StyledInput
					markup="@__id__"
					className="commentInput"
					name="comment"
					value={this.state.comment}
					placeholder="Comment..."
					onChange={this.handleChange}
					onKeyPress={this.handleKeyPress}
					style={defaultStyle}
					displayTransform={id => `@${id}`}
				>
					<Mention
						trigger="@"
						data={this.state.socialCircle}
						appendSpaceOnAdd={true}
						onAdd={this.handleMention}
						renderSuggestion={( suggestion, search, highlightedDisplay ) => (
							<div className="user">{highlightedDisplay}</div>
						)}
						style={defaultMentionStyle}
					/>
				</StyledInput>
			</Wrapper>
		);
	}
}

Comments.propTypes = {
	switchComments: PropTypes.func.isRequired,
	setComments: PropTypes.func.isRequired,
	setNewsfeed: PropTypes.func.isRequired,
	postId: PropTypes.string.isRequired,
	newsfeed: PropTypes.array.isRequired,
	comments: PropTypes.array
};

const
	mapStateToProps = state => ({
		postId: state.posts.postDetailsId,
		newsfeed: state.posts.newsfeed,
		comments: state.posts.comments
	}),

	mapDispatchToProps = dispatch => ({
		switchComments: ( id ) => dispatch( switchComments( id )),
		setComments: comments => dispatch( setComments( comments )),
		setNewsfeed: posts => dispatch( setNewsfeed( posts )),
		addComment: comment => dispatch( addComment( comment )),
		deleteComment: commentIndex => dispatch( deleteComment( commentIndex )),
		updatePost: post => dispatch( updatePost( post ))
	});

export default connect( mapStateToProps, mapDispatchToProps )( Comments );
