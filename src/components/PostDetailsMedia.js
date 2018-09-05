import React, { Component } from "react";
import { Image } from "semantic-ui-react";
import styled from "styled-components";
import PropTypes from "prop-types";

const
	PostMedia = styled.div`
		grid-area: media;
		position: relative;
		min-height: 450px;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		overflow: hidden;
		background: #111;
		@media (max-width: 620px) {
			min-height: auto;
		}
	`,
	ItunesMedia = styled.div`
		min-width: 750px;
		min-height: 350px;
		display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
		z-index: 2;
	`,
	ItunesImage = styled( Image )`
		height: 30px;
		position: absolute !important;
		top: 0;
		left: 0;
	`,
	MediaImage = styled( Image )`
		margin: 0 auto;
	`,
	MediaTitle = styled.h4`
		font-family: inherit !important;
		color: #fff;
	`,
	PostMediaBackground = styled.div`
		width: 100%;
		height: 100%;
		position: absolute;
		background-size: cover;
		background-image: url(${props => props.background});
		filter: blur(17px) brightness(90%);
		transform: scale(1.066);
	`,
	LinkMedia = styled.div`
		position: relative;
		height: 0;
		width: 100%;
		padding-bottom: 56%;
	`,
	LinkPreviewIframe = styled.iframe`
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		border: none;
	`;


class PostDetailsMedia extends Component {
	constructor() {
		super();
		this.mediaPicture = undefined;
	}

	render() {
		const
			s3Bucket = "https://d3dlhr4nnvikjb.cloudfront.net/",
			{ post } = this.props;
		try {
			if ( post.picture ) {
				process.env.REACT_APP_STAGE === "dev" ?
					this.mediaPicture = require( "../images/" + post.mediaContent.image )
					:
					this.mediaPicture = s3Bucket + post.mediaContent.image;
			}
		} catch ( err ) {
			console.log( err );
		}
		if ( post.link ) {
			return (
				<PostMedia>
					{post.linkContent.embeddedUrl ?
						<LinkMedia>
							<LinkPreviewIframe
								src={post.linkContent.embeddedUrl}
								frameBorder="0"
								allow="autoplay; encrypted-media"
								allowFullScreen="allowfullscreen"
							/>
						</LinkMedia>
						:
						<React.Fragment>
							<PostMediaBackground background={post.linkContent.image} />
							<MediaImage
								src={post.linkContent.type === "image" ?
									post.linkContent.url : post.linkContent.image}
							/>
						</React.Fragment>
					}
				</PostMedia>
			);
		}
		return (
			<PostMedia>
				<PostMediaBackground background={
					post.picture ?
						this.mediaPicture : post.mediaContent.image
				}
				/>
				{post.picture ?
					<MediaImage src={this.mediaPicture} />
					:
					<ItunesMedia>
						<a href={post.mediaContent.url} target="_blank">
							<ItunesImage src={require( "../images/itunes.svg" )} />
						</a>
						<MediaTitle>{post.mediaContent.title}</MediaTitle>
						<MediaImage src={post.mediaContent.image} />
					</ItunesMedia>
				}
			</PostMedia>
		);
	}
}

PostDetailsMedia.propTypes = {
	post: PropTypes.object.isRequired
};

export default PostDetailsMedia;
