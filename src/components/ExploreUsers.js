import React, { Component } from "react";
import styled from "styled-components";
import { Button, Divider, Input } from "semantic-ui-react";
import PropTypes from "prop-types";

const
	Wrapper = styled.div`
		@media (max-width: 420px) {
			height: 100%;
			width: 100%;
			padding: 1rem;
			display: grid;
			grid-template-columns: 100%;
			grid-template-rows: 30% 15% 20% 20%;
			grid-template-areas:
				"b"
				"s"
				"i"
				"u"
		}
	`,
	ButtonsWrapper = styled.div`
		@media (max-width: 420px) {
			grid-area: b;
			display: grid;
			grid-template-columns: 50% 50%;
			grid-template-rows: 40% 60%;
			grid-template-areas:
				"h h"
				"rb sb"
		}
	`,
	SugestedHeader = styled.h4`
		@media (max-width: 420px) {
			grid-area: h;
			margin: 0px;
			text-align: center;
			color: rgba(0,0,0,0.75);
			align-self: center;
			font-family: inherit;
		}
	`,
	SugestedButton = styled( Button )`
		@media (max-width: 420px) {
			grid-area: sb;
			justify-self: center;
			align-self: center;
			font-family: inherit !important;
			background: rgb(0,124,124) !important;
			border-radius: 2px !important;
		}
	`,
	RandomButton = styled( Button )`
		@media (max-width: 420px) {
			grid-area: rb;
			justify-self: center;
			align-self: center;
			color: rgb(0,124,124) !important;
			border: 1px solid rgb(0,124,124) !important;
			background: #fff !important;
			font-family: inherit !important;
			border-radius: 2px !important;
		}
	`,
	SeparatorWrapper = styled( Divider )`
		@media (max-width: 420px) {
			grid-area: s;
			color: rgba(0,0,0,0.40) !important;
			:before, :after {
				position: static !important;
			}
		}
	`,
	InterestsWrapper = styled.div`
		@media (max-width: 420px) {
			grid-area: i;
			display: grid;
			grid-template-columns: 100%;
			grid-template-rows: 25% 75%;
			grid-template-areas:
				"ih"
				"is"
		}
	`,
	InterestsHeader = styled.h4`
		@media (max-width: 420px) {
			grid-area: ih;
			margin: 0px;
			justify-self: center;
			align-self: flex-end;
			font-family: inherit;
			color: rgba(0,0,0,0.75);
		}
	`,
	InterestsSearch = styled( Input )`
		@media (max-width: 420px) {
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
					color: rgba(0,0,0,0.40) !important;
				};
			};
			i {
				color: rgb(0,124,124) !important;
			};
		}
	`,
	UsernameWrapper = styled.div`
		@media (max-width: 420px) {
			grid-area: u;
			display: grid;
			grid-template-columns: 100%;
			grid-template-rows: 25% 75%;
			grid-template-areas:
				"ih"
				"is"
		}
	`,
	UsernameHeader = styled.h4`
		@media (max-width: 420px) {
			grid-area: ih;
			margin: 0px;
			justify-self: center;
			align-self: flex-end;
			font-family: inherit;
			color: rgba(0,0,0,0.75);
		}
	`,
	UsernameSearch = styled( Input )`
		@media (max-width: 420px) {
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
					color: rgba(0,0,0,0.40) !important;
				};
			};
			i {
				color: rgb(0,124,124) !important;
			};
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
