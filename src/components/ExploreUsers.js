import React, { Component } from "react";
import styled from "styled-components";
import { Button, Divider, Input } from "semantic-ui-react";

const
	Wrapper = styled.div`
		@media (max-width: 420px) {
			height: 100%;
			width: 100%;
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
				"sb rb"
		}
	`,
	SugestedHeader = styled.h4`
		@media (max-width: 420px) {
			grid-area: h;
			margin: 0px;
			justify-self: center;
			align-self: flex-end;
		}
	`,
	SugestedButton = styled( Button )`
		@media (max-width: 420px) {
			grid-area: sb;
			justify-self: center;
			align-self: center;
		}
	`,
	RandomButton = styled( Button )`
		@media (max-width: 420px) {
			grid-area: rb;
			justify-self: center;
			align-self: center;
		}
	`,
	SeparatorWrapper = styled( Divider )`
		@media (max-width: 420px) {
			grid-area: s;
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
		}
	`,
	InterestsSearch = styled( Input )`
		@media (max-width: 420px) {
			grid-area: is;
			justify-self: center;
			align-self: flex-start;
			margin-top: 10px;
			width: 70%;
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
		}
	`,
	UsernameSearch = styled( Input )`
		@media (max-width: 420px) {
			grid-area: is;
			justify-self: center;
			align-self: flex-start;
			margin-top: 10px;

		}
	`;

class ExploreUsers extends Component {
	handleKeyPress = e => {
		if ( e.key === "Enter" ) {
			e.target.name === "keywords" ?
				this.props.getKeywordUser()
				:
				this.props.getUsername();
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
						primary
						content="Sugested"
						onClick={this.props.getSugested}
					/>
					<RandomButton
						secondary
						content="Random"
						onClick={this.props.getRandom}
					/>
				</ButtonsWrapper>
				<SeparatorWrapper horizontal content="Or" />
				<InterestsWrapper>
					<InterestsHeader>Search by interests</InterestsHeader>
					<InterestsSearch
						icon="search"
						name="keywords"
						placeholder="#Rock music  #Golf  #anime  #fishing"
						onKeyPress={this.handleKeyPress}
						onChange={this.props.handleChange}
					/>
				</InterestsWrapper>
				<UsernameWrapper>
					<UsernameHeader>Search by username</UsernameHeader>
					<UsernameSearch
						icon="search"
						name="usernameSearch"
						placeholder="username"
						onKeyPress={this.handleKeyPress}
						onChange={this.props.handleChange}
					/>
				</UsernameWrapper>
			</Wrapper>
		);
	}
}

export default ExploreUsers;
