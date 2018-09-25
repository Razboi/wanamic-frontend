import React, { Component } from "react";
import styled from "styled-components";
import { Button, Input, Header } from "semantic-ui-react";
import PropTypes from "prop-types";

const
	Wrapper = styled.div`
		height: 100vh;
		width: 100%;
		margin-top: 1rem;
		overflow: hidden;
		background: #fff;
		h1 {
			text-align: center;
			font-family: inherit;
		}
		@media (min-width: 800px) {
			padding: 2rem;
			width: 50%;
			max-width: 600px;
			height: 800px;
		}
	`,
	Options = styled.div`
		height: 100%;
		width: 100%;
		display: flex;
    flex-direction: column;
    justify-content: space-evenly;
	`,
	ButtonsWrapper = styled.div`
		display: flex;
		flex-direction: column;
		align-items: center;
	`,
	SugestedHeader = styled.h2`
		margin: 0px;
		text-align: center;
		color: #222;
		align-self: center;
		font-family: inherit;
		margin-bottom: 2rem;
		font-weight: 400;
    font-size: 1.3rem;
	`,
	RandomButton = styled( Button )`
		font-family: inherit !important;
		border-radius: 2px !important;
	`,
	SearchWrapper = styled.div`
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		position: relative;
		h2 {
			font-weight: 400;
    	font-size: 1.3rem;
			font-family: inherit;
			color: #111;
			text-align: center;
		}
	`,
	SearchBar = styled( Input )`
		margin-top: 10px;
		width: 90%;
		font-family: inherit !important;
		input {
			text-align: center !important;
			font-family: inherit !important;
			::placeholder {
				color: #666 !important;
			};
		};
		i {
			color: rgb(133, 217, 191) !important;
		};
	`,
	Suggestions = styled.div`
		position: absolute;
		z-index: 2;
		width: 50%;
		height: 200px;
		top: -170px;
		background: #fff;
		box-shadow: 2px 2px 2px rgba(0,0,0,0.15);
		border: 1px solid rgba(0,0,0,0.1);
		border-radius: 2px;
		overflow-y: auto;
		padding: 1rem 5px;
		::-webkit-scrollbar {
			display: block !important;
			width: 5px !important;
		}
		@media (max-width: 800px) {
			position: fixed;
			top: 50px;
			right: auto;
			width: 100%;
		}
	`,
	Suggestion = styled( Header )`
		display: flex;
		flex-direction: row;
		margin-top: 0px !important;
		font-family: inherit !important;
		:hover {
			cursor: pointer;
		}
	`;

class ExploreClubs extends Component {
	render() {
		let { searchSuggestions, loading } = this.props;
		return (
			<Wrapper>
				<h1>Explore Clubs</h1>
				<Options>
					<ButtonsWrapper>
						<SugestedHeader>
							Explore random clubs. You never know what you will find.
						</SugestedHeader>
						<RandomButton
							primary
							content="EXPLORE"
							onClick={this.props.randomClub}
						/>
					</ButtonsWrapper>
					<SearchWrapper>
						<h2>Search a club by name</h2>
						<SearchBar
							icon="search"
							name="clubSearch"
							placeholder="movies"
							onKeyPress={this.handleKeyPress}
							onChange={this.props.handleChange}
						/>

						{( searchSuggestions || loading ) &&
							<Suggestions>
								{loading ?
									<div className="lds-ring"><div></div><div></div><div></div><div></div></div>
									:
									searchSuggestions.length > 0 ?
										searchSuggestions.map(( club, i ) =>
											<Suggestion
												key={i}
												onClick={() =>
													this.props.history.push( `/c/${club.name}` )}
											>
												{club.title}
											</Suggestion>
										)
										:
										<h2>No results</h2>
								}
							</Suggestions>
						}
					</SearchWrapper>
				</Options>
			</Wrapper>
		);
	}
}

ExploreClubs.propTypes = {
	randomClub: PropTypes.func.isRequired,
	handleChange: PropTypes.func.isRequired,
	searchSuggestions: PropTypes.array,
	loading: PropTypes.bool
};

export default ExploreClubs;
