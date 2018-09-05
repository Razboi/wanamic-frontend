import React, { Component } from "react";
import { Icon, Image, Header } from "semantic-ui-react";
import styled from "styled-components";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import api from "../services/api";
import Comments from "../containers/Comments";
import moment from "moment";
import DropdownOptions from "../components/DropdownOptions";
import PostDetailsMedia from "../components/PostDetailsMedia";
import { switchShare, updatePost, switchPostDetails
} from "../services/actions/posts";
import refreshToken from "../utils/refreshToken";

const
	Wrapper = styled.div`
		position: fixed;
		height: 100%;
    overflow-y: auto;
		width: 100%;
		top: 0px;
		display: grid;
		@media (max-width: 420px) {
			background: rgba(0,0,0,0.65);
			height: 100%;
		}
		@media (min-width: 420px) {
			padding: 5rem 0;
		}
		opacity: ${props => props.displayShare && "0"};
		transition: opacity 0.1s linear;
	`,
	TextPost = styled.div`
		position: relative;
		width: 90%;
		height: 85%;
		border-radius: 2px;
		margin: 3rem auto;
		background: #fff;
		display: grid;
		grid-template-rows: auto 1fr;
		grid-template-areas:
		"header"
		"comments";
		@media (max-width: 420px) {
			width: 100%;
			height: 100%;
			margin: 0;
		}
		@media (min-width: 620px) {
			width: 620px;
		}
	`,
	Main = styled.div`
		position: relative;
		max-width: 90%;
		width: ${props => props.video && "100%"};
		margin: auto;
		display: grid;
		grid-template-columns: auto minmax(285px, 350px);
		grid-template-rows: 68px max-content;
		grid-template-areas:
			"media header"
			"media comments";
		z-index: 10;
		background: #fff;
		@media (max-width: 760px) {
			grid-template-areas: "header" "media" "options" "sidebar";
			grid-template-columns: 100%;
			grid-template-rows: 68px auto auto auto;
			margin: 3rem auto;
		}
		@media (max-width: 420px) {
			max-width: none;
			width: 100%;
			margin: 0;
		}
	`,
	OutsideClickHandler = styled.div`
		width: 100%;
		height: 100%;
		position: fixed;
		@media (max-width: 420px) {
			display: none;
		}
	`,
	CloseIcon = styled( Icon )`
		color: #fff;
		position: fixed;
		top: 10px;
		right: 10px;
		font-size: 2rem !important;
		z-index: 2;
		:hover {
			cursor: pointer;
		}
		@media (min-width: 760px) {
			display: ${props => props.headericon && "none"} !important;
		}
		@media (max-width: 760px) {
			display: ${props => !props.headericon && "none"} !important;
			position: static;
			font-size: 1rem !important;
		}
	`,
	NullPostWarning = styled.div`
		z-index: 20;
		position: fixed;
		background: #fff;
		width: 100%;
		max-width: 500px;
		height: 100%;
		max-height: 500px;
		border-radius: 2px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1rem;
		font-weight: 600;
		i {
			color: #111;
			font-size: 1.6rem !important;
			position: absolute;
		}
	`,
	PostHeader = styled( Header )`
		grid-area: header;
		position: relative;
		background: #292929;
		min-height: 60px;
		display: flex;
		flex-direction: row;
		padding: 1rem !important;
		margin: 0 !important;
		align-items: center !important;
		font-family: inherit !important;
	`,
	CommentsWrapper = styled.div`
		position: relative;
		overflow: hidden;
	`,
	HeaderInfo = styled.div`
		display: flex;
		flex-direction: column;
		margin: 0 2rem 0 0.5rem;
		:hover {
			cursor: pointer;
		}
	`,
	AuthorImg = styled( Image )`
		overflow: visible !important;
		width: 40px !important;
		height: 40px !important;
		margin: 0 !important;
		:hover {
			cursor: pointer;
		}
	`,
	AuthorFullname = styled.span`
		font-size: 1.05rem !important;
		color: #fff !important;
		word-break: break-word !important;
		:hover {
			cursor: pointer;
		}
	`,
	AuthorUsername = styled.span`
		font-size: 1rem;
		color: rgba(255,255,255,0.65);
		font-weight: normal;
		margin-left: 0.25rem;
		word-break: break-word !important;
	`,
	DateTime = styled( Header.Subheader )`
		font-size: 1rem !important;
		color: rgba(255,255,255,0.85) !important;
		font-weight: 200 !important;
	`,
	HeaderOptions = styled.div`
		margin-left: auto;
		i {
			color: #555 !important;
			font-size: 1.4rem !important;
		}
	`,
	Options = styled.div`
		position: absolute;
		display: flex;
		bottom: -30px;
    right: 0px;
		@media (max-width: 760px) {
			position: static;
			grid-area: options;
			padding: 1rem 10px;
			align-items: center;
		}
	`,
	TextPostOptions = styled.div`
		position: absolute;
		display: flex;
		bottom: -30px;
    right: 0px;
		div {
			color: #fff !important;
		}
		@media (max-width: 760px) {
			bottom: 1rem;
		}
	`,
	Option = styled.div`
		:hover {
			cursor: pointer;
		}
		color: #fff;
		@media (max-width: 760px) {
			color: #111;
		}
		margin: 0 10px;
	`;

