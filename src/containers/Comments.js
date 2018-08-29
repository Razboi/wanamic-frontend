import React, { Component } from "react";
import styled from "styled-components";
import { Message } from "semantic-ui-react";
import api from "../services/api";
import Comment from "./Comment";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
	setComments, addComment, updatePost,
	addToComments, updateComment
} from "../services/actions/posts";
import refreshToken from "../utils/refreshToken";
import extract from "../utils/extractMentionsHashtags";
import InputTrigger from "../utils/inputTrigger";
import Suggestions from "../components/Suggestions";
import InfiniteScroll from "react-infinite-scroller";

const
	Wrapper = styled.div`
		grid-area: comments;
		background: #fff;
		display: grid;
    height: 100%;
		width: 100%;
		grid-template-rows: 1fr auto;
		grid-template-columns: 100%;
		position: ${props => props.TextPost && "absolute"};
		grid-template-areas:
			"comments"
			"input";
		@media (min-width: 760px) {
			position: absolute;
		}
	`,
	StyledInfiniteScroll = styled( InfiniteScroll )`
		width: 100%;
		padding: ${props => props.textpost && "0 3rem"};
	`,
	CommentsWrapper = styled.div`
		grid-area: comments;
		display: flex;
		flex-direction: column;
		z-index: 3;
		overflow-y: auto;
		::-webkit-scrollbar {
			display: block !important;
			width: 6px !important;
		}
		@media (max-width: 760px) {
			max-height: ${props => !props.TextPost && "300px"};
		}
	`,
	InputTriggerStyles = {
		gridArea: "input",
		height: "55px"
	},
	StyledTextArea = {
		width: "100%",
		height: "100%",
		fontFamily: "inherit",
		resize: "none",
		padding: "0.5rem"
	},
	SuggestionsWrapper = styled.div`
		grid-area: comments;
		z-index: 3;
		visibility: ${props => props.showSuggestions ? "visible" : "hidden"};
		background: #fff;
	`,
	SpamWarning = styled( Message )`
		position: fixed !important;
		top: 0;
    left: 0;
    width: 100%;
    text-align: center;
		z-index: 2;
		word-break: break-word;
	`,
	NullPostWarning = styled.div`
		z-index: 20;
		position: absolute;
		background: #fff;
		width: 300px;
		height: 200px;
		border-radius: 2px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1rem;
		font-weight: 600;
	`,
	Description = styled.div`
		width: 100%;
		font-size: ${props => props.TextPost && "1.5rem"};
	`,
	Content = styled.p`
		padding: ${props => props.TextPost ? "2rem 1rem" : "1.5rem 1rem"};
	`,
	DescriptionAuthor = styled.span`
		font-weight: bold;
		font-size: ${props => props.TextPost && "1.3rem"};
		word-break: break-all;
		padding-right: 7px;
	`;


class Comments extends Component {
	constructor( props ) {
		super( props );
		this.state = {
			comment: "",
			socialCircle: [],
			showSuggestions: false,
			suggestionsTop: undefined,
			suggestionsLeft: undefined,
			mentionInput: "",
			currentSelection: 0,
			startPosition: undefined,
			skip: 1,
			hasMore: true,
			sentComments: 0,
			spam: false
		};
		this.interval = setInterval( this.resetCommentsLimit, 30000 );
		this.commentInput = React.createRef();
	}

	componentDidMount() {
		this.getInitialComments();
		this.getSocialCircle();
	}

	componentWillUnmount() {
		clearInterval( this.interval );
	}

	componentDidUpdate( prevProps ) {
		if ( prevProps.hiddeCommentInput && !this.props.hiddeCommentInput ) {
			this.commentInput.focus();
		}
	}

	resetCommentsLimit = () => {
		this.setState({ sentComments: 0 });
	}

	getInitialComments = () => {
		api.getPostComments( this.props.postDetails._id, 0 )
			.then( res => {
				if ( res === "jwt expired" ) {
					refreshToken()
						.then(() => this.getInitialComments())
						.catch( err => console.log( err ));
				} else {
					this.props.setComments( res.data );
					this.setState({
						hasMore: res.data.length === 10
					});
				}
			}).catch( err => console.log( err ));
	}

