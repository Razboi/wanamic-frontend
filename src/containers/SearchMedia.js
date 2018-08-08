import React, { Component } from "react";
import styled from "styled-components";
import { Input, Image, Divider, Icon } from "semantic-ui-react";
import axios from "axios";
import api from "../services/api";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { addPost, switchMediaOptions } from "../services/actions/posts";
import MediaStep2 from "../components/MediaStep2";
import MediaStep3 from "../components/MediaStep3";
import refreshToken from "../utils/refreshToken";
import extract from "../utils/extractMentionsHashtags";

const
	Wrapper = styled.div`
		z-index: 2;
		height: 100vh;
		width: 100%;
		position: fixed;
		color: #fff !important;
		font-family: inherit !important;
	`,
	Main = styled.div`
		z-index: 3;
		height: 100%;
		background: #333;
	`,
	Header = styled.div`
		height: 50px;
		width: 100%;
		display: flex;
		align-items: center;
		padding-left: 10px;
		color: #fff;
		box-shadow: 0 1px 2px #111;
		@media (min-width: 420px) {
			background: #111;
			height: 60px;
			padding: 0px 40px;
			i {
				font-size: 1.5rem !important;
				:hover {
					cursor: pointer !important;
				}
			}
		}
	`,
	HeaderTxt = styled.span`
		margin: auto;
		font-weight: bold;
		font-size: 16px;
		@media (min-width: 420px) {
			display: none;
		};
	`,
	SmallScreenSearch = styled.div`
		height: 44px;
		display: flex;
		width: 100%;
		align-items: center;
		justify-content: center;
		position: fixed;
		bottom: 10px;
		z-index: 3;
		@media (min-width: 420px) {
			display: none;
		};
	`,
	BigScreenSearch = styled.div`
		height: 100%;
		display: flex;
		width: 100%;
		max-width: 1080px;
		align-items: center;
		justify-content: center;
		z-index: 3;
		margin: auto;
		@media (max-width: 420px) {
			display: none;
		};
	`,
	SearchInput = styled( Input )`
		height: 34px;
		justify-self: center;
		align-self: center;
		input {
			text-align: center !important;
			font-family: inherit !important;
			::placeholder {
				font-family: inherit !important;
			}
		};
		@media (max-width: 420px) {
			width: 90%;
			input {
				color: #333 !important;
				::placeholder {
					color: #555 !important;
				}
			};
		};
		@media (min-width: 420px) {
			width: 100%;
			input {
				border: none !important;
				background: none !important;
				color: #fff !important;
				font-size: 1.29rem !important;
				font-weight: 600 !important;
				::placeholder {
					color: #ccc !important;
				};
			};
			i {
				display: none !important;
			};
		};
	`,
	Results = styled.div`
		display: flex;
		flex-direction: column;
		overflow-y: auto;
		height: 100%;
		padding-bottom: 5rem;
		@media (max-width: 420px) {
			::-webkit-scrollbar {
			display: none !important;
			};
		};
		@media (min-width: 420px) {
			width: 800px;
			background: #111;
			margin: 1rem auto 0 auto;
			::-webkit-scrollbar {
				display: block !important;
				background: #fff !important;
				width: 10px !important;
			};
		};
	`,
	ResultMediaWrapper = styled.div`
		margin: 25px 0px;
		display: flex;
		align-items: start;
		padding: 0 1rem;
		:hover {
			cursor: pointer;
		}
	`,
	MediaTitle = styled.h3`
		font-family: inherit;
		font-size: 1rem;
		@media (min-width:420px) {
			font-size: 1.2rem !important;
		}
	`,
	ResultMediaInfo = styled.div`
		align-self: start;
		margin-left: 1rem;
	`,
	ArtistName = styled.div`
		font-size: 1.05rem;
		margin-bottom: 1rem;
	`,
	CollectionName = styled.div`
		font-size: 1rem;
	`;


class SearchMedia extends Component {
	constructor() {
		super();
		this.state = {
			search: "",
			results: [],
			step: 1,
			mediaData: null,
			description: "",
			privacyRange: 1,
			checkNsfw: false,
			checkSpoiler: false,
			spoilerDescription: "",
			mentions: [],
			mediaType: ""
		};
		this.itunesAPI = "";
		this.searchPlaceholder = "";
	}

	componentDidMount() {
		this.setupParams();
	}

	handleChange = e => {
		this.setState({ [ e.target.name ]: e.target.value });
	}

	handleKeyPress = e => {
		if ( e.key === "Enter" ) {
			this.itunesSearch();
		}
	}

	setupParams = () => {
		switch ( this.props.mediaType ) {
		case "book":
			this.setState({ mediaType: "books" });
			this.searchPlaceholder = "Search books by title or author.";
			this.itunesAPI =
				"https://itunes.apple.com/search?limit=11&media=ebook&term=";
			this.itunesSearch();
			break;
		case "music":
			this.setState({ mediaType: "music" });
			this.searchPlaceholder = "Search music by track, artist or album.";
			this.itunesAPI =
				"https://itunes.apple.com/search?limit=11&media=music&term=";
			this.itunesSearch();
			break;
		case "movie":
			this.setState({ mediaType: "movies" });
			this.searchPlaceholder = "Search movies by title, director or actor.";
			this.itunesAPI =
				"https://itunes.apple.com/search?limit=11&media=movie&term=";
			this.itunesSearch();
			break;
		case "tv":
			this.setState({ mediaType: "TV shows" });
			this.searchPlaceholder = "Search TV shows.";
			this.itunesAPI =
				"https://itunes.apple.com/search?limit=11&media=tvShow&term=";
			this.itunesSearch();
			break;
		default:
			this.setState({ mediaType: "books" });
			this.searchPlaceholder = "Search books by title or author.";
			this.itunesAPI =
				"https://itunes.apple.com/search?limit=11&media=ebook&term=";
			this.itunesSearch();
		}
	}

