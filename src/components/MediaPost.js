import React, { Component } from "react";
import styled from "styled-components";
import { Header, Image } from "semantic-ui-react";


const
	Wrapper = styled.div`
		padding: 10px;
		margin: 10px auto;
		border: 1px solid #808080;
		position: relative;
	`,
	PostHeader = styled( Header )`
	`,
	Author = styled.span`
	`,
	DateTime = styled( Header.Subheader )`
	`,
	LinkPreviewWrapper = styled.div`
		display: grid;
		grid-template-columns: 40% 60%;
		grid-column-gap: 7px;
		grid-template-rows: 100%;
		grid-template-areas:
			"img txt"
	`,
	LinkPreviewImage = styled( Image )`
		grid-area: img;
		height: 100%;
		width: 100%;
	`,
	LinkPreviewIframe = styled.iframe`
		grid-area: img;
		height: 100%;
		width: 100%;
	`,
	LinkPreviewText = styled.div`
		grid-area: txt;
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
	`;

var mediaPicture;

class MediaPost extends Component {
	componentWillMount() {
		if ( this.props.picture ) {
			try {
				mediaPicture = require( "../images/" + this.props.mediaContent.image );
			} catch ( err ) {
				console.log( err );
			}
		}
	}

	render() {
		if ( this.props.link ) {
			return (
				<Wrapper>
					<PostHeader className="mediaPostHeader">
						<Author className="postAuthor">{this.props.author}</Author>
						<DateTime className="postDate">{this.props.date}</DateTime>
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

					<p className="postContent">
						{this.props.content}
					</p>
				</Wrapper>
			);
		}
		return (
			<Wrapper>
				<PostHeader className="mediaPostHeader">
					<Author className="postAuthor">{this.props.author}</Author>
					<DateTime className="postDate">{this.props.date}</DateTime>
				</PostHeader>
				<h4>{this.props.mediaContent.title}</h4>
				{this.props.picture ?
					<Image src={mediaPicture} className="mediaPicture" />
					:
					<Image src={this.props.mediaContent.image}
						className="mediaArtwork"
					/>
				}

				<p className="postContent">
					{this.props.content}
				</p>
			</Wrapper>
		);
	}
}

export default MediaPost;
