import React, { Component } from "react";
import styled from "styled-components";
import { Header, Image } from "semantic-ui-react";
import moment from "moment";
import PostOptions from "./PostOptions";
import api from "../services/api";
import DropdownOptions from "../components/DropdownOptions";
import PropTypes from "prop-types";
import {
	deletePost, updatePost, switchPostDetails
} from "../services/actions/posts";
import { connect } from "react-redux";
import AlertsFilter from "../components/AlertsFilter";
import LinkPreview from "../components/LinkPreview";
import refreshToken from "../utils/refreshToken";
import extract from "../utils/extractMentionsHashtags";

const
	Wrapper = styled.div`
		overflow: hidden;
		display: grid;
		position: relative;
		border-bottom: ${props => props.noBorder ?
		"0" : "1px solid rgba(0, 0, 0, .1)"};

		@media (min-width: 420px) {
			margin-bottom: ${props => !props.noBorder && "1rem"};
			background: #fff;
			border-bottom-left-radius: 2px;
			border-bottom-right-radius: 2px;
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
		font-size: 1rem !important;
		color: rgba(0,0,0,0.45) !important;
	`,
	MediaTitle = styled.h4`
		font-family: inherit !important;
	`,
	MediaImage = styled( Image )`
		margin: 0 auto;
		max-height: 1100px !important;
		max-width: 100% !important;
	`,
	PostMediaContent = styled.div`
		display: grid;
		position: relative;
		overflow: hidden;
		text-align: center;
		width: 100%;
		height: 100%;
		color: #fff;
		:hover {
			cursor: pointer;
		}
	`,
	PostMediaBackground = styled.div`
		z-index: -1;
		width: 100%;
		height: 100%;
		position: absolute;
		background-size: cover;
		background-image: url(${props => props.background});
		filter: blur(17px) brightness(90%);
		transform: scale(1.066);
	`,
	PostUserContent = styled.div`
		padding: 1rem 1rem 2rem 1rem;
	`,
	UserContent = styled.p`
		color: #222;
		word-break: break-word;
		font-size: 1rem;
	`,
	Description = styled.span`
		font-weight: bold;
		font-size: 1rem;
		word-break: break-all;
	`,
	PostBody = styled.div`
		position: relative;
		overflow: hidden;
		min-height: ${props => props.alerts && "250px"};
		font-family: inherit !important;
	`,
	Dimmer = styled.div`
		min-height: ${props => props.blurFilter && "250px"};
		filter: ${props => props.blurFilter ?
		"blur(15px) brightness(50%)" : "blur(0px)"};
		transform: scale(${props => props.blurFilter ? "1.05" : "1"});
	`;

var
	mediaPicture,
	userPicture;

class MediaPost extends Component {
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
			id: post._id
		};
	}

	handleChange = e => {
		this.setState({ [ e.target.name ]: e.target.value });
	}

	handleDelete = () => {
		api.deletePost( this.props.post._id )
			.then( res => {
				if ( res === "jwt expired" ) {
					refreshToken()
						.then(() => this.handleDelete())
						.catch( err => console.log( err ));
				} else {
					this.props.deletePost( this.props.post._id );
				}
			}).catch( err => console.log( err ));
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
				likedBy: [ ...this.state.likedBy, localStorage.getItem( "username" ) ]
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

	displayPostDetails = () => {
		if ( this.props.newsFeed && !this.props.post.picture ) {
			this.props.switchPostDetails( this.props.index );
		}
	}

	hidePostDetails = () => {
		this.setState({
			selectedPost: 0
		});
		this.props.switchPostDetails();
	}

	render() {
		const { post } = this.props;
		try {
			if ( post.author.profileImage ) {
				userPicture = require( "../images/" + post.author.profileImage );
			} else {
				userPicture = require( "../images/defaultUser.png" );
			}

			if ( post.picture ) {
				mediaPicture =
					require( "../images/" + post.mediaContent.image );
			}
		} catch ( err ) {
			console.log( err );
		}

		return (
			<Wrapper
				onShare={this.props.onShare}
				noBorder={this.props.fakeOptions || this.props.details
					? 1 : 0}
			>
				<PostHeader className="mediaPostHeader">
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
						{post.link ?
							<LinkPreview
								linkContent={post.linkContent}
								details={this.props.details}
							/>
							:
							<PostMediaContent onClick={this.displayPostDetails}>
								<PostMediaBackground background={
									post.picture ?
										mediaPicture : post.mediaContent.image
								}
								/>
								{post.picture ?
									<MediaImage src={mediaPicture} className="mediaPicture" />
									:
									<React.Fragment>
										<MediaTitle>{post.mediaContent.title}</MediaTitle>
										<MediaImage
											src={post.mediaContent.image}
											className="mediaArtwork"
										/>
									</React.Fragment>
								}
							</PostMediaContent>
						}

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

						{post.content &&
							<PostUserContent>
								<UserContent className="postContent">
									<Description>@{post.author.username} </Description>
									{post.content}
								</UserContent>
							</PostUserContent>
						}
					</Dimmer>
				</PostBody>
			</Wrapper>
		);
	}
}

MediaPost.propTypes = {
	index: PropTypes.number,
	post: PropTypes.object.isRequired,
	socket: PropTypes.object,
	goToProfile: PropTypes.func,
	newsFeed: PropTypes.bool,
	details: PropTypes.bool
};

const
	mapStateToProps = state => ({
	}),

	mapDispatchToProps = dispatch => ({
		deletePost: postId => dispatch( deletePost( postId )),
		updatePost: post => dispatch( updatePost( post )),
		switchPostDetails: index => dispatch( switchPostDetails( index ))
	});

export default connect( mapStateToProps, mapDispatchToProps )( MediaPost );
