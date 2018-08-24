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
		z-index: -1;
		width: 100%;
		height: 100%;
		position: absolute;
		background-size: cover;
		background-image: url(${props => props.background});
		filter: blur(17px) brightness(90%);
		transform: scale(1.066);
	`,
	LinkPreviewImage = styled( Image )`
		grid-area: img;
		position: absolute !important;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		border-radius: ${props => props.explore ? "8px" : "0"};
		filter: ${props => props.explore && "brightness( 85% )"};
	`,
	LinkPreviewIframe = styled.iframe`
		grid-area: img;
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		border-radius: ${props => props.explore ? "8px" : "0"};
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
						<LinkPreviewIframe
							src={post.linkContent.embeddedUrl}
							frameborder="0"
							allow="autoplay; encrypted-media"
							allowfullscreen="allowfullscreen"
						/>
						:
						<LinkPreviewImage src={post.linkContent.image} />
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
					<React.Fragment>
						<a href={post.mediaContent.url} target="_blank">
							<ItunesImage src={require( "../images/itunes.svg" )} />
						</a>
						<MediaTitle>{post.mediaContent.title}</MediaTitle>
						<MediaImage src={post.mediaContent.image} />
					</React.Fragment>
				}
			</PostMedia>
		);
	}
}

PostDetailsMedia.propTypes = {
	post: PropTypes.object.isRequired
};

export default PostDetailsMedia;
