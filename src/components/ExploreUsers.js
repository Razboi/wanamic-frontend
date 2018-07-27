import React, { Component } from "react";
import styled from "styled-components";
import { Button, Divider, Input } from "semantic-ui-react";
import PropTypes from "prop-types";

const
	Wrapper = styled.div`
		height: 100%;
		width: 100%;
		margin-top: 1rem;
		display: grid;
		grid-template-columns: 100%;
		grid-template-rows: 30% 15% 20% 20%;
		grid-template-areas:
			"b"
			"s"
			"i"
			"u";
		@media (min-width: 420px) {
			width: 800px;
			margin: auto;
	    margin-bottom: 4rem;
	    background: #fff;
	    border: 1px solid rgba(0,0,0,0.1);
		}
	`,
	ButtonsWrapper = styled.div`
		grid-area: b;
		display: grid;
		grid-template-columns: 50% 50%;
		grid-template-rows: 40% 60%;
		grid-template-areas:
			"h h"
			"rb sb";
		@media (max-width: 420px) {
		}
	`,
	SugestedHeader = styled.h4`
		grid-area: h;
		margin: 0px;
		text-align: center;
		color: #222;
		align-self: center;
		font-family: inherit;
		@media (max-width: 420px) {
		}
	`,
	SugestedButton = styled( Button )`
		grid-area: sb;
		justify-self: center;
		align-self: center;
		font-family: inherit !important;
		background: rgb(133, 217, 191) !important;
		border-radius: 2px !important;
		@media (max-width: 420px) {
		}
	`,
	RandomButton = styled( Button )`
		grid-area: rb;
		justify-self: center;
		align-self: center;
		color: rgb(133, 217, 191) !important;
		border: 1px solid rgb(133, 217, 191) !important;
		background: #fff !important;
		font-family: inherit !important;
		border-radius: 2px !important;
		@media (max-width: 420px) {
		}
	`,
	SeparatorWrapper = styled( Divider )`
		grid-area: s;
		color: rgba(0,0,0,0.40) !important;
		:before, :after {
			position: static !important;
		}
		@media (max-width: 420px) {
		}
	`,
	InterestsWrapper = styled.div`
		grid-area: i;
		display: grid;
		grid-template-columns: 100%;
		grid-template-rows: 25% 75%;
		grid-template-areas:
			"ih"
			"is";
		@media (max-width: 420px) {
		}
	`,
	InterestsHeader = styled.h4`
		grid-area: ih;
		margin: 0px;
		justify-self: center;
		align-self: flex-end;
		font-family: inherit;
		color: #333;
		@media (max-width: 420px) {
		}
	`,
	InterestsSearch = styled( Input )`
		grid-area: is;
		justify-self: center;
		align-self: flex-start;
		margin-top: 10px;
		width: 90%;
		font-family: inherit !important;
		input {
			text-align: center !important;
			font-family: inherit !important;
			color: #444 !important;
			::placeholder {
				color: #666 !important;
			};
		};
		i {
			color: rgb(133, 217, 191) !important;
		};
		@media (max-width: 420px) {
		}
	`,
	UsernameWrapper = styled.div`
		grid-area: u;
		display: grid;
		grid-template-columns: 100%;
		grid-template-rows: 25% 75%;
		grid-template-areas:
			"ih"
			"is";
		@media (max-width: 420px) {
		}
	`,
	UsernameHeader = styled.h4`
		grid-area: ih;
		margin: 0px;
		justify-self: center;
		align-self: flex-end;
		font-family: inherit;
		color: #333;
		@media (max-width: 420px) {
		}
	`,
	UsernameSearch = styled( Input )`
		grid-area: is;
		justify-self: center;
		align-self: flex-start;
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
		@media (max-width: 420px) {
		}
	`;

class ExploreUsers extends Component {
	handleKeyPress = e => {
		if ( e.key === "Enter" ) {
			e.target.name === "hobbies" ?
				this.props.matchHobbies()
				:
				this.props.matchUsername();
		}
	}

	render() {
		return (
			<Wrapper>
				<ButtonsWrapper>
					<SugestedHeader>
						Find users with similar interests or random ones.
					</SugestedHeader>
					<SugestedButton
						className="sugestedButton"
						primary
						content="Sugested"
						onClick={this.props.getSugested}
					/>
					<RandomButton
						className="randomButton"
						content="Random"
						onClick={this.props.getRandom}
					/>
				</ButtonsWrapper>
				<SeparatorWrapper horizontal content="Or" />
				<InterestsWrapper>
					<InterestsHeader>Search by interests and hobbies</InterestsHeader>
					<InterestsSearch
						className="interestsSearch"
						icon="search"
						name="hobbies"
						placeholder="Try 'music' or 'fishing'"
						onKeyPress={this.handleKeyPress}
						onChange={this.props.handleChange}
					/>
				</InterestsWrapper>
				<UsernameWrapper>
					<UsernameHeader>Search by username</UsernameHeader>
					<UsernameSearch
						className="usernameSearch"
						icon="search"
						name="usernameSearch"
						placeholder="skankhunt42"
						onKeyPress={this.handleKeyPress}
						onChange={this.props.handleChange}
					/>
				</UsernameWrapper>
			</Wrapper>
		);
	}
}

ExploreUsers.propTypes = {
	handleChange: PropTypes.func.isRequired,
	getRandom: PropTypes.func.isRequired,
	getSugested: PropTypes.func.isRequired,
	matchHobbies: PropTypes.func.isRequired,
	matchUsername: PropTypes.func.isRequired
};

export default ExploreUsers;
