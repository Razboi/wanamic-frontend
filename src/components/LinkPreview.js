import React, { Component } from "react";
import { Image, Icon } from "semantic-ui-react";
import PropTypes from "prop-types";
import styled from "styled-components";

const
	LinkPreviewWrapper = styled.div`
		display: grid;
		height: auto;
		grid-template-columns: 100%;
		grid-row-gap: ${props => props.explore ? "0" : "7px"};
		grid-template-rows: 50% 50%;
		grid-template-areas:
			"img"
			"txt"
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
	`,
	LinkMedia = styled.div`
		position: relative;
		height: 0;
		padding-bottom: 100%;
		@media (min-width: 760px) {
			padding-bottom: ${props => props.details ?
		( props.video ? "50%" : "420px" ) : "100%"};

			width: ${props => props.details && !props.video && "420px"};
			margin: ${props => props.details && !props.video && "0 auto"};
		}
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
	PlayIcon = styled( Icon )`
		position: absolute !important;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		margin: auto !important;
		font-size: 2.5rem !important;
		color: rgba( 255, 255, 255, 0.75 );
	`,
	LinkIcon = styled( Icon )`
		position: absolute !important;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		margin: auto !important;
		font-size: 2.5rem !important;
		color: rgba( 255, 255, 255, 0.75 );
	`;


class LinkPreview extends Component {
	render() {
		if ( this.props.explore ) {
			return (
				<LinkPreviewWrapper
					explore={this.props.explore ? 1 : 0}
					className="linkPreviewWrapper"
				>
					<LinkMedia>
						<LinkPreviewImage
							explore={this.props.explore ? 1 : 0}
							className="linkPreviewImage"
							src={this.props.linkContent.image}
						/>
						{this.props.linkContent.embeddedUrl ?
							<PlayIcon name="video play" />
							:
							<LinkIcon name="linkify" />
						}
					</LinkMedia>

				</LinkPreviewWrapper>
			);
		}
		return (
			<a href={this.props.linkContent.url} target="_blank">
				<LinkPreviewWrapper
					className="linkPreviewWrapper"
				>
					<LinkMedia
						video={this.props.linkContent.embeddedUrl}
						details={this.props.details}
					>
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
					</LinkMedia>

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
	linkContent: PropTypes.object.isRequired,
	explore: PropTypes.bool,
	details: PropTypes.bool
};

export default LinkPreview;
