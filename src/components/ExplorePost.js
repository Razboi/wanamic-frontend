import React, { Component } from "react";
import styled from "styled-components";
import { Image } from "semantic-ui-react";
import PropTypes from "prop-types";
import LinkPreview from "../components/LinkPreview";

const
	Wrapper = styled.div`
		overflow: hidden;
		display: grid;
		position: relative;
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
		border-radius: 8px;
		font-family: inherit !important;
	`,
	MediaTitle = styled.h4`
		font-family: inherit !important;
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
	`;

var
	mediaPicture;

class ExplorePost extends Component {
	render() {
		const { post } = this.props;
		try {
			if ( post.picture ) {
				mediaPicture =
					require( "../images/" + post.mediaContent.image );
			}
		} catch ( err ) {
			console.log( err );
		}

		return (
			<Wrapper>
				{post.link ?
					<LinkPreview linkContent={post.linkContent} explore />
					:
					<PostMediaContent>
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
								<MediaImage src={post.mediaContent.image}
									className="mediaArtwork"
								/>
							</React.Fragment>
						}
					</PostMediaContent>
				}
			</Wrapper>
		);
	}
}

ExplorePost.propTypes = {
	post: PropTypes.object.isRequired
};


export default ExplorePost;
