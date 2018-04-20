import React, { Component } from "react";
import styled from "styled-components";
import { Input, Image, Divider } from "semantic-ui-react";
import axios from "axios";

try {
	const DefaultCover = require( "../images/defaultBook.jpg" );
} catch ( err ) {
	console.log( err );
}

const
	Wrapper = styled.div`
		@media (max-width: 420px) {
			height: 100vh;
			width: 100%;
			display: grid;
			grid-template-columns: 100%;
			grid-template-rows: 12% 83%;
			grid-template-areas:
				"s"
				"r"
		}
	`,
	SearchWrapper = styled.div`
		@media (max-width: 420px) {
			grid-area: s;
			display: grid;
			border-bottom: 1px solid #D3D3D3;
		}
	`,
	SearchInput = styled( Input )`
	@media (max-width: 420px) {
		width: 80%;
		justify-self: center;
		align-self: center;
	}
	`,
	ResultsWrapper = styled.div`
		@media (max-width: 420px) {
			grid-area: r;
		}
	`,
	BookWrapper = styled.div`
	@media (max-width: 420px) {
		margin: 25px 0px;
		display: grid;
		grid-template-columns: 40% 50%;
		grid-template-rows: 100%;
		grid-template-areas:
			"img inf"
	}
	`,
	BookImage = styled( Image )`
	@media (max-width: 420px) {
		grid-area: img;
		justify-self: center;
		width: 128px;
		height: 194px;
	}
	`,
	BookInfo = styled.div`
	@media (max-width: 420px) {
		grid-area: inf;
	}
	`;

class SearchMedia extends Component {
	constructor() {
		super();
		this.state = {
			search: "",
			results: []
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

	render() {
		return (
			<Wrapper>
				<SearchWrapper>
					<SearchInput
						icon="search"
						name="search"
						placeholder="Search..."
						onChange={this.handleChange}
						onKeyPress={this.handleKeyPress}
					/>
				</SearchWrapper>
				<ResultsWrapper>
					{this.state.results.map(( book, index ) =>
						<div>
							<BookWrapper key={index}>
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
			</Wrapper>
		);
	}
}

export default SearchMedia;
