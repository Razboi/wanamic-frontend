import React, { Component } from "react";
import { Message } from "semantic-ui-react";
import styled from "styled-components";
import PropTypes from "prop-types";
import SearchMedia from "../containers/SearchMedia";
import ShareBox from "../components/ShareBox";
import ShareLink from "../components/ShareLink";
import MediaPicture from "./MediaPicture";
import api from "../services/api";
import { addPost, switchMediaOptions } from "../services/actions/posts";
import { connect } from "react-redux";
import refreshToken from "../utils/refreshToken";
import extract from "../utils/extractMentionsHashtags";
import compressImage from "../utils/compressImage";

const
	MediaOptionsWrapper = styled.div`
		display: flex;
		justify-content: center;
		position: fixed;
		height: 100vh;
		width: 100%;
		z-index: 2;
	`,
	ErrorMessage = styled( Message )`
		position: absolute !important;
		top: 0 !important;
		width: 100% !important;
		text-align: center !important;
		border-radius: 0px !important;
		z-index: 2;
	`,
	MediaDimmer = styled.div`
		position: fixed;
		height: 100%;
		width: 100%;
		background: rgba(0,0,0,0.85);
		z-index: 1;
	`,
	MediaButtons = styled.div`
		display: flex;
		align-self: center;
		z-index: 1;
		@media (min-height: 600px) {
			flex-direction: column;
		}
		@media (min-height: 800px) {
			height: 80%;
			justify-content: space-evenly;
		}
		@media (max-width: 490px) and (max-height: 600px) {
			flex-wrap: wrap;
			width: 50%;
			justify-content: space-around;
			height: 60%;
		}
		@media (max-width: 490px) and (max-height: 410px) {
			align-self: flex-start;
			margin-top: 1rem;
		}
		@media (max-width: 490px) and (max-height: 350px) {
			align-self: flex-start;
			margin-top: 1rem;
			width: 100%;
			justify-content: center;
		}
	`,
	MediaOption = styled.div`
		height: 60px;
		width: 60px;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 1px solid #fff;
		border-radius: 100%;
		background: rgba(0,0,0,0.8);
		margin: 3px;
		@media (min-height: 575px) {
			margin: 5px;
		}
		:hover {
			cursor: pointer;
		}
	`,
	OptionImage = styled.span`
		height: 24px;
		width: 24px;
		display: block;
		background-image: url(${props => props.image});
		background-repeat: no-repeat;
		margin: 0;
		position: relative;
		background-size: 100%;
}
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
	LoaderDimmer = styled.div`
		position: fixed;
		left: 0;
		top: 0;
		height: 100vh;
		width: 100vw;
		z-index: 5;
		background: rgba(0,0,0,0.85);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	`;


class MediaOptions extends Component {
	constructor() {
		super();
		this.state = {
			socialCircle: [],
			searchMedia: false,
			shareLink: false,
			shareState: false,
			sharePicture: false,
			mediaType: "",
			mediaData: {},
			error: undefined,
			loader: false
		};
	}

	componentDidMount() {
		this.getSocialCircle();
		document.body.style.overflowY = "hidden";
	}

	componentWillUnmount() {
		document.body.style.overflowY = "auto";
	}

	getSocialCircle = () => {
		api.getSocialCircle()
			.then( res => {
				if ( res === "jwt expired" ) {
					refreshToken()
						.then(() => this.getSocialCircle())
						.catch( err => console.log( err ));
				} else {
					this.setState({ socialCircle: res.data });
				}
			}).catch( err => console.log( err ));
	}

	handleChange = e => {
		this.setState({ [ e.target.name ]: e.target.value });
	}

	submitLink = async( description, link, feed, selectedClub, alerts ) => {
		if ( !link ) {
			return;
		}
		const { mentions, hashtags } = await extract(
			description, { symbol: false, type: "all" }
		);

		try {
			const res = await api.createMediaLink( link, description,
				mentions, hashtags, feed, selectedClub, alerts );

			this.props.addPost( res.newPost, this.props.onProfile );
			this.props.switchMediaOptions();
			this.props.toggleMediaButton();
			if ( res.mentionsNotifications ) {
				for ( const notification of res.mentionsNotifications ) {
					this.props.socket.emit( "sendNotification", notification );
				}
			}
		} catch ( err ) {
			console.log( err );
			if ( err.response.data === "jwt expired" ) {
				await refreshToken();
				this.submitLink( description, link, feed, selectedClub, alerts );
				return;
			} else if ( err.response.status === 500 ) {
				this.setState({
					error: ( "Ops, something went wrong on the server. " +
					"Let's just pretend like nothing happened and try again in a few seconds." )
				});
			} else {
				this.setState({ error: err.response.data });
			}
			this.setState({ shareLink: false });
			this.props.toggleMediaButton();
		}
	}

	handleLinkKeyPress = e => {
		if ( e.key === "Enter" ) {
			e.preventDefault();
			this.submitLink();
		}
	}

	switchSearchMedia = media => {
		this.props.toggleMediaButton();
		this.setState({ searchMedia: !this.state.searchMedia, mediaType: media });
	}

	switchLink = () => {
		this.props.toggleMediaButton();
		this.setState({ shareLink: !this.state.shareLink });
	}

	switchPicture = () => {
		this.props.toggleMediaButton();
		this.setState({ sharePicture: !this.state.sharePicture });
	}

	switchState = () => {
		this.props.toggleMediaButton();
		this.setState({ shareState: !this.state.shareState });
	}

	shareTextPost = async( userInput, feed, selectedClub, alerts ) => {
		if ( userInput ) {
			const { mentions, hashtags } = await extract(
				userInput, { symbol: false, type: "all" }
			);
			try {
				const res = await api.createPost(
					userInput, mentions, hashtags, feed, selectedClub, alerts );
				this.props.addPost( res.newPost, this.props.onProfile );
				this.props.switchMediaOptions();
				this.props.toggleMediaButton();
				if ( res.mentionsNotifications ) {
					for ( const notification of res.mentionsNotifications ) {
						this.props.socket.emit( "sendNotification", notification );
					}
				}
			} catch ( err ) {
				if ( err.response.data === "jwt expired" ) {
					await refreshToken();
					this.shareTextPost( userInput, feed, selectedClub, alerts );
				} else {
					console.log( err );
				}
			}
		}
	};

	handlePicture = e => {
		const
			file = e.target.files[ 0 ];

		if ( !file ) {
			return;
		}

		if ( file.type !== "image/jpeg" && file.type !== "image/png"
			&& file.type !== "image/jpg" && file.type !== "image/gif" ) {
			this.setState({
				error: "Only .png/.jpg/.gif/.jpeg images are allowed"
			});
			return;
		}

		if ( file.size > 1010000 ) {
			this.setState({ loader: true });
			compressImage( file ).then( compressedImg => {
				this.setState({
					mediaData: {
						imageFile: compressedImg,
						image: URL.createObjectURL( compressedImg )
					},
					sharePicture: true,
					error: ""
				});
				this.setState({ loader: false });
			}).catch( err => {
				console.log( err );
				this.setState({ err });
			});
		} else {
			this.setState({
				mediaData: {
					imageFile: file,
					image: URL.createObjectURL( file )
				},
				sharePicture: true,
				error: ""
			});
		}
		this.props.toggleMediaButton();
	}

	submitPicture = async( description, feed, selectedClub, alerts ) => {
		var
			data = new FormData();
		const
			{ mediaData } = this.state,
			{ mentions, hashtags } = await extract(
				description, { symbol: false, type: "all" }
			);
		if ( !mediaData.imageFile ) {
			return;
		}
		data.append( "picture", mediaData.imageFile );
		data.append( "content", description );
		data.append( "mentions", mentions );
		data.append( "hashtags", hashtags );
		data.append( "feed", feed );
		data.append( "selectedClub", selectedClub );
		data.append( "nsfw", alerts.nsfw );
		data.append( "spoiler", alerts.spoiler );
		data.append( "spoilerDescription", alerts.spoilerDescription );
		data.append( "token", localStorage.getItem( "token" ));

		try {
			const res = await api.createMediaPicture( data );
			this.props.addPost( res.newPost, this.props.onProfile );
			this.props.switchMediaOptions();
			this.props.toggleMediaButton();
			if ( res.mentionsNotifications && res.mentionsNotifications.length > 0 ) {
				for ( const notification of res.mentionsNotifications ) {
					this.props.socket.emit( "sendNotification", notification );
				}
			}
		} catch ( err ) {
			if ( err.response.data === "jwt expired" ) {
				await refreshToken();
				this.submitPicture( description, feed, selectedClub, alerts );
				return;
			}
			this.setState({ error: err.response.data, sharePicture: false });
			this.props.toggleMediaButton();
		}
	}

	_crop() {
		console.log( this.refs.cropper.getCroppedCanvas().toDataURL());
	}

	render() {
		try {
			this.bookIcon = require( "../images/book.svg" );
			this.musicIcon = require( "../images/music.svg" );
			this.popcornIcon = require( "../images/movies.svg" );
			this.monitorIcon = require( "../images/monitor.svg" );
			this.cameraIcon = require( "../images/camera.svg" );
			this.linkIcon = require( "../images/link.svg" );
			this.pencilIcon = require( "../images/state.svg" );
		} catch ( err ) {
			console.log( err );
		}
		if ( this.state.searchMedia ) {
			return (
				<div>
					<MediaDimmer />
					<StyledSearchMedia
						socket={this.props.socket}
						mediaType={this.state.mediaType}
						switchSearchMedia={this.switchSearchMedia}
						socialCircle={this.state.socialCircle}
						toggleMediaButton={this.props.toggleMediaButton}
					/>
				</div>
			);
		}
		if ( this.state.shareState ) {
			return (
				<div>
					<MediaDimmer />
					<ShareBox
						shareTextPost={this.shareTextPost}
						switchState={this.switchState}
						socialCircle={this.state.socialCircle}
					/>
				</div>
			);
		}
		if ( this.state.shareLink ) {
			return (
				<div>
					<MediaDimmer />
					<ShareLink
						submitLink={this.submitLink}
						switchLink={this.switchLink}
						socialCircle={this.state.socialCircle}
					/>
				</div>
			);
		}
		if ( this.state.sharePicture ) {
			return (
				<div>
					<MediaDimmer />
					<MediaPicture
						mediaData={this.state.mediaData}
						socialCircle={this.state.socialCircle}
						switchPicture={this.switchPicture}
						submitPicture={this.submitPicture}
					/>
				</div>
			);
		}
		return (
			<MediaOptionsWrapper>
				{this.state.loader &&
					<LoaderDimmer>
						<div className="lds-ring"><div></div><div></div><div></div><div></div></div>
					</LoaderDimmer>
				}
				{this.state.error &&
					<ErrorMessage warning>
						<Message.Header>{this.state.error}</Message.Header>
					</ErrorMessage>
				}
				<MediaDimmer />
				<MediaButtons>
					<MediaOption secondary circular icon="book" size="huge"
						onClick={() => this.switchSearchMedia( "book" )}>
						<OptionImage image={this.bookIcon} />
					</MediaOption>

					<MediaOption secondary circular icon="music" size="huge"
						onClick={() => this.switchSearchMedia( "music" )}>
						<OptionImage image={this.musicIcon} />
					</MediaOption>

					<MediaOption secondary circular icon="film" size="huge"
						onClick={() => this.switchSearchMedia( "movie" )}>
						<OptionImage image={this.popcornIcon} />
					</MediaOption>

					<MediaOption secondary circular icon="tv" size="huge"
						onClick={() => this.switchSearchMedia( "tv" )}>
						<OptionImage image={this.monitorIcon} />
					</MediaOption>

					<PictureUploadWrapper>
						<MediaOption secondary circular icon="picture" size="huge"
							onClick={() => document.getElementById( "pictureInput" ).click()}>
							<OptionImage image={this.cameraIcon} />
						</MediaOption>
						<PictureUploadInput type="file" name="picture" id="pictureInput"
							accept="image/*" onChange={this.handlePicture}
						/>
					</PictureUploadWrapper>

					<MediaOption secondary circular icon="linkify" size="huge"
						onClick={this.switchLink}>
						<OptionImage image={this.linkIcon} />
					</MediaOption>

					<MediaOption secondary circular icon="pencil" size="huge"
						onClick={this.switchState}>
						<OptionImage image={this.pencilIcon} />
					</MediaOption>
				</MediaButtons>
			</MediaOptionsWrapper>
		);
	}
}

MediaOptions.propTypes = {
	addPost: PropTypes.func.isRequired,
	switchMediaOptions: PropTypes.func.isRequired,
	toggleMediaButton: PropTypes.func.isRequired,
	onProfile: PropTypes.bool
};

const
	mapStateToProps = state => ({
	}),

	mapDispatchToProps = dispatch => ({
		addPost: ( post, onProfile ) => dispatch( addPost( post, onProfile )),
		switchMediaOptions: () => dispatch( switchMediaOptions())
	});

export default connect( mapStateToProps, mapDispatchToProps )( MediaOptions );
