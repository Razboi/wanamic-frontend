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
import extract from "mention-hashtag";
import InputTrigger from "react-input-trigger";

const
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
	StyledTextArea = {
		width: "100%",
		height: "100%",
		gridArea: "inp"
	},
	HeaderTxt = styled.span`
		margin-left: 15px;
		font-weight: bold;
		font-size: 16px;
	`,
	Suggestions = styled.div`
		grid-area: com;
		z-index: 2;
		background: #fff;
		padding: 10px;
		overflow-y: scroll;
		display: ${props => props.showSuggestions ? "block" : "none"};
	`,
	Suggestion = styled.div`
		display: flex;
		flex-direction: column;
		padding: 10px 0px;
		border-bottom: 1px solid #808080;
		background: ${props => props.selection === props.index ? "#808080" : "none"};
	`;

class Comments extends Component {
	constructor() {
		super();
		this.state = {
			comment: "",
			socialCircle: [],
			showSuggestions: false,
			suggestionsTop: undefined,
			suggestionsLeft: undefined,
			mentionInput: "",
			currentSelection: 0,
			startPosition: undefined
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
		this.setState({ [ e.target.name ]: e.target.value });
	}

	handleKeyPress = e => {
		if ( e.key === "Enter" ) {
			e.preventDefault();
			if ( this.state.showSuggestions ) {
				const
					{ socialCircle, comment, startPosition, currentSelection } = this.state,
					user = socialCircle[ currentSelection ],
					updatedComment =
						comment.slice( 0, startPosition - 1 )
						+ "@" + user.username + " " +
						comment.slice( startPosition + user.username.length, comment.length );

				this.setState({
					comment: updatedComment,
					startPosition: undefined,
					showSuggestions: false,
					suggestionsLeft: undefined,
					suggestionsTop: undefined,
					mentionInput: "",
					currentSelection: 0
				});

				this.endHandler();
			} else {
				this.handleComment();
			}
		}

		if ( this.state.showSuggestions ) {
			if ( e.keyCode === 40 &&
			this.state.currentSelection !== this.state.socialCircle.length - 1 ) {
				e.preventDefault();
				this.setState({
					currentSelection: this.state.currentSelection + 1
				});
			}

			if ( e.keyCode === 38 && this.state.currentSelection !== 0 ) {
				e.preventDefault();
				this.setState({
					currentSelection: this.state.currentSelection - 1
				});
			}
		}
	}

	handleComment = () => {
		var i;
		const mentions = extract( this.state.comment, { symbol: false });

		api.createComment( this.state.comment, this.props.postId, mentions )
			.then( res => {
				if ( res === "jwt expired" ) {
					refreshToken()
						.then(() => this.handleComment())
						.catch( err => console.log( err ));
				} else {
					this.setState({ comment: "" });
					res.data.commentNotification && this.props.socket.emit(
						"sendNotification", res.data.commentNotification
					);

					if ( res.data.mentionsNotifications ) {
						const notifLength = res.data.mentionsNotifications.length;
						for ( i = 0; i < notifLength; i++ ) {
							this.props.socket.emit(
								"sendNotification", res.data.mentionsNotifications[ i ]
							);
						}
					}

					this.props.addComment( res.data.newComment );
					this.props.updatePost( res.data.updatedPost );
				}
			}).catch( err => console.log( err ));
	}

	handleDelete = ( commentIndex, updatedPost ) => {
		this.props.deleteComment( commentIndex );
		this.props.updatePost( updatedPost );
	};

	handleReply = targetUser => {
		this.setState({ comment: "@" + targetUser + " " });
	}

	toggleSuggestions = metaData => {
		if ( metaData.hookType === "start" ) {
			this.setState({
				startPosition: metaData.cursor.selectionStart,
				showSuggestions: true,
				suggestionsLeft: metaData.cursor.left,
				suggestionsTop: metaData.cursor.top + metaData.cursor.height,
			});
		}

		if ( metaData.hookType === "cancel" ) {
			this.setState({
				startPosition: undefined,
				showSuggestions: false,
				suggestionsLeft: undefined,
				suggestionsTop: undefined,
				mentionInput: "",
				currentSelection: 0
			});
		}
	}

	handleMentionInput = metaData => {
		if ( this.state.showSuggestions ) {
			this.setState({ mentionInput: metaData.text });
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
							handleReply={() => this.handleReply( comment.author )}
						/>
					)}
				</CommentsWrapper>

				<InputTrigger
					trigger={{ keyCode: 50 }}
					onStart={metaData => this.toggleSuggestions( metaData ) }
					onCancel={metaData => this.toggleSuggestions( metaData ) }
					onType={metaData => this.handleMentionInput( metaData ) }
					endTrigger={endHandler => this.endHandler = endHandler }
				>
					<textarea
						style={StyledTextArea}
						name="comment"
						value={this.state.comment}
						placeholder="Comment..."
						onChange={this.handleChange}
						onKeyDown={this.handleKeyPress}
					/>
				</InputTrigger>
				<Suggestions showSuggestions={this.state.showSuggestions}>
					{this.state.socialCircle
						.filter( user =>
							user.fullname.toLowerCase().indexOf(
								this.state.mentionInput.toLowerCase()) !== -1
							||
							user.username.indexOf( this.state.mentionInput ) !== -1
						)
						.map(( user, index ) => (
							<Suggestion
								key={index}
								index={index}
								selection={this.state.currentSelection}>
								<b>{user.fullname}</b>
								<span>@{user.username}</span>
							</Suggestion>
						))}
				</Suggestions>
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
