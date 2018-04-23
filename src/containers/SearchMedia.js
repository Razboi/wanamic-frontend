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
	BookWrapper = styled.div`
		margin: 25px 0px;
		display: grid;
		grid-template-columns: 40% 50%;
		grid-template-rows: 100%;
		grid-template-areas:
			"img inf"
	`,
	BookImage = styled( Image )`
		grid-area: img;
		justify-self: center;
		width: 128px;
		height: 194px;
	`,
	BookInfo = styled.div`
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
	MediaImgWrapper = styled.div`
		grid-area: img;
		display: grid;
	`,
	MediaBackground = styled.div`
		height: 100vh;
		background-image: url(${props => props.background});
		background-size: cover;
		filter: blur(20px) brightness(50%);
		transform: scale(1.2);
	`,
	MediaImg = styled( Image )`
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

class SearchMedia extends Component {
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
			const googleBooksAPI = "https://www.googleapis.com/books/v1/volumes?q=";
			axios.get( googleBooksAPI + this.state.search + "&langRestrict=en" +
			"&orderBy=relevance" )
				.then( res => this.setState({ results: res.data.items }))
				.catch( err => console.log( err ));
		}
	}

	handleSelected = media => {
		const mediaData = {
			title: media.volumeInfo.title,
			image: media.volumeInfo.imageLinks.thumbnail
		};
		this.setState({ selected: true, mediaData: mediaData });
	}

	handleSubmit = () => {
		var finalData = this.state.mediaData;
		finalData.content = this.state.userInput;
		api.createMediaPost( localStorage.getItem( "token" ), finalData );
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
						<MediaImgWrapper>
							<MediaImg src={this.state.mediaData.image} />
						</MediaImgWrapper>
					</ShareWrapper>
					<MediaBackground background={this.state.mediaData.image} />
					<BackButton secondary content="Back" onClick={this.handleBack} />
					<ShareButton primary content="Done" onClick={this.handleSubmit} />
				</SelectedWrapper>
			);
		} else {
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
					<ResultsWrapper>
						{this.state.results.map(( book, index ) =>
							<div key={index}>
								<BookWrapper onClick={() => this.handleSelected( book )}>
									<BookInfo>
										<h3>{book.volumeInfo.title}</h3>
										{book.volumeInfo.authors &&
											<span>{book.volumeInfo.authors[ 0 ]}</span>
										}
									</BookInfo>
									{book.volumeInfo.imageLinks && book.volumeInfo.imageLinks.thumbnail
										?
										<BookImage src={book.volumeInfo.imageLinks.thumbnail} />
										:
										<BookImage src={DefaultCover} />
									}
								</BookWrapper>
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
}

export default SearchMedia;