class PostDetails extends Component {
	constructor() {
		super();
		this.state = {
			post: undefined,
			nullPost: false,
			hiddeCommentInput: true
		};
		this.previousHref = undefined;
		this.userPicture = undefined;
	}

	componentDidMount() {
		document.body.style.overflowY = "hidden";
		this.previousHref = window.location.href;
		window.history.pushState( null, null, "/post" );
		window.onpopstate = e => this.handlePopstate( e );
		this.setState({ post: this.props.postDetails });
	}

	componentDidUpdate( prevProps ) {
		if ( prevProps.post !== this.props.post ) {
			this.setState({ post: this.props.post });
		}
	}

	componentWillUnmount() {
		document.body.style.overflowY = "auto";
		window.onpopstate = () => {};
	}

	handlePopstate = e => {
		e.preventDefault();
		if ( this.props.displayShare ) {
			this.props.switchShare();
			window.history.pushState( null, null, "/post" );
		} else {
			this.props.switchPostDetails();
		}
	}

	getPost = async() => {
		var post;
		try {
			post = await api.getPost( this.props.postId );
			if ( !post.data ) {
				this.setState({ nullPost: true });
			} else {
				this.setState({ post: post.data });
			}
		} catch ( err ) {
			console.log( err );
			this.setState({ nullPost: true });
		}
	}

	handleBack = () => {
		if ( this.props.displayShare ) {
			this.props.switchShare();
		} else {
			this.props.switchPostDetails();
			window.history.pushState( null, null, this.previousHref );
		}
	}

	handleShare = () => {
		this.props.switchShare( this.state.post );
	}

	goToProfile = async() => {
		if ( this.props.history ) {
			await this.handleBack();
			this.props.history.push( "/" + this.state.post.author.username );
		}
	}

	handleLike = retry => {
		if ( !retry ) {
			let updatedPost = this.state.post;
			updatedPost.likedBy = [
				localStorage.getItem( "username" ), ...updatedPost.likedBy ];
			this.setState({ post: updatedPost });
			this.props.updatePost( updatedPost );
		}

		api.likePost( this.state.post._id )
			.then( res => {
				if ( res === "jwt expired" ) {
					refreshToken()
						.then(() => this.handleLike( true ))
						.catch( err => console.log( err ));
				} else {
					this.props.socket.emit( "sendNotification", res.data );
				}
			}).catch( err => 	console.log( err ));
	}

	handleDislike = retry => {
		const { post } = this.state;
		if ( !retry ) {
			let updatedPost = post;
			const index = post.likedBy.indexOf( localStorage.getItem( "username" ));
			updatedPost.likedBy.splice( index, 1 );
			this.setState({ post: updatedPost });
			this.props.updatePost( updatedPost );
		}

		api.dislikePost( this.state.post._id )
			.then( res => {
				if ( res === "jwt expired" ) {
					refreshToken()
						.then(() => this.handleDislike( true ))
						.catch( err => console.log( err ));
				}
			}).catch( err => console.log( err ));
	}

	toggleCommentInput = () => {
		this.setState( state => ({ hiddeCommentInput: !state.hiddeCommentInput }));
	}

