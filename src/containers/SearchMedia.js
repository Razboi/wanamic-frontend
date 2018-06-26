import React, { Component } from "react";
import styled from "styled-components";
import { Input, Image, Divider, Button, Icon } from "semantic-ui-react";
import axios from "axios";
import api from "../services/api";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { addPost, switchMediaOptions } from "../services/actions/posts";
import MediaStep2 from "../components/MediaStep2";
import MediaStep3 from "../components/MediaStep3";
import refreshToken from "../utils/refreshToken";
import extract from "mention-hashtag";

var itunesAPI;

const
	Wrapper = styled.div`
		z-index: 2;
		height: 100vh;
		width: 100%;
		position: fixed;
		display: grid;
		grid-template-columns: 100%;
		grid-template-rows: 7% 10% 83%;
		grid-template-areas:
			"h"
			"s"
			"r"
	`,
	HeaderWrapper = styled.div`
		grid-area: h;
		display: flex;
		align-items: center;
		padding-left: 10px;
		border-bottom: 1px solid rgba(0, 0, 0, .5);
	`,
	HeaderTxt = styled.span`
		margin-left: 15px;
		font-weight: bold;
		font-size: 16px;
	`,
	SearchWrapper = styled.div`
		grid-area: s;
		display: grid;
		border-bottom: 1px solid #D3D3D3;
	`,
	SearchInput = styled( Input )`
		width: 90%;
		justify-self: center;
		align-self: center;
	`,
	ResultsWrapper = styled.div`
		overflow-y: scroll;
		grid-area: r;
	`,
	ResultMediaWrapper = styled.div`
		margin: 25px 0px;
		display: grid;
		grid-template-columns: 40% 50%;
		grid-template-rows: 100%;
		grid-template-areas:
			"img inf"
	`,
	ResultMediaImage = styled( Image )`
		grid-area: img;
		justify-self: center;
		width: 128px;
		height: 194px;
	`,
	ResultMediaInfo = styled.div`
		grid-area: inf;
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
			mentions: []
		};
	}

	handleChange = e => {
		this.setState({ [ e.target.name ]: e.target.value });
	}

	handleKeyPress = e => {
		if ( e.key === "Enter" ) {
			this.handleSearch();
		}
	}

	handleSearch = () => {
		if ( this.state.search ) {
			switch ( this.props.mediaType ) {
			case "book":
				itunesAPI =
					"https://itunes.apple.com/search?limit=11&media=ebook&term=";
				this.itunesSearch();
				break;
			case "music":
				itunesAPI =
					"https://itunes.apple.com/search?limit=11&media=music&term=";
				this.itunesSearch();
				break;
			case "movie":
				itunesAPI =
					"https://itunes.apple.com/search?limit=11&media=movie&term=";
				this.itunesSearch();
				break;
			case "tv":
				itunesAPI =
					"https://itunes.apple.com/search?limit=11&media=tvShow&term=";
				this.itunesSearch();
				break;
			default:
				itunesAPI =
					"https://itunes.apple.com/search?limit=11&media=ebook&term=";
				this.itunesSearch();
			}
		}
	}

	itunesSearch = () => {
		axios.get( itunesAPI + this.state.search )
			.then( res => this.setState({ results: res.data.results }))
			.catch( err => console.log( err ));
	}

	handleSelected = media => {
		const mediaData = {
			title: media.trackName,
			artist: media.artistName,
			image: media.artworkUrl100.replace( "100x100bb", "200x200bb" )
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
			{ description, privacyRange, checkNsfw, checkSpoiler } = this.state,
			{ mentions, hashtags } = await extract(
				description, { symbol: false, type: "all" }
			);
		finalData.mentions = mentions;
		finalData.hashtags = hashtags;
		finalData.content = description;
		finalData.privacyRange = privacyRange;
		finalData.alerts = {
			nsfw: checkNsfw,
			spoiler: checkSpoiler
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
				/>
			);
		}
		return (
			<Wrapper>
				<HeaderWrapper>
					<Icon
						name="arrow left"
						onClick={() => this.props.switchSearchMedia()}
					/>
					<HeaderTxt>Comments</HeaderTxt>
				</HeaderWrapper>
				<SearchWrapper>
					<SearchInput
						value={this.state.search}
						icon="search"
						name="search"
						placeholder="Search..."
						onChange={this.handleChange}
						onKeyPress={this.handleKeyPress}
					/>
				</SearchWrapper>
				<ResultsWrapper className="mediaResults">
					{this.state.results.map(( media, index ) =>
						<div key={index}>
							<ResultMediaWrapper onClick={() => this.handleSelected( media )}>
								<ResultMediaInfo>
									<h3>{media.trackName}</h3>
									<span>{media.artistName}</span>
								</ResultMediaInfo>

								<ResultMediaImage
									src={media.artworkUrl100.replace( "100x100bb", "200x200bb" )}
								/>
							</ResultMediaWrapper>
							<Divider />
						</div>
					)}
				</ResultsWrapper>
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
