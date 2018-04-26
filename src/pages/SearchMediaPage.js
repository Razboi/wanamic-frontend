import React, { Component } from "react";
import styled from "styled-components";
import { Input, Image, Divider, Button } from "semantic-ui-react";
import axios from "axios";
import api from "../services/api";

var DefaultCover;
try {
	DefaultCover = require( "../images/defaultBook.jpg" );
} catch ( err ) {
	console.log( err );
}

const
	Wrapper = styled.div`
		height: 100vh;
		width: 100%;
		display: grid;
		grid-template-columns: 100%;
		grid-template-rows: 12% 83%;
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
	`;

class SearchMediaPage extends Component {
	constructor() {
		super();
		this.state = {
			search: "",
			results: [],
			selected: false,
			mediaData: null,
			userInput: ""
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
			switch ( this.props.match.params.mediaType ) {
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
		this.setState({ selected: true, mediaData: mediaData });
	}

	handleSubmit = () => {
		var finalData = this.state.mediaData;
		finalData.content = this.state.userInput;
		api.createMediaPost( finalData );
		this.props.history.push( "/" );
	}

	handleBack = () => {
		this.setState({ selected: false });
	}

	render() {
		if ( this.state.selected ) {
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
					<BackButton secondary content="Back" onClick={this.handleBack} />
					<ShareButton primary content="Done" onClick={this.handleSubmit} />
				</SelectedWrapper>
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
										src={media.artworkUrl100.replace( "100x100bb", "200x200bb" )} />
									:
									<ResultMediaImage src={DefaultCover} />
								}
							</ResultMediaWrapper>
							<Divider />
						</div>
					)}
				</ResultsWrapper>
				<SwapBackButton secondary content="Cancel"
					onClick={() => this.props.history.push( "/" )} />
			</Wrapper>
		);
	}
}

export default SearchMediaPage;
