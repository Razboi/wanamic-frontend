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

const
	Wrapper = styled.div`
		overflow: hidden;
		display: grid;
		position: relative;
		border-bottom: 1px solid rgba(0, 0, 0, .5);
	`,
	PostHeader = styled( Header )`
		padding: 10px !important;
	`,
	Author = styled.span`
	`,
	DateTime = styled( Header.Subheader )`
	`,
	MediaImage = styled( Image )`
		justify-self: center;
		align-self: center;
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
		padding: 0px 10px;
		margin-bottom: 30px;
	`,
	ContentAuthor = styled.span`
		font-weight: bold;
		font-size: 16px;
	`,
	PostBody = styled.div`
		position: relative;
		overflow: hidden;
	`,
	Dimmer = styled.div`
		filter: ${props => props.blurFilter ?
		"blur(25px) brightness(80%)" : "blur(0px)"};
		transform: scale(${props => props.blurFilter ? "1.3" : "1"});
	`;

var mediaPicture;

class MediaPost extends Component {
	constructor() {
		super();
		this.state = {
			likedBy: [],
			nsfw: false,
			spoiler: false,
			updatedContent: ""
		};
	}

	static getDerivedStateFromProps( nextProps, prevState ) {
		return {
			likedBy: nextProps.post.likedBy,
			nsfw: nextProps.post.alerts.nsfw,
			spoiler: nextProps.post.alerts.spoiler,
			updatedContent: nextProps.post.content
		};
	}

	handleChange = e => {
		this.setState({ [ e.target.name ]: e.target.value });
	}

	handleDelete = () => {
		api.deletePost( this.props.post.id )
			.then( res => this.props.deletePost( this.props.index ))
			.catch( err => console.log( err ));
	};

	handleUpdate = () => {
		if ( this.state.content !== this.state.updatedContent
			&& this.state.updatedContent !== "" ) {
			api.updatePost( this.props.post.id, this.state.updatedContent )
				.then( res => this.props.updatePost( res.data ))
				.catch( err => console.log( err ));
		}
	};

	handleLike = () => {
		this.setState({
			likedBy: [ ...this.state.likedBy, localStorage.getItem( "username" ) ]
		});

		api.likePost( this.props.post._id )
			.catch( err => console.log( err ));
	}

	handleDislike = () => {
		var	newLikedBy = this.state.likedBy;
		const index = this.state.likedBy.indexOf( localStorage.getItem( "username" ));
		newLikedBy.splice( index, 1 );
		this.setState({ likedBy: newLikedBy });

		api.dislikePost( this.props.post._id )
			.catch( err => console.log( err ));
	}

	handleFilter = type => {
		this.setState({ [ type ]: false });
	}

	render() {
		if ( this.props.post.picture ) {
			try {
				mediaPicture =
					require( "../images/" + this.props.post.mediaContent.image );
			} catch ( err ) {
				console.log( err );
			}
		}

		return (
			<Wrapper>
				<PostHeader className="mediaPostHeader">
					<Author className="postAuthor">{this.props.post.author}</Author>
					<DateTime className="postDate">
						{moment( this.props.post.date ).fromNow()}
					</DateTime>

					{ !this.props.fakeOptions &&
						<DropdownOptions
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

						{this.props.content &&
							<PostUserContent>
								<p className="postContent">
									<ContentAuthor>@{this.props.author} </ContentAuthor>
									{this.props.content}
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
