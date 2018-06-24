import React, { Component } from "react";
import styled from "styled-components";
import { Header, Image } from "semantic-ui-react";
import moment from "moment";
import PostOptions from "./PostOptions";
import api from "../services/api";
import DropdownOptions from "../components/DropdownOptions";
import PropTypes from "prop-types";
import { deletePost, updatePost } from "../services/actions/posts";
import { connect } from "react-redux";
import AlertsFilter from "../components/AlertsFilter";
import LinkPreview from "../components/LinkPreview";
import refreshToken from "../utils/refreshToken";

const
	Wrapper = styled.div`
		overflow: hidden;
		display: grid;
		position: relative;
		border-bottom: 1px solid rgba(0, 0, 0, .1);
	`,
	PostHeader = styled( Header )`
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
	StyledOptions = {
		position: "absolute",
		right: "1rem",
		top: "1rem",
	},
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
		font-size: 1rem !important;
		color: rgba(0,0,0,0.45) !important;
	`,
	MediaImage = styled( Image )`
		justify-self: center;
	`,
	PostMediaContent = styled.div`
		display: grid;
		position: relative;
		overflow: hidden;
		text-align: center;
		width: 100%;
		height: 100%;
		color: #fff;
	`,
	PostMediaBackground = styled.div`
		z-index: -1;
		width: 100%;
		height: 100%;
		position: absolute;
		background-size: cover;
		background-image: url(${props => props.background});
		filter: blur(17px) brightness(90%);
		transform: scale(1.2);
	`,
	PostUserContent = styled.div`
		padding: 1rem 1rem 2rem 1rem;
	`,
	Description = styled.span`
		font-weight: bold;
		font-size: 16px;
		word-break: break-all;
	`,
	PostBody = styled.div`
		position: relative;
		overflow: hidden;
	`,
	Dimmer = styled.div`
		filter: ${props => props.blurFilter ?
		"blur(25px) brightness(50%)" : "blur(0px)"};
		transform: scale(${props => props.blurFilter ? "1.3" : "1"});
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
			updatedContent: "",
			id: ""
		};
	}

	static getDerivedStateFromProps( props, state ) {
		const { post } = props;
		if ( post._id === state.id ) {
			return null;
		}
		if ( post.sharedPost ) {
			return {
				likedBy: post.likedBy,
				nsfw: post.sharedPost.alerts.nsfw,
				spoiler: post.sharedPost.alerts.spoiler,
				updatedContent: post.content,
				id: post._id
			};
		} else {
			return {
				likedBy: post.likedBy,
				nsfw: post.alerts.nsfw,
				spoiler: post.alerts.spoiler,
				updatedContent: post.content,
				id: post._id
			};
		}
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
					this.props.deletePost( this.props.index );
				}
			}).catch( err => console.log( err ));
	};

	handleUpdate = () => {
		if ( this.state.content !== this.state.updatedContent
			&& this.state.updatedContent !== "" ) {
			api.updatePost( this.props.post._id, this.state.updatedContent )
				.then( res => {
					if ( res === "jwt expired" ) {
						refreshToken()
							.then(() => this.handleUpdate())
							.catch( err => console.log( err ));
					} else {
						this.props.updatePost( res.data );
					}
				})
				.catch( err => console.log( err ));
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

	render() {
		try {
			if ( this.props.post.authorImg ) {
				userPicture = require( "../images/" + this.props.post.authorImg );
			} else {
				userPicture = require( "../images/defaultUser.png" );
			}

			if ( this.props.post.picture ) {
				mediaPicture =
					require( "../images/" + this.props.post.mediaContent.image );
			}
		} catch ( err ) {
			console.log( err );
		}

		return (
			<Wrapper>
				<PostHeader className="mediaPostHeader">
					<AuthorImg circular src={userPicture} />
					<HeaderInfo>
						<AuthorFullname className="postAuthor">
							{this.props.post.authorFullname}
							<AuthorUsername>
								@{this.props.post.author}
							</AuthorUsername>
						</AuthorFullname>
						<DateTime className="postDate">
							{moment( this.props.post.createdAt ).fromNow()}
						</DateTime>
					</HeaderInfo>

					{ !this.props.fakeOptions &&
						<DropdownOptions
							style={StyledOptions}
							author={this.props.post.author}
							updatedContent={this.state.updatedContent}
							handleUpdate={this.handleUpdate}
							handleDelete={this.handleDelete}
							handleChange={this.handleChange}
						/>
					}
				</PostHeader>

				<PostBody>
					<AlertsFilter
						handleFilter={this.handleFilter}
						nsfw={this.state.nsfw}
						spoiler={this.state.spoiler}
					/>
					<Dimmer blurFilter={this.state.nsfw || this.state.spoiler}>
						{this.props.post.link ?
							<LinkPreview linkContent={this.props.post.linkContent} />
							:
							<PostMediaContent>
								<PostMediaBackground background={
									this.props.post.picture ?
										mediaPicture : this.props.post.mediaContent.image
								}
								/>
								<h4>{this.props.post.mediaContent.title}</h4>
								{this.props.post.picture ?
									<MediaImage src={mediaPicture} className="mediaPicture" />
									:
									<MediaImage src={this.props.post.mediaContent.image}
										className="mediaArtwork"
									/>
								}
							</PostMediaContent>
						}

						{ !this.props.fakeOptions &&
							<PostOptions
								fakeOptions={this.props.fakeOptions}
								handleLike={this.handleLike}
								handleDislike={this.handleDislike}
								numLiked={this.state.likedBy.length}
								numComments={this.props.post.comments.length}
								numShared={this.props.post.sharedBy.length}
								id={this.props.post._id}
								index={this.props.index}
								liked={
									this.state.likedBy.includes( localStorage.getItem( "username" ))
								}
							/>
						}

						{this.props.post.content &&
							<PostUserContent>
								<p className="postContent">
									<Description>@{this.props.post.author} </Description>
									{this.props.post.content}
								</p>
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
	post: PropTypes.object.isRequired
};

const
	mapStateToProps = state => ({
	}),

	mapDispatchToProps = dispatch => ({
		deletePost: postIndex => dispatch( deletePost( postIndex )),
		updatePost: post => dispatch( updatePost( post ))
	});

export default connect( mapStateToProps, mapDispatchToProps )( MediaPost );
