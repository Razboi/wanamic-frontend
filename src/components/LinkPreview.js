import React, { Component } from "react";
import { Image } from "semantic-ui-react";
import PropTypes from "prop-types";
import styled from "styled-components";

const
	LinkPreviewWrapper = styled.div`
		display: grid;
		height: auto;
		grid-template-columns: 100%;
		grid-template-rows: auto 1fr;
		grid-template-areas:
			"txt"
			"img";
	`,
	LinkPreviewImage = styled( Image )`
		grid-area: img;
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
	`,
	EmbeddedMedia = styled.div`
		position: relative;
		height: 0;
		padding-bottom: 100%;
		:hover {
			cursor: pointer;
		}
		@media (min-width: 760px) {
			padding-bottom: ${props => props.details ?
		( props.video ? "50%" : "420px" ) : "100%"};

			width: ${props => props.details && !props.video && "420px"};
			margin: ${props => props.details && !props.video && "0 auto"};
		}
	`,
	LinkImage = styled.div`
		position: relative;
		:hover {
			cursor: pointer;
		}
		@media (min-width: 760px) {
			width: ${props => props.details && !props.video && "420px"};
			margin: ${props => props.details && !props.video && "0 auto"};
		}
	`,
	LinkPreviewText = styled.div`
		grid-area: txt;
		padding: 5px 10px;
		display: grid;
		grid-template-columns: 100%;
		grid-template-rows: 50% 50%;
		grid-template-areas:
			"head"
			"host"
	`,
	LinkPreviewHeader = styled.h4`
		grid-area: head;
		margin-bottom: 5px !important;
    font-size: 1.6rem;
    font-family: inherit;
	`,
	LinkPreviewHostname = styled.span`
		grid-area: host;
		color: #808080;
		font-size: 13px;
	`;


class LinkPreview extends Component {

	render() {
		const { linkContent } = this.props;
		return (
			<LinkPreviewWrapper>
				{linkContent.embeddedUrl ?
					<EmbeddedMedia
						video={linkContent.embeddedUrl}
						details={this.props.details}
					>
						<LinkPreviewIframe
							key={linkContent.embeddedUrl}
							src={linkContent.embeddedUrl}
							frameBorder="0"
							allow="autoplay; encrypted-media"
							allowFullScreen="allowfullscreen"
						/>
					</EmbeddedMedia>
					:
					<LinkImage>
						<a href={linkContent.url} target="_blank">
							<LinkPreviewImage src={linkContent.type === "image" ?
								linkContent.url : linkContent.image} />
						</a>
					</LinkImage>
				}

				{linkContent.type !== "image" &&
					<LinkPreviewText>
						<a href={linkContent.url} target="_blank">
							<LinkPreviewHeader>
								{linkContent.title}
							</LinkPreviewHeader>
						</a>
						<a
							href={`https://${linkContent.hostname}`}
							target="_blank"
						>
							<LinkPreviewHostname>
								{linkContent.hostname}
							</LinkPreviewHostname>
						</a>
					</LinkPreviewText>}
			</LinkPreviewWrapper>
		);
	}
}

LinkPreview.propTypes = {
	linkContent: PropTypes.object.isRequired,
	details: PropTypes.bool,
	displayPostDetails: PropTypes.func
};

export default LinkPreview;
