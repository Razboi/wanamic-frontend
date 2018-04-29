import React, { Component } from "react";
import styled from "styled-components";
import { Header, Image } from "semantic-ui-react";
import moment from "moment";
import PostOptions from "../components/PostOptions";
import api from "../services/api";
import Comments from "../components/Comments";

const
	Wrapper = styled.div`
		overflow: hidden;
		display: grid;
		position: relative;
	`,
	PostHeader = styled( Header )`
		padding: 10px !important;
	`,
	Author = styled.span`
	`,
	DateTime = styled( Header.Subheader )`
	`,
	LinkPreviewWrapper = styled.div`
		@media (max-width: 420px) {
			display: grid;
			grid-template-columns: 100%;
			grid-row-gap: 7px;
			grid-template-rows: 50% 50%;
			grid-template-areas:
				"img"
				"txt"
		}
		display: grid;
		grid-template-columns: 40% 60%;
		grid-column-gap: 7px;
		grid-template-rows: 100%;
		grid-template-areas:
			"img txt"
	`,
	LinkPreviewImage = styled( Image )`
		grid-area: img;
		width: 100%;
	`,
	LinkPreviewIframe = styled.iframe`
		grid-area: img;
		width: 100%;
	`,
	LinkPreviewText = styled.div`
		grid-area: txt;
		padding: 10px;
		display: grid;
		grid-template-columns: 100%;
		grid-template-rows: 25% 65% 10%;
		grid-template-areas:
			"head"
			"desc"
			"host"
	`,
	LinkPreviewHeader = styled.h4`
		grid-area: head;
	`,
	LinkPreviewDescription = styled.p`
		grid-area: desc;
		color: #000;
		font-size: 13px;
	`,
	LinkPreviewHostname = styled.span`
		grid-area: host;
		color: #808080;
		font-size: 13px;
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
		padding: 10px;
	`;

var mediaPicture;

class MediaPost extends Component {
	constructor() {
		super();
		this.state = {
			likedBy: [],
			comments: []
		};
	}

	static getDerivedStateFromProps( nextProps, prevState ) {
		return { likedBy: nextProps.likedBy, comments: nextProps.comments };
	}

	componentDidMount() {
		if ( this.props.picture ) {
			try {
				mediaPicture = require( "../images/" + this.props.mediaContent.image );
			} catch ( err ) {
				console.log( err );
			}
		}
	}

	handleLike = () => {
		this.setState({
			likedBy: [ ...this.state.likedBy, localStorage.getItem( "username" ) ]
		});

		api.likePost( this.props.id )
			.catch( err => console.log( err ));
	}

	handleDislike = () => {
		var	newLikedBy = this.state.likedBy;
		const index = this.state.likedBy.indexOf( localStorage.getItem( "username" ));
		newLikedBy.splice( index, 1 );
		this.setState({ likedBy: newLikedBy });

		api.dislikePost( this.props.id )
			.catch( err => console.log( err ));
	}

	render() {
		if ( this.props.link ) {
			return (
				<Wrapper>
					<PostHeader className="mediaPostHeader">
						<Author className="postAuthor">{this.props.author}</Author>
						<DateTime className="postDate">
							{moment( this.props.date ).fromNow()}
						</DateTime>
					</PostHeader>

					<a href={this.props.linkContent.url}>
						<LinkPreviewWrapper className="linkPreviewWrapper">
							{this.props.linkContent.embeddedUrl ?
								<LinkPreviewIframe
									className="linkPreviewIframe"
									src={this.props.linkContent.embeddedUrl}
									frameborder="0"
									allow="autoplay; encrypted-media"
									allowfullscreen="allowfullscreen"
								/>
								:
								<LinkPreviewImage
									className="linkPreviewImage"
									src={this.props.linkContent.image}
								/>
							}

							<LinkPreviewText className="linkPreviewText">
								<LinkPreviewHeader>
									{this.props.linkContent.title}
								</LinkPreviewHeader>
								<LinkPreviewDescription>
									{this.props.linkContent.description}
								</LinkPreviewDescription>
								<LinkPreviewHostname>
									{this.props.linkContent.hostname}
								</LinkPreviewHostname>
							</LinkPreviewText>
						</LinkPreviewWrapper>
					</a>

					<PostOptions
						handleLike={this.handleLike}
						handleDislike={this.handleDislike}
						switchComments={this.props.switchComments}
						numLiked={this.state.likedBy.length}
						numComments={this.props.comments.length}
						id={this.props.id}
						liked={
							this.state.likedBy.includes( localStorage.getItem( "username" ))
						}
					/>

					{this.props.content &&
						<PostUserContent>
							<p className="postContent">
								{this.props.content}
							</p>
						</PostUserContent>
					}
				</Wrapper>
			);
		}
		return (
			<Wrapper>
				<PostHeader className="mediaPostHeader">
					<Author className="postAuthor">{this.props.author}</Author>
					<DateTime className="postDate">
						{moment( this.props.date ).fromNow()}
					</DateTime>
				</PostHeader>

				<PostMediaContent>
					<PostMediaBackground background={
						this.props.picture ? mediaPicture : this.props.mediaContent.image
					}
					/>
					<h4>{this.props.mediaContent.title}</h4>
					{this.props.picture ?
						<MediaImage src={mediaPicture} className="mediaPicture" />
						:
						<MediaImage src={this.props.mediaContent.image}
							className="mediaArtwork"
						/>
					}
				</PostMediaContent>

				<PostOptions
					handleLike={this.handleLike}
					handleDislike={this.handleDislike}
					switchComments={this.props.switchComments}
					numLiked={this.state.likedBy.length}
					numComments={this.state.comments.length}
					id={this.props.id}
					liked={
						this.state.likedBy.includes( localStorage.getItem( "username" ))
					}
				/>

				{this.props.content &&
					<PostUserContent>
						<p className="postContent">
							{this.props.content}
						</p>
					</PostUserContent>
				}
			</Wrapper>
		);
	}
}

export default MediaPost;
