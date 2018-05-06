import React, { Component } from "react";
import styled from "styled-components";
import { Input, Image, Divider, Button, Checkbox } from "semantic-ui-react";
import axios from "axios";
import api from "../services/api";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { addPost, switchMediaOptions } from "../services/actions/posts";

var DefaultCover;
try {
	DefaultCover = require( "../images/defaultBook.jpg" );
} catch ( err ) {
	console.log( err );
}

const
	Wrapper = styled.div`
		z-index: 2;
		height: 100vh;
		width: 100%;
		display: grid;
		grid-template-columns: 100%;
		grid-template-rows: 12% 88%;
		grid-template-areas:
			"s"
			"r"
	`,
	SearchWrapper = styled.div`
		grid-area: s;
		display: grid;
		border-bottom: 1px solid #D3D3D3;
	`,
	SearchInput = styled( Input )`
		width: 80%;
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
	`,
	SelectedWrapper = styled.div`
		overflow: hidden;
	`,
	ShareWrapper = styled.div`
		position: absolute;
		height: 100vh;
		width: 100%;
		display: grid;
		grid-template-columns: 100%;
		grid-template-rows: 35% 65%;
		grid-template-areas:
			"inp"
			"img"
	`,
	ContentInputWrapper = styled.div`
		grid-area: inp;
		display: grid;
		padding-bottom: 40px;
	`,
	UserContentInput = styled( Input )`
		width: 80%;
		justify-self: center;
		align-self: end;
		z-index: 2;
	`,
	SelectedMediaImgWrapper = styled.div`
		grid-area: img;
		display: grid;
	`,
	SelectedMediaBackground = styled.div`
		height: 100vh;
		background-image: url(${props => props.background});
		background-size: cover;
		filter: blur(20px) brightness(50%);
		transform: scale(1.2);
	`,
	SelectedMediaImg = styled( Image )`
		width: 128px;
		height: 194px;
		justify-self: center;
		align-self: start;
		z-index: 2;
	`,
	BackButton = styled( Button )`
		position: absolute;
		bottom: 5px;
		left: 5px;
	`,
	ShareButton = styled( Button )`
		position: absolute;
		bottom: 5px;
		right: 5px;
	`,
	SwapBackButton = styled( Button )`
		position: fixed;
		bottom: 5px;
		left: 5px;
	`,
	ShareOptionsWrapper = styled.div`
		height: 100%;
		width: 100%;
		position: absolute;
		z-index: 2;
		display: grid;
		grid-template-columns: 100%;
		grid-template-rows: 40% 60%;
		grid-template-areas:
			"so"
			"al"
	`,
	ShareOptions = styled.div`
		grid-area: so;
		padding: 10px;
		color: #fff !important;
		display: flex;
		flex-direction: column;
	`,
	AlertsWrapper = styled.div`
		grid-area: al;
		color: #fff !important;
		justify-self: center;
	`,
	Alerts = styled.div`
		display: flex;
		flex-direction: column;
		text-align: center;
	`,
	AlertCheck = styled.span`
		display: flex;
		margin-top: 10px;
	`,
	AlertLabel = styled.b`
		margin-left: 10px;
		font-size: 16px;
	`,
	PrivacySlider = styled.div`
		background: ${props => props.range === 2 &&
			"linear-gradient(to right, #134f7c 50%, rgba(0,0,0,0.75) 50%) !important" };
		background: ${props => props.range === 3 && "#134f7c !important"};
		background: rgba(0,0,0,0.75);
		border-radius: 25px;
		width: 70%;
		align-self: center;
		display: flex;
		justify-content: space-between;
	`,
	PrivacyButton = styled( Button )`
		margin: 0px !important;
	`,
	SliderHeader = styled.h4`
		text-align: center;
		align-self: center;
	`;

