import React, { Component } from "react";
import styled from "styled-components";
import { Button, Input } from "semantic-ui-react";
import PropTypes from "prop-types";

const
	Wrapper = styled.div`
		min-height: 100vh;
		height: 100%;
		width: 100%;
		margin-top: 1rem;
		padding: 0 5px 5rem 5px;
		overflow: hidden;
		h1 {
			font-family: inherit;
			text-align: center;
		}
		@media (min-width: 800px) {
			padding: 2rem;
			width: 50%;
			max-width: 600px;
			height: 800px;
			min-height: auto;
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
		button {
			font-family: inherit !important;
		}
	`,
	SugestedHeader = styled.h2`
		font-weight: 400;
		font-size: 1.3rem;
		text-align: center;
		color: #222;
		align-self: center;
		font-family: inherit;
		margin-bottom: 2rem;
		margin-top: 0;
		@media (max-width: 800px) {
			margin-top: 3rem !important;
		}
	`,
	Buttons = styled.div`
		display: flex;
		justify-content: space-evenly;
	`,
	SugestedButton = styled( Button )`
		font-family: inherit !important;
		background: rgb(133, 217, 191) !important;
		border-radius: 2px !important;
	`,
	RandomButton = styled( Button )`
		color: rgb(133, 217, 191) !important;
		border: 1px solid rgb(133, 217, 191) !important;
		background: #fff !important;
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
			@media (max-width: 800px) {
				margin-top: 3rem !important;
			}
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
				<h1>Explore Users</h1>
				<Options>
					<ButtonsWrapper>
						<SugestedHeader>
							Find users with similar interests or random ones.
						</SugestedHeader>
						<Buttons>
							<SugestedButton
								primary
								content="SUGGESTED"
								onClick={this.props.getSugested}
							/>
							<RandomButton
								content="RANDOM"
								onClick={this.props.getRandom}
							/>
						</Buttons>
					</ButtonsWrapper>
					<ButtonsWrapper>
						<SugestedHeader>
							Start a conversation with a like-minded user.
						</SugestedHeader>
						<Buttons>
							<SugestedButton
								primary
								content="START CHAT"
								onClick={this.props.chatMatchmaking}
							/>
						</Buttons>
					</ButtonsWrapper>
					<SearchWrapper>
						<h2>Search by interests and hobbies</h2>
						<SearchBar
							icon="search"
							name="hobbies"
							placeholder="Try 'gaming' or 'fishing'"
							onKeyPress={this.handleKeyPress}
							onChange={this.props.handleChange}
						/>

						<h2>Search by username</h2>
						<SearchBar
							icon="search"
							name="usernameSearch"
							placeholder="skankhunt42"
							onKeyPress={this.handleKeyPress}
							onChange={this.props.handleChange}
						/>
					</SearchWrapper>
				</Options>
			</Wrapper>
		);
	}
}

ExploreUsers.propTypes = {
	handleChange: PropTypes.func.isRequired,
	getRandom: PropTypes.func.isRequired,
	getSugested: PropTypes.func.isRequired,
	matchHobbies: PropTypes.func.isRequired,
	matchUsername: PropTypes.func.isRequired,
	chatMatchmaking: PropTypes.func.isRequired
};

export default ExploreUsers;
