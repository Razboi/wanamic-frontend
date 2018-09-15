import React, { Component } from "react";
import styled from "styled-components";
import { Button, Input } from "semantic-ui-react";
import PropTypes from "prop-types";

const
	Wrapper = styled.div`
		height: 100vh;
		width: 100%;
		margin-top: 1rem;
		padding: 2rem;
		overflow: hidden;
		h1 {
			text-align: center;
			font-family: inherit;
		}
		@media (min-width: 800px) {
			width: 50%;
			max-width: 600px;
			height: 800px;
			background: #fff;
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
	`;

class ExploreClubs extends Component {
	handleKeyPress = e => {
		if ( e.key === "Enter" ) {
			this.props.searchClub();
		}
	}

	render() {
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
							placeholder="programming"
							onKeyPress={this.handleKeyPress}
							onChange={this.props.handleChange}
						/>
					</SearchWrapper>
				</Options>
			</Wrapper>
		);
	}
}

ExploreClubs.propTypes = {
	randomClub: PropTypes.func.isRequired,
	handleChange: PropTypes.func.isRequired,
	searchClub: PropTypes.func.isRequired
};

export default ExploreClubs;