	render() {
		const
			s3Bucket = "https://d3dlhr4nnvikjb.cloudfront.net/",
			{ post } = this.state;
		if ( this.state.nullPost ) {
			return (
				<React.Fragment>
					<CloseIcon name="close" onClick={this.handleBack} />
					<OutsideClickHandler onClick={this.handleBack} />
					<NullPostWarning>
						<span>This post has been removed</span>
						<CloseIcon
							headericon="true"
							name="close"
							onClick={this.handleBack}
						/>
					</NullPostWarning>
				</React.Fragment>
			);
		}
		// empty obj
		if ( !post && !this.state.nullPost ) {
			return null;
		}

		try {
			if ( post.author && post.author.profileImage ) {
				process.env.REACT_APP_STAGE === "dev" ?
					this.userPicture = require( "../images/" + post.author.profileImage )
					:
					this.userPicture = s3Bucket + post.author.profileImage;
			} else {
				this.userPicture = require( "../images/defaultUser.png" );
			}
		} catch ( err ) {
			console.log( err );
		}
		if ( post.media ) {
			return (
				<Wrapper displayShare={this.props.displayShare}>
					<CloseIcon name="close" onClick={this.handleBack} />
					<OutsideClickHandler onClick={this.handleBack} />
					<Main video={post.link && post.linkContent.embeddedUrl}>
						<PostDetailsMedia post={post} />
						<PostHeader>
							<AuthorImg
								circular
								src={this.userPicture}
								onClick={this.goToProfile}
							/>
							<HeaderInfo onClick={this.goToProfile}>
								<AuthorFullname className="postAuthor">
									{post.author.fullname}
									<AuthorUsername>
										@{post.author.username}
									</AuthorUsername>
								</AuthorFullname>
								<DateTime className="postDate">
									{moment( post.createdAt ).fromNow()}
								</DateTime>
							</HeaderInfo>

							<HeaderOptions>
								{ !this.props.fakeOptions &&
								<DropdownOptions
									postOrComment={post}
									socket={this.props.socket}
								/>
								}
								<CloseIcon headericon="true" name="close" onClick={this.handleBack} />
							</HeaderOptions>
						</PostHeader>

						<CommentsWrapper>
							<Comments
								onExplore={this.props.onExplore}
								socket={this.props.socket}
								hiddeCommentInput={this.state.hiddeCommentInput}
								toggleCommentInput={this.toggleCommentInput}
							/>
						</CommentsWrapper>
						<Options>
							{post.likedBy.includes( localStorage.getItem( "username" )) ?
								<Option onClick={() => this.handleDislike()} >
									<Icon
										name="heart"
										color="red"
										size="large"
									/>
									<b>{post.likedBy.length}</b>
								</Option>
								:
								<Option onClick={() => this.handleLike()} >
									<Icon
										name="empty heart"
										size="large"
									/>
									<b>{post.likedBy.length}</b>
								</Option>
							}
							<Option
								onClick={this.toggleCommentInput}
								id="smallDetailsCommentOption"
							>
								<Icon
									name="comment outline"
									size="large"
								/>
								<b>{post.comments.length}</b>
							</Option>
							<Option onClick={this.handleShare} >
								<Icon
									name="share"
									size="large"
								/>
								<b>{post.sharedBy.length}</b>
							</Option>
						</Options>
					</Main>
				</Wrapper>
			);
		}
		return (
			<Wrapper displayShare={this.props.displayShare}>
				<CloseIcon name="close" onClick={this.handleBack} />
				<OutsideClickHandler onClick={this.handleBack} />
				<TextPost>
					<PostHeader>
						<AuthorImg
							circular
							src={this.userPicture}
							onClick={this.goToProfile}
						/>
						<HeaderInfo onClick={this.goToProfile}>
							<AuthorFullname className="postAuthor">
								{post.author.fullname}
								<AuthorUsername>
									@{post.author.username}
								</AuthorUsername>
							</AuthorFullname>
							<DateTime className="postDate">
								{moment( post.createdAt ).fromNow()}
							</DateTime>
						</HeaderInfo>

						<HeaderOptions>
							{ !this.props.fakeOptions &&
								<DropdownOptions
									postOrComment={post}
									socket={this.props.socket}
								/>
							}
							<CloseIcon headericon="true" name="close" onClick={this.handleBack} />
						</HeaderOptions>
					</PostHeader>

					<CommentsWrapper>
						<Comments
							onExplore={this.props.onExplore}
							socket={this.props.socket}
							TextPost
						/>
					</CommentsWrapper>
					<TextPostOptions>
						{post.likedBy.includes( localStorage.getItem( "username" )) ?
							<Option className="dislikeOption"
								onClick={() => this.handleDislike()}
							>
								<Icon
									name="heart"
									color="red"
									size="large"
								/>
								<b>{post.likedBy.length}</b>
							</Option>
							:
							<Option className="likeOption"
								onClick={() => this.handleLike()}
							>
								<Icon
									name="empty heart"
									size="large"
								/>
								<b>{post.likedBy.length}</b>
							</Option>
						}
						<Option className="shareOption"
							onClick={() => this.props.switchShare( post )}
						>
							<Icon
								name="share"
								size="large"
							/>
							<b>{post.sharedBy.length}</b>
						</Option>
					</TextPostOptions>
				</TextPost>
			</Wrapper>
		);
	}
}

PostDetails.propTypes = {
	socket: PropTypes.object.isRequired,
	history: PropTypes.object.isRequired
};

const
	mapStateToProps = state => ({
		displayComments: state.posts.displayComments,
		displayShare: state.posts.displayShare,
		postDetails: state.posts.postDetails
	}),

	mapDispatchToProps = dispatch => ({
		switchShare: post => dispatch( switchShare( post )),
		switchPostDetails: post => dispatch( switchPostDetails( post )),
		updatePost: post => dispatch( updatePost( post )),
	});

export default connect( mapStateToProps, mapDispatchToProps )( PostDetails );