	getComments = async() => {
		if ( this.state.hasMore ) {
			try {
				const res = await api.getPostComments(
					this.props.postDetails._id, this.state.skip );
				if ( res === "jwt expired" ) {
					await refreshToken();
					this.getComments();
				} else if ( res.data ) {
					this.props.addToComments( res.data );
					this.setState({
						hasMore: res.data.length === 10,
						skip: this.state.skip + 1
					});
				}
			} catch ( err ) {
				console.log( err );
			}
		}
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
			const
				{ socialCircle, comment, startPosition, currentSelection } = this.state,
				user = socialCircle[ currentSelection ];
			if ( this.state.showSuggestions ) {
				const updatedComment =
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
		const { sentComments, comment } = this.state;

		if ( sentComments >= 5 ) {
			this.handleSpam();
		} else {
			const mentions = extract( comment, { symbol: false });
			api.createComment( comment, this.props.postDetails._id, mentions )
				.then( res => {
					if ( res === "jwt expired" ) {
						refreshToken()
							.then(() => this.handleComment())
							.catch( err => console.log( err ));
					} else {
						this.setState({ comment: "", sentComments: sentComments + 1 });
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
						this.props.updatePost( res.data.updatedPost,
							this.props.onExplore );
					}
				}).catch( err => console.log( err ));
		}
	}

	handleSpam = () => {
		this.setState({ spam: true });
		setTimeout(() => {
			this.setState({ spam: false });
		}, 10000 );
	}

	handleReply = target => {
		if ( this.props.hiddeCommentInput ) {
			this.props.toggleCommentInput();
		}
		this.setState({ comment: "@" + target.username + " " });
	}

	toggleSuggestions = metaData => {
		if ( metaData.hookType === "start" &&
			( this.state.comment.length + 31 ) <= 2200 ) {
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

	selectFromMentions = user => {
		const
			{ comment, startPosition } = this.state,
			updatedUserInput =
				comment.slice( 0, startPosition - 1 )
				+ "@" + user.username + " " +
				comment.slice( startPosition + user.username.length, comment.length );

		this.setState({
			comment: updatedUserInput,
			startPosition: undefined,
			showSuggestions: false,
			suggestionsLeft: undefined,
			suggestionsTop: undefined,
			mentionInput: "",
			currentSelection: 0
		});

		this.endHandler();
	}

	handleMentionInput = metaData => {
		if ( this.state.showSuggestions ) {
			this.setState({ mentionInput: metaData.text });
		}
	}

	render() {
		const
			{ comments, postDetails } = this.props,
			placeholder = "Comment as @" + localStorage.getItem( "username" );

		if ( !comments ) {
			return (
				<NullPostWarning>
					<span>This post doesn't exist</span>
				</NullPostWarning>
			);
		}
		return (
			<Wrapper TextPost={this.props.TextPost}>
				<CommentsWrapper TextPost={this.props.TextPost}>
					{postDetails.content &&
						<Description TextPost={this.props.TextPost}>
							<Content TextPost={this.props.TextPost}>
								<DescriptionAuthor TextPost={this.props.TextPost}>
									@{postDetails.author.username}
								</DescriptionAuthor>
								{postDetails.content}
							</Content>
						</Description>
					}
					<StyledInfiniteScroll
						pageStart={this.state.skip}
						hasMore={this.state.hasMore}
						loadMore={this.getComments}
						initialLoad={false}
						useWindow={false}
						textpost={this.props.TextPost ? 1 : 0}
					>
						{this.state.spam &&
							<SpamWarning warning>
								<Message.Header>
										You are sending comments too fast.
								</Message.Header>
								<p>To prevent spam you must wait a few seconds.</p>
							</SpamWarning>
						}

						{comments.map(( comment, index ) =>
							<Comment
								key={index}
								index={index}
								comment={comment}
								handleUpdate={this.handleUpdate}
								handleReply={() => this.handleReply( comment.author )}
								socket={this.props.socket}
							/>
						)}
					</StyledInfiniteScroll>
				</CommentsWrapper>

				<InputTrigger
					style={InputTriggerStyles}
					trigger={{ key: "@" }}
					onStart={metaData => this.toggleSuggestions( metaData ) }
					onCancel={metaData => this.toggleSuggestions( metaData ) }
					onType={metaData => this.handleMentionInput( metaData ) }
					endTrigger={endHandler => this.endHandler = endHandler }
					className={this.props.hiddeCommentInput ?
						"hiddenCommentInput" : undefined}
				>
					<textarea
						maxLength="2200"
						id={this.props.TextPost && "textPostCommentInput"}
						className="commentsTextarea"
						style={StyledTextArea}
						name="comment"
						value={this.state.comment}
						placeholder={placeholder}
						onChange={this.handleChange}
						onKeyDown={this.handleKeyPress}
						ref={input => this.commentInput = input}
					/>
				</InputTrigger>
				<SuggestionsWrapper showSuggestions={this.state.showSuggestions}>
					<Suggestions
						socialCircle={this.state.socialCircle}
						showSuggestions={this.state.showSuggestions}
						mentionInput={this.state.mentionInput}
						selectFromMentions={this.selectFromMentions}
						media={"true"}
					/>
				</SuggestionsWrapper>
			</Wrapper>
		);
	}
}

Comments.propTypes = {
	socket: PropTypes.object.isRequired,
	setComments: PropTypes.func.isRequired,
	newsfeed: PropTypes.array.isRequired,
	comments: PropTypes.array,
	onExplore: PropTypes.bool,
	TextPost: PropTypes.bool,
	forwardRef: PropTypes.object,
	hiddeCommentInput: PropTypes.bool
};

const
	mapStateToProps = state => ({
		postDetails: state.posts.postDetails,
		newsfeed: state.posts.newsfeed,
		comments: state.posts.comments,
		displayPostDetails: state.posts.displayPostDetails
	}),

	mapDispatchToProps = dispatch => ({
		setComments: comments => dispatch( setComments( comments )),
		addToComments: comments => dispatch( addToComments( comments )),
		addComment: comment => dispatch( addComment( comment )),
		updateComment: comment => dispatch( updateComment( comment )),
		updatePost: ( post, onExplore ) =>
			dispatch( updatePost( post, onExplore ))
	});

export default connect( mapStateToProps, mapDispatchToProps )( Comments );
