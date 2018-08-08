import React, { Component } from "react";
import styled from "styled-components";
import { Header, Image } from "semantic-ui-react";
import api from "../services/api";
import moment from "moment";
import PostOptions from "./PostOptions";
import SharedPost from "../containers/SharedPost";
import DropdownOptions from "../components/DropdownOptions";
import PropTypes from "prop-types";
import { deletePost, updatePost } from "../services/actions/posts";
import { connect } from "react-redux";
import refreshToken from "../utils/refreshToken";
import AlertsFilter from "../components/AlertsFilter";
import extract from "../utils/extractMentionsHashtags";

const
	Wrapper = styled.div`
		overflow: hidden;
		position: relative;
		@media (min-width: 420px) {
			border: 1px solid rgba(0, 0, 0, .1);
			margin-bottom: 1rem;
			background: #fff;
		}
		@media (max-width: 420px) {
			border-bottom: ${props => props.noBorder ?
		"0" : "1px solid rgba(0, 0, 0, .1)"};
		}
	`,
	PostHeader = styled( Header )`
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
			width: 35px !important;
			height: 35px !important;
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
		color: #111 !important;
		word-break: break-word !important;
		:hover {
			cursor: pointer;
		}
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
	ContentWrapper = styled.div`
		display: flex;
		flex-direction: column;
		padding: 1.33rem 1rem;
		min-height: 25px;
		font-family: inherit !important;
	`,
	UserContent = styled.p`
		color: #222;
		word-break: break-word;
		font-size: 1rem;
	`,
	PostBody = styled.div`
		position: relative;
		overflow: hidden;
		min-height: ${props => props.alerts && "215px"};
	`,
	Dimmer = styled.div`
		background: ${props => props.blurFilter && "rgba( 0, 0, 0, 0.8 )"};
		min-height: ${props => props.blurFilter && "215px"};
		filter: ${props => props.blurFilter ?
		"blur(25px)" : "blur(0px)"};
		transform: scale(${props => props.blurFilter ? "1.3" : "1"});
	`;

var userPicture;

class Post extends Component {
	constructor() {
		super();
		this.state = {
			likedBy: [],
			nsfw: false,
			spoiler: false,
			spoilerDescription: "",
			id: ""
		};
	}

	static getDerivedStateFromProps( props, state ) {
		const { post } = props;
		if ( post._id === state.id ) {
			return null;
		}
		return {
			likedBy: post.likedBy,
			nsfw: post.alerts.nsfw,
			spoiler: post.alerts.spoiler,
			spoilerDescription: post.alerts.spoilerDescription,
			updatedContent: post.content,
			id: post._id
		};
	}

	handleChange = e => {
		this.setState({ [ e.target.name ]: e.target.value });
	}

	handleDelete = async() => {
		try {
			const res = await api.deletePost( this.props.post._id );
			if ( res === "jwt expired" ) {
				await refreshToken();
				this.handleDelete();
			} else if ( res.data ) {
				if ( res.data.updatedOriginalPost ) {
					this.props.updatePost( res.data.updatedOriginalPost );
				}
				this.props.deletePost( this.props.post._id );
			}
		} catch ( err ) {
			console.log( err );
		}
	};

	handleUpdate = async updatedContent => {
		if (( !updatedContent && !this.props.post.content )
			|| this.props.post.content === updatedContent ) {
			return;
		}
		try {
			const
				{ mentions, hashtags } = await extract(
					updatedContent, { symbol: false, type: "all" }),
				res = await api.updatePost(
					this.props.post._id, updatedContent, mentions, hashtags );
			if ( res === "jwt expired" ) {
				await refreshToken();
				this.handleUpdate();
			} else {
				this.props.updatePost( res.data.updatedPost );
				for ( const notification of res.data.mentionsNotifications ) {
					this.props.socket.emit( "sendNotification", notification );
				}
			}
		} catch ( err ) {
			console.log( err );
		}
	};

	handleLike = retry => {
		if ( !retry ) {
			this.setState({
				likedBy: [
					...this.state.likedBy,
					localStorage.getItem( "username" )
				]
			});
		}

		api.likePost( this.props.post._id )
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
		var	newLikedBy;
		if ( !retry ) {
			newLikedBy = this.state.likedBy;
			const index = this.state.likedBy.indexOf( localStorage.getItem( "username" ));
			newLikedBy.splice( index, 1 );
			this.setState({ likedBy: newLikedBy });
		}

		api.dislikePost( this.props.post._id )
			.then( res => {
				if ( res === "jwt expired" ) {
					refreshToken()
						.then(() => this.handleDislike( true ))
						.catch( err => console.log( err ));
				}
			}).catch( err => console.log( err ));
	}

	handleFilter = type => {
		this.setState({ [ type ]: false });
	}

	render() {
		const { post } = this.props;
		try {
			if ( post.author.profileImage ) {
				userPicture = require( "../images/" + post.author.profileImage );
			} else {
				userPicture = require( "../images/defaultUser.png" );
			}
		} catch ( err ) {
			console.log( err );
		}
		return (
			<Wrapper
				noBorder={this.props.fakeOptions || this.props.details
					? 1 : 0}
			>
				<PostHeader>
					<AuthorImg
						circular
						src={userPicture}
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
							author={post.author}
							currentContent={post.content}
							handleUpdate={this.handleUpdate}
							handleDelete={this.handleDelete}
						/>
					}
				</PostHeader>

				<PostBody alerts={this.state.nsfw || this.state.spoiler}>
					<AlertsFilter
						handleFilter={this.handleFilter}
						nsfw={this.state.nsfw}
						spoiler={this.state.spoiler}
						spoilerDescription={this.state.spoilerDescription}
					/>
					<Dimmer blurFilter={this.state.nsfw || this.state.spoiler}>
						<ContentWrapper>
							<UserContent className="postContent">
								{post.content}
							</UserContent>
							{post.sharedPost &&
								<SharedPost postId={post.sharedPost} />}
						</ContentWrapper>

						{ !this.props.fakeOptions &&
							<PostOptions
								post={this.props.post}
								fakeOptions={this.props.fakeOptions}
								handleLike={this.handleLike}
								handleDislike={this.handleDislike}
								numLiked={this.state.likedBy.length}
								numComments={post.comments.length}
								numShared={post.sharedBy.length}
								id={post._id}
								liked={
									this.state.likedBy.includes( localStorage.getItem( "username" ))
								}
							/>
						}
					</Dimmer>
				</PostBody>
			</Wrapper>
		);
	}
}

Post.propTypes = {
	index: PropTypes.number,
	post: PropTypes.object.isRequired,
	socket: PropTypes.object,
	goToProfile: PropTypes.func
};

const
	mapStateToProps = state => ({
	}),

	mapDispatchToProps = dispatch => ({
		deletePost: postId =>
			dispatch( deletePost( postId )),
		updatePost: post =>
			dispatch( updatePost( post ))
	});

export default connect( mapStateToProps, mapDispatchToProps )( Post );
