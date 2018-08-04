import React, { Component } from "react";
import styled from "styled-components";
import { Icon, Message } from "semantic-ui-react";
import api from "../services/api";
import Comment from "./Comment";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
	switchComments, setComments, addComment, deleteComment, updatePost,
	addToComments, updateComment
} from "../services/actions/posts";
import refreshToken from "../utils/refreshToken";
import extract from "mention-hashtag";
import InputTrigger from "react-input-trigger";
import Suggestions from "../components/Suggestions";
import InfiniteScroll from "react-infinite-scroller";

const
	Wrapper = styled.div`
		z-index: 20;
		position: absolute;
		overflow-y: scroll;
		background: #fff;
		display: grid;
		height: 100vh;
		width: 100%;
		grid-template-rows: 10% 80% 10%;
		grid-template-columns: 100%;
		grid-template-areas:
			"hea"
			"com"
			"inp";
		@media (min-width: 760px) and (min-height: 600px) {
			width: 600px;
			height: 600px;
			border-radius: 2px;
			grid-template-rows: 10% 76% 14%;
		}
		@media (max-height: 500px) {
			grid-template-rows: 14% 70% 16%;
		}
		::-webkit-scrollbar {
			display: none !important;
		};
	`,
	StyledInfiniteScroll = styled( InfiniteScroll )`
		height: 100%;
		width: 100%;
	`,
	HeaderWrapper = styled.div`
		grid-area: hea;
		display: flex;
		align-items: center;
		padding-left: 10px;
		box-shadow: 0 1px 2px #555;
		z-index: 4;
	`,
	CommentsWrapper = styled.div`
		grid-area: com;
		z-index: 3;
		overflow-y: scroll;
		@media (max-width: 420px) {
			::-webkit-scrollbar {
				display: none !important;
			}
		}
	`,
	InputTriggerStyles = {
		width: "100%",
		height: "100%",
		gridArea: "inp",
	},
	StyledTextArea = {
		width: "100%",
		fontFamily: "inherit",
		resize: "none",
		padding: "0.5rem"
	},
	HeaderTxt = styled.span`
		margin-left: 15px;
		font-weight: bold;
		font-size: 16px;
	`,
	SuggestionsWrapper = styled.div`
		grid-area: com;
		z-index: 3;
		visibility: ${props => props.showSuggestions ? "visible" : "hidden"};
	`,
	SpamWarning = styled( Message )`
		position: fixed !important;
		left: 5px;
		right: 5px;
		z-index: 2;
		word-break: break-word;
	`;


var interval;
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
			startPosition: undefined,
			skip: 1,
			hasMore: true,
			sentComments: 0,
			spam: false
		};
	}

	componentDidMount() {
		interval = setInterval( this.resetCommentsLimit, 30000 );
		this.getInitialComments();
		this.getSocialCircle();
	}

	componentWillUnmount() {
		clearInterval( interval );
	}

	resetCommentsLimit = () => {
		this.setState({ sentComments: 0 });
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

	getComments = async() => {
		if ( this.state.hasMore ) {
			try {
				const res = await api.getPostComments(
					this.props.postId, this.state.skip );
				if ( res === "jwt expired" ) {
					await refreshToken();
					this.getComments();
				} else if ( res.data ) {
					this.props.addToComments( res.data );
					this.setState({
						hasMore: res.data.length > 10,
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
			api.createComment( comment, this.props.postId, mentions )
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

	handleDelete = ( commentIndex, updatedPost ) => {
		this.props.deleteComment( commentIndex );
		this.props.updatePost(
			updatedPost,
			this.props.onExplore
		);
	};

	handleUpdate = comment => {
		this.props.updateComment( comment );
	}

	handleReply = target => {
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
		const placeholder = "Comment as @" + localStorage.getItem( "username" );
		return (
			<Wrapper>
				<HeaderWrapper>
					<Icon name="arrow left" onClick={() => this.props.switchComments()} />
					<HeaderTxt>Comments</HeaderTxt>
				</HeaderWrapper>

				<CommentsWrapper className="commentsWrapper">
					<StyledInfiniteScroll
						pageStart={this.state.skip}
						hasMore={this.state.hasMore}
						loadMore={this.getComments}
						initialLoad={false}
						useWindow={false}
					>
						{this.state.spam &&
							<SpamWarning warning>
								<Message.Header>
										You are sending comments too fast.
								</Message.Header>
								<p>To prevent spam you must wait a few seconds.</p>
							</SpamWarning>
						}

						{this.props.comments.map(( comment, index ) =>
							<Comment
								key={index}
								index={index}
								comment={comment}
								handleUpdate={this.handleUpdate}
								handleDelete={this.handleDelete}
								handleReply={() => this.handleReply( comment.author )}
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
				>
					<textarea
						autoFocus
						maxLength="2200"
						className="commentsTextarea"
						style={StyledTextArea}
						name="comment"
						value={this.state.comment}
						placeholder={placeholder}
						onChange={this.handleChange}
						onKeyDown={this.handleKeyPress}
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
	switchComments: PropTypes.func.isRequired,
	setComments: PropTypes.func.isRequired,
	postId: PropTypes.string.isRequired,
	newsfeed: PropTypes.array.isRequired,
	comments: PropTypes.array,
	onExplore: PropTypes.bool
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
		addToComments: comments => dispatch( addToComments( comments )),
		addComment: comment => dispatch( addComment( comment )),
		deleteComment: commentIndex => dispatch( deleteComment( commentIndex )),
		updateComment: comment => dispatch( updateComment( comment )),
		updatePost: ( post, onExplore ) =>
			dispatch( updatePost( post, onExplore ))
	});

export default connect( mapStateToProps, mapDispatchToProps )( Comments );
