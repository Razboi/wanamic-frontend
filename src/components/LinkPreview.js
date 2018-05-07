import React, { Component } from "react";
import { Image } from "semantic-ui-react";
import PropTypes from "prop-types";
import styled from "styled-components";

const
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
	`;


class LinkPreview extends Component {
	render() {
		return (
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
		);
	}
}

LinkPreview.propTypes = {
	linkContent: PropTypes.object.isRequired
};

export default LinkPreview;
