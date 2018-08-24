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
import { switchShare } from "../services/actions/posts";
import refreshToken from "../utils/refreshToken";

const
	Wrapper = styled.div`
		width: 100%;
		max-width: 950px;
		position: absolute;
		z-index: 20;
		background: #fff;
		@media (max-width: 760px) {
			background: #fff;
			height: 100%;
		}
	`,
	Main = styled.div`
		display: grid;
		grid-template-columns: 70% 30%;
		grid-template-areas: "media sidebar";
		width: 100%;
	`,
	PostSidebar = styled.div`
		grid-area: sidebar;
		background: #fff;
		display: grid;
		grid-template-rows: auto 1fr;
		grid-template-areas:
		"header"
		"comments";
	`,
	StyledIcon = styled( Icon )`
		color: #fff;
		position: fixed;
		top: 20px;
		right: 20px;
		font-size: 2rem !important;
		:hover {
			cursor: pointer;
		}
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
	PostHeader = styled( Header )`
		grid-area: header;
		background: rgba(0,0,0,0.85);
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
		width: 30px !important;
		height: 30px !important;
		margin: 0 !important;
		@media (min-width: 420px) {
			width: 40px !important;
			height: 40px !important;
		}
		:hover {
			cursor: pointer;
		}
	`,
	StyledOptions = {
		position: "absolute",
		right: "1rem",
		top: "1rem",
	},
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
		color: rgba(255,255,255,0.45) !important;
	`,
	Options = styled.div`
		position: absolute;
		display: flex;
		bottom: -30px;
    right: 0px;
	`,
	Option = styled.div`
		:hover {
			cursor: pointer;
		}
		color: #fff;
		margin: 0 5px;
	`;

class PostDetails extends Component {
	constructor() {
		super();
		this.state = {
			post: {},
			displayComments: false
		};
		this.previousHref = undefined;
		this.userPicture = undefined;
	}

	componentDidMount() {
		document.body.style.overflowY = "hidden";
		this.previousHref = window.location.href;
		window.history.pushState( null, null, "/post" );
		window.onpopstate = e => this.handlePopstate( e );
		if ( !this.props.post ) {
			this.getPost();
		} else {
			this.setState({ post: this.props.post });
		}
	}

	componentDidUpdate( prevProps ) {
		if ( prevProps.post !== this.props.post ) {
			this.setState({ post: this.props.post });
		}
	}

	componentWillUnmount() {
		document.body.style.overflowY = "auto";
		window.history.pushState( null, null, this.previousHref );
		window.onpopstate = () => {};
	}

	handlePopstate = e => {
		e.preventDefault();
		this.props.switchDetails();
	}

	getPost = async() => {
		var post;
		try {
			post = await api.getPost( this.props.postDetails._id );
		} catch ( err ) {
			console.log( err );
		}
		this.setState({ post: post.data });
	}

	handleBack = () => {
		this.props.switchDetails();
	}

	goToProfile = async user => {
		if ( this.props.history ) {
			await this.handleBack();
			this.props.history.push( "/" + user.username );
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

	render() {
		const
			s3Bucket = "https://d3dlhr4nnvikjb.cloudfront.net/",
			{ post } = this.state;
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
		// empty obj
		if ( Object.keys( post ).length === 0 && post.constructor === Object ) {
			return null;
		}
		if ( !post ) {
			return (
				<NullPostWarning>
					<span>This post doesn't exist</span>
				</NullPostWarning>
			);
		}
		return (
			<Wrapper>
				<StyledIcon name="close" onClick={this.handleBack} />
				<Main>
					<PostDetailsMedia post={post} />
					<PostSidebar>
						<PostHeader>
							<AuthorImg
								circular
								src={this.userPicture}
								onClick={this.props.goToProfile}
							/>
							<HeaderInfo onClick={this.props.goToProfile}>
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

							{ !this.props.fakeOptions &&
								<DropdownOptions
									style={StyledOptions}
									post={post}
									socket={this.props.socket}
								/>
							}
						</PostHeader>

						<CommentsWrapper>
							<Comments
								onExplore={this.props.onExplore}
								socket={this.props.socket}
							/>
						</CommentsWrapper>
					</PostSidebar>
					<Options>
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
					</Options>
				</Main>
			</Wrapper>
		);
	}
}

PostDetails.propTypes = {
	post: PropTypes.object,
	socket: PropTypes.object.isRequired,
	history: PropTypes.object.isRequired,
	index: PropTypes.number
};

const
	mapStateToProps = state => ({
		displayComments: state.posts.displayComments,
		displayShare: state.posts.displayShare,
		displayPostDetails: state.posts.displayPostDetails,
		postDetails: state.posts.postDetails
	}),

	mapDispatchToProps = dispatch => ({
		switchShare: post => dispatch( switchShare( post ))
	});

export default connect( mapStateToProps, mapDispatchToProps )( PostDetails );
