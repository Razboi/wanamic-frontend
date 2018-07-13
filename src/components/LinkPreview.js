import React, { Component } from "react";
import { Image } from "semantic-ui-react";
import PropTypes from "prop-types";
import styled from "styled-components";

const
	LinkPreviewWrapper = styled.div`
		@media (max-width: 420px) {
			display: grid;
			grid-template-columns: 100%;
			grid-row-gap: ${props => props.hideText ? "0" : "7px"};
			grid-template-rows: 50% 50%;
			grid-template-areas:
				"img"
				"txt"
		}
		display: grid;
		grid-template-columns: 40% 60%;
		grid-column-gap: ${props => props.hideText ? "0" : "7px"};
		grid-template-rows: 100%;
		grid-template-areas:
			"img txt"
	`,
	LinkPreviewImage = styled( Image )`
		grid-area: img;
		width: 100%;
		border-radius: ${props => props.hideText ? "8px" : "0"};
	`,
	LinkPreviewIframe = styled.iframe`
		grid-area: img;
		width: 100%;
		border-radius: ${props => props.hideText ? "8px" : "0"};
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
				<LinkPreviewWrapper
					hideText={this.props.hideText}
					className="linkPreviewWrapper"
				>
					{this.props.linkContent.embeddedUrl ?
						<LinkPreviewIframe
							hideText={this.props.hideText}
							className="linkPreviewIframe"
							src={this.props.linkContent.embeddedUrl}
							frameborder="0"
							allow="autoplay; encrypted-media"
							allowfullscreen="allowfullscreen"
						/>
						:
						<LinkPreviewImage
							hideText={this.props.hideText}
							className="linkPreviewImage"
							src={this.props.linkContent.image}
						/>
					}
					{!this.props.hideText &&
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
					}
				</LinkPreviewWrapper>
			</a>
		);
	}
}

LinkPreview.propTypes = {
	linkContent: PropTypes.object.isRequired,
	hideText: PropTypes.bool
};

export default LinkPreview;