class SearchMedia extends Component {
	constructor() {
		super();
		this.state = {
			search: "",
			results: [],
			step: 1,
			mediaData: null,
			userInput: "",
			privacyRange: 1,
			checkNsfw: false,
			checkSpoiler: false
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
				this.bookSearch();
				break;
			case "music":
				this.musicSearch();
				break;
			case "movie":
				this.movieSearch();
				break;
			case "tv":
				this.TVSearch();
				break;
			default:
				this.bookSearch();
			}
		}
	}

	bookSearch = () => {
		const itunesAPI = "https://itunes.apple.com/search?limit=11&media=ebook&term=";
		axios.get( itunesAPI + this.state.search )
			.then( res => this.setState({ results: res.data.results }))
			.catch( err => console.log( err ));
	}

	musicSearch = () => {
		const itunesAPI = "https://itunes.apple.com/search?limit=11&media=music&term=";
		axios.get( itunesAPI + this.state.search )
			.then( res => this.setState({ results: res.data.results }))
			.catch( err => console.log( err ));
	}

	movieSearch = () => {
		const itunesAPI = "https://itunes.apple.com/search?limit=11&media=movie&term=";
		axios.get( itunesAPI + this.state.search )
			.then( res => this.setState({ results: res.data.results }))
			.catch( err => console.log( err ));
	}

	TVSearch = () => {
		const itunesAPI = "https://itunes.apple.com/search?limit=11&media=tvShow&term=";
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

	nextStep = () => {
		this.setState({ step: this.state.step + 1 });
	}

	prevStep = () => {
		this.setState({ step: this.state.step - 1 });
	}

	handleSubmit = () => {
		var finalData = this.state.mediaData;
		finalData.content = this.state.userInput;
		finalData.privacyRange = this.state.privacyRange;
		finalData.alerts = { nsfw: this.state.checkNsfw,
			spoiler: this.state.checkSpoiler
		};

		api.createMediaPost( finalData )
			.then( newPost => {
				this.props.addPost( newPost );
				this.props.switchMediaOptions();
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
				<SelectedWrapper>
					<ShareWrapper>
						<ContentInputWrapper>
							<UserContentInput
								name="userInput"
								value={this.state.userInput}
								placeholder="Share your opinion..."
								onChange={this.handleChange}
							/>
						</ContentInputWrapper>
						<SelectedMediaImgWrapper>
							{this.state.mediaData && this.state.mediaData.image ?
								<SelectedMediaImg src={this.state.mediaData.image} />
								:
								<SelectedMediaImg
									src={DefaultCover}
								/>
							}
						</SelectedMediaImgWrapper>
					</ShareWrapper>
					{this.state.mediaData && this.state.mediaData.image ?
						<SelectedMediaBackground background={this.state.mediaData.image} />
						:
						<SelectedMediaBackground
							background={DefaultCover}
						/>
					}
					<BackButton secondary content="Back" onClick={this.prevStep} />
					<ShareButton primary content="Next" onClick={this.nextStep} />
				</SelectedWrapper>
			);
		}
		if ( this.state.step === 3 ) {
			return (
				<div>
					<ShareOptionsWrapper>
						<ShareOptions>
							<h3>Share with</h3>
							<SliderHeader>
								{this.state.shareRange === 1 && "Friends"}
								{this.state.shareRange === 2 && "Friends and Followers"}
								{this.state.shareRange === 3 &&
									"Everybody (will be included in the explore page)"}
							</SliderHeader>
							<PrivacySlider range={this.state.privacyRange}>
								<PrivacyButton
									primary
									circular
									icon="users"
									size="huge"
									onClick={() => this.setPrivacyRange( 1 )}
								/>
								<PrivacyButton
									primary={this.state.privacyRange >= 2 && true}
									circular
									icon="binoculars"
									size="huge"
									onClick={() => this.setPrivacyRange( 2 )}
								/>
								<PrivacyButton
									primary={this.state.privacyRange === 3 && true}
									circular
									icon="globe"
									size="huge"
									onClick={() => this.setPrivacyRange( 3 )}
								/>
							</PrivacySlider>
						</ShareOptions>
						<AlertsWrapper>
							<h4>Alerts</h4>
							<Alerts>
								<AlertCheck>
									<Checkbox name="checkNsfw" onChange={this.handleCheck}/>
									<AlertLabel>+18</AlertLabel>
								</AlertCheck>
								<AlertCheck>
									<Checkbox name="checkSpoiler" onChange={this.handleCheck}/>
									<AlertLabel>Spoiler</AlertLabel>
								</AlertCheck>
							</Alerts>
						</AlertsWrapper>
						<BackButton secondary content="Back" onClick={this.prevStep} />
						<ShareButton primary content="Done" onClick={this.handleSubmit} />
					</ShareOptionsWrapper>
					{this.state.mediaData && this.state.mediaData.image ?
						<SelectedMediaBackground background={this.state.mediaData.image} />
						:
						<SelectedMediaBackground
							background={DefaultCover}
						/>
					}
					<BackButton secondary content="Back" onClick={this.prevStep} />
					<ShareButton primary content="Next" onClick={this.nextStep} />
				</div>
			);
		}
		return (
			<Wrapper>
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
								{media.artworkUrl100
									?
									<ResultMediaImage
										src={media.artworkUrl100.replace( "100x100bb", "200x200bb" )}
									/>
									:
									<ResultMediaImage src={DefaultCover} />
								}
							</ResultMediaWrapper>
							<Divider />
						</div>
					)}
				</ResultsWrapper>
				<SwapBackButton secondary content="Cancel"
					onClick={() => this.props.switchSearchMedia( undefined )} />
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
