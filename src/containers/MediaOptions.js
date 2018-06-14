import React, { Component } from "react";
import { Button, Input, TextArea } from "semantic-ui-react";
import styled from "styled-components";
import PropTypes from "prop-types";
import SearchMedia from "../containers/SearchMedia";
import ShareBox from "../components/ShareBox";
import api from "../services/api";
import { addPost, switchMediaOptions } from "../services/actions/posts";
import { connect } from "react-redux";
import refreshToken from "../utils/refreshToken";

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
		z-index: 2;
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
	`,
	StyledSearchMedia = styled( SearchMedia )`
		z-index: 2;
	`,
	SwapBackButton = styled( Button )`
		position: fixed;
		bottom: 5px;
		left: 5px;
	`,
	ShareBoxWrapper = styled.div`
		z-index: 2;
		display: grid;
		align-content: center;
	`;

class MediaOptions extends Component {
	constructor() {
		super();
		this.state = {
			searchMedia: false,
			shareLink: false,
			shareState: false,
			linkUrl: "",
			linkContent: "",
			mediaType: "",
			sharebox: ""
		};
	}

	handleChange = e => {
		this.setState({ [ e.target.name ]: e.target.value });
	}

	submitLink = () => {
		if ( this.state.linkUrl ) {
			api.createMediaLink({
				link: this.state.linkUrl, content: this.state.linkContent
			})
				.then( res => {
					if ( res === "jwt expired" ) {
						refreshToken()
							.then(() => this.submitLink())
							.catch( err => console.log( err ));
					} else {
						this.props.addPost( res );
						this.props.switchMediaOptions();
					}
				}).catch( err => console.log( err ));
		}
	}

	handleLinkKeyPress = e => {
		if ( e.key === "Enter" ) {
			this.submitLink();
		}
	}

	switchSearchMedia = media => {
		this.setState({ searchMedia: !this.state.searchMedia, mediaType: media });
	}

	switchLink = () => {
		this.setState({ shareLink: !this.state.shareLink });
	}

	switchState = () => {
		this.setState({ shareState: !this.state.shareState });
	}

	handleShare = () => {
		if ( this.state.sharebox !== "" ) {
			api.createPost( this.state.sharebox )
				.then( res => {
					if ( res === "jwt expired" ) {
						refreshToken()
							.then(() => this.handleShare())
							.catch( err => console.log( err ));
					} else {
						this.props.addPost( res );
						this.props.switchMediaOptions();
						this.setState({ sharebox: "" });
					}
				}).catch( err => console.log( err ));
		}
	};

	render() {
		if ( this.state.searchMedia ) {
			return (
				<MediaOptionsWrapper>
					<MediaDimmer />
					<StyledSearchMedia
						socket={this.props.socket}
						mediaType={this.state.mediaType}
						switchSearchMedia={this.switchSearchMedia}
					/>
				</MediaOptionsWrapper>
			);
		}
		if ( this.state.shareState ) {
			return (
				<MediaOptionsWrapper>
					<MediaDimmer />
					<ShareBoxWrapper>
						<ShareBox
							handleChange={this.handleChange}
							sharebox={this.state.sharebox}
							handleShare={this.handleShare}
						/>
					</ShareBoxWrapper>
				</MediaOptionsWrapper>
			);
		}
		if ( this.state.shareLink ) {
			return (
				<MediaOptionsWrapper>
					<MediaDimmer />
					<LinkForm>
						<ShareLinkInput
							name="linkUrl"
							onKeyPress={this.handleLinkKeyPress}
							onChange={this.handleChange}
							placeholder="Share your link"
						/>
						<ShareLinkContent
							name="linkContent"
							onKeyPress={this.handleLinkKeyPress}
							onChange={this.handleChange}
							placeholder="Anything to say?"
						/>
					</LinkForm>
					<SwapBackButton secondary content="Cancel" onClick={this.switchLink} />
				</MediaOptionsWrapper>
			);
		}
		return (
			<MediaOptionsWrapper>
				<MediaDimmer />
				<MediaButtons>
					<MediaButton secondary circular icon="book" size="huge"
						onClick={() => this.switchSearchMedia( "book" )}
					/>
					<MediaButton secondary circular icon="music" size="huge"
						onClick={() => this.switchSearchMedia( "music" )}
					/>
					<MediaButton secondary circular icon="linkify" size="huge"
						onClick={this.switchLink}
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
						onClick={() => this.switchSearchMedia( "movie" )}
					/>
					<MediaButton secondary circular icon="tv" size="huge"
						onClick={() => this.switchSearchMedia( "tv" )}
					/>
					<MediaButton secondary circular icon="pencil" size="huge"
						onClick={this.switchState}
					/>
				</MediaButtons>
			</MediaOptionsWrapper>
		);
	}
}

MediaOptions.propTypes = {
	handlePictureSelect: PropTypes.func.isRequired,
	addPost: PropTypes.func.isRequired,
	switchMediaOptions: PropTypes.func.isRequired
};

const
	mapStateToProps = state => ({
	}),

	mapDispatchToProps = dispatch => ({
		addPost: post => dispatch( addPost( post )),
		switchMediaOptions: () => dispatch( switchMediaOptions())
	});

export default connect( mapStateToProps, mapDispatchToProps )( MediaOptions );