	itunesSearch = () => {
		if ( this.state.search ) {
			axios.get( this.itunesAPI + this.state.search )
				.then( res => this.setState({ results: res.data.results }))
				.catch( err => console.log( err ));
		}
	}

	handleSelected = media => {
		const mediaData = {
			title: media.trackName,
			artist: media.artistName,
			image: media.artworkUrl100.replace( "100x100bb", "200x200bb" ),
			url: media.trackViewUrl
		};
		this.setState({ mediaData: mediaData, step: this.state.step + 1 });
	}

	nextStep = description => {
		this.setState({
			step: this.state.step + 1,
			description: description
		});
	}

	prevStep = () => {
		this.setState({ step: this.state.step - 1 });
	}

	handleSubmit = async() => {
		var
			i,
			finalData = this.state.mediaData;
		const
			{ description, privacyRange, checkNsfw, checkSpoiler,
				spoilerDescription } = this.state,
			{ mentions, hashtags } = await extract(
				description, { symbol: false, type: "all" }
			);
		finalData.mentions = mentions;
		finalData.hashtags = hashtags;
		finalData.content = description;
		finalData.privacyRange = privacyRange;
		finalData.alerts = {
			nsfw: checkNsfw,
			spoiler: checkSpoiler,
			spoilerDescription: spoilerDescription
		};

		api.createMediaPost( finalData )
			.then( res => {
				if ( res === "jwt expired" ) {
					refreshToken()
						.then(() => this.handleSubmit())
						.catch( err => console.log( err ));
				} else if ( res ) {
					this.props.addPost( res.newPost );
					this.props.switchMediaOptions();
					this.props.toggleMediaButton();

					if ( res.mentionsNotifications ) {
						const notifLength = res.mentionsNotifications.length;
						for ( i = 0; i < notifLength; i++ ) {
							this.props.socket.emit(
								"sendNotification", res.mentionsNotifications[ i ]
							);
						}
					}
				}
			}).catch( err => console.log( err ));
	}

	setPrivacyRange = range => {
		this.setState({ privacyRange: range });
	}

	handleCheck = ( e, semanticUiProps ) => {
		this.setState({ [ semanticUiProps.name ]: semanticUiProps.checked });
	}

	render() {
		if ( this.state.step === 2 ) {
			return (
				<MediaStep2
					socialCircle={this.props.socialCircle}
					handleChange={this.handleChange}
					prevStep={this.prevStep}
					nextStep={this.nextStep}
					mediaData={this.state.mediaData}
					description={this.state.description}
				/>
			);
		}
		if ( this.state.step === 3 ) {
			return (
				<MediaStep3
					handleCheck={this.handleCheck}
					setPrivacyRange={this.setPrivacyRange}
					prevStep={this.prevStep}
					handleSubmit={this.handleSubmit}
					mediaData={this.state.mediaData}
					privacyRange={this.state.privacyRange}
					spoilers={this.state.checkSpoiler}
					handleChange={this.handleChange}
				/>
			);
		}
		return (
			<Wrapper>
				<Main>
					<Header>
						<Icon
							name="arrow left"
							onClick={() => this.props.switchSearchMedia()}
						/>
						<HeaderTxt>Share {this.state.mediaType}</HeaderTxt>
						<BigScreenSearch>
							<SearchInput
								autoFocus
								value={this.state.search}
								icon="search"
								name="search"
								placeholder={this.searchPlaceholder}
								onChange={this.handleChange}
								onKeyPress={this.handleKeyPress}
							/>
						</BigScreenSearch>
					</Header>
					<Results className="mediaResults">
						{this.state.results.map(( media, index ) =>
							<div key={index}>
								<ResultMediaWrapper onClick={() => this.handleSelected( media )}>
									<Image
										src={media.artworkUrl100.replace( "100x100bb", "200x200bb" )}
									/>

									<ResultMediaInfo>
										<MediaTitle>
											{media.trackName}
										</MediaTitle>
										<ArtistName>{media.artistName}</ArtistName>
										<CollectionName>{media.collectionName}</CollectionName>
									</ResultMediaInfo>
								</ResultMediaWrapper>
								<Divider />
							</div>
						)}
					</Results>
					<SmallScreenSearch>
						<SearchInput
							autoFocus
							value={this.state.search}
							icon="search"
							name="search"
							placeholder={this.searchPlaceholder}
							onChange={this.handleChange}
							onKeyPress={this.handleKeyPress}
						/>
					</SmallScreenSearch>
				</Main>
			</Wrapper>
		);
	}
}

SearchMedia.propTypes = {
	mediaType: PropTypes.string.isRequired,
	switchSearchMedia: PropTypes.func.isRequired
};

const
	mapStateToProps = state => ({
	}),

	mapDispatchToProps = dispatch => ({
		addPost: post => dispatch( addPost( post )),
		switchMediaOptions: () => dispatch( switchMediaOptions())
	});

export default connect( mapStateToProps, mapDispatchToProps )( SearchMedia );
