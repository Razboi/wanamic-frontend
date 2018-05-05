import React, { Component } from "react";
import { Button, Input, TextArea } from "semantic-ui-react";
import styled from "styled-components";
import PropTypes from "prop-types";

const
	MediaOptionsWrapper = styled.div`
		display: grid;
		position: fixed;
		height: 100vh;
		width: 100%;
		z-index: 2;
	`,
	MediaDimmer = styled.div`
		position: absolute;
		height: 100%;
		width: 100%;
		background: rgba(0,0,0,0.35)
	`,
	MediaButtons = styled.div`
		justify-self: center;
		align-self: center;
	`,
	MediaButton = styled( Button )`
		background: #000 !important;
	`,
	LinkForm = styled.div`
		display: grid;
		justify-self: center;
		align-self: center;
		width: 100%;
	`,
	ShareLinkInput = styled( Input )`
		width: 80%;
		justify-self: center;
		align-self: center;
		margin-bottom: 10px;
	`,
	ShareLinkContent = styled( TextArea )`
		width: 90%;
		justify-self: center;
		align-self: center;
	`,
	PictureUploadWrapper = styled.span`
		position: relative;
	`,
	PictureUploadInput = styled.input`
		width: 0.1px;
		height: 0.1px;
		opacity: 0;
		overflow: hidden;
		position: absolute;
		z-index: -1;
	`;

class MediaOptions extends Component {
	render() {
		return (
			<MediaOptionsWrapper>
				<MediaDimmer />
				{this.props.shareLink ?
					<LinkForm>
						<ShareLinkInput
							name="linkInput"
							onKeyPress={this.props.handleLinkKeyPress}
							onChange={this.props.handleChange}
							placeholder="Share your link"
						/>
						<ShareLinkContent
							name="linkContent"
							onKeyPress={this.props.handleLinkKeyPress}
							onChange={this.props.handleChange}
							placeholder="Anything to say?"
						/>
					</LinkForm>
					:
					<MediaButtons>
						<MediaButton secondary circular icon="book" size="huge"
							onClick={() => this.props.handleSearchMedia( "book" )}
						/>
						<MediaButton secondary circular icon="music" size="huge"
							onClick={() => this.props.handleSearchMedia( "music" )}
						/>
						<MediaButton secondary circular icon="linkify" size="huge"
							onClick={this.props.handleLink}
						/>
						<PictureUploadWrapper>
							<MediaButton secondary circular icon="picture" size="huge"
								onClick={() => document.getElementById( "pictureInput" ).click()}
							>
							</MediaButton>
							<PictureUploadInput type="file" name="picture" id="pictureInput"
								onChange={this.props.handlePictureSelect}
							/>
						</PictureUploadWrapper>
						<MediaButton secondary circular icon="film" size="huge"
							onClick={() => this.props.handleSearchMedia( "movie" )}
						/>
						<MediaButton secondary circular icon="tv" size="huge"
							onClick={() => this.props.handleSearchMedia( "tv" )}
						/>
					</MediaButtons>
				}
			</MediaOptionsWrapper>
		);
	}
}

MediaOptions.propTypes = {
	handleSearchMedia: PropTypes.func.isRequired,
	handlePictureSelect: PropTypes.func.isRequired,
	handleLink: PropTypes.func.isRequired,
	handleChange: PropTypes.func.isRequired,
	handleLinkKeyPress: PropTypes.func.isRequired,
	shareLink: PropTypes.bool.isRequired
};

export default MediaOptions;
