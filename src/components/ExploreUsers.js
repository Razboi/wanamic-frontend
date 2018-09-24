import React, { Component } from "react";
import styled from "styled-components";
import { Button, Input, Image, Header } from "semantic-ui-react";
import PropTypes from "prop-types";

const
	Wrapper = styled.div`
		min-height: 100vh;
		height: 100%;
		width: 100%;
		margin-top: 1rem;
		padding: 0 5px 5rem 5px;
		background: #fff;
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
		position: relative;
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
	`,
	SugestionImg = styled( Image )`
		width: 35px !important;
		height: 35px !important;
	`,
	SugestionData = styled.div`
		display: flex;
		flex-direction: column;
		margin-left: 0.5rem;
	`,
	SugestionFullname = styled.span`
	`,
	SugestionUsername = styled( Header.Subheader )`
	`;

class ExploreUsers extends Component {
	handleKeyPress = e => {
		if ( e.key === "Enter" ) {
			this.props.matchHobbies();
		}
	}

	render() {
		const s3Bucket = "https://d3dlhr4nnvikjb.cloudfront.net/";
		let { searchSuggestions, loading } = this.props;
		return (
			<Wrapper>
				<h1>Explore Users</h1>
				<Options>
					<ButtonsWrapper>
						<SugestedHeader>
							Explore user profiles and meet new friends.
						</SugestedHeader>
						<Buttons>
							<SugestedButton
								primary
								content="EXPLORE"
								onClick={this.props.getRandom}
							/>
						</Buttons>
					</ButtonsWrapper>
					<ButtonsWrapper>
						<SugestedHeader>
							Start a conversation with a like-minded user.
						</SugestedHeader>
						<Buttons>
							<RandomButton
								primary
								content="START CHAT"
								onClick={this.props.chatMatchmaking}
							/>
						</Buttons>
					</ButtonsWrapper>
					<SearchWrapper>
						{/* <h2>Search by interests and hobbies</h2>
						<SearchBar
							icon="search"
							name="hobbies"
							placeholder="Try 'gaming' or 'fishing'"
							onKeyPress={this.handleKeyPress}
							onChange={this.props.handleChange}
						/> */}

						<h2>Search by fullname</h2>
						<SearchBar
							icon="search"
							name="usernameSearch"
							placeholder="Elon Musk"
							onChange={this.props.handleChange}
						/>
						{( searchSuggestions || loading ) &&
							<Suggestions>
								{loading ?
									<div className="lds-ring"><div></div><div></div><div></div><div></div></div>
									:
									searchSuggestions.length > 0 ?
										searchSuggestions.map(( user, i ) =>
											<Suggestion
												key={i}
												onClick={() =>
													this.props.history.push( "/" + user.username )}
											>
												<SugestionImg
													circular
													src={user.profileImage ?
														process.env.REACT_APP_STAGE === "dev" ?
															require( "../images/" + user.profileImage )
															:
															s3Bucket + user.profileImage
														:
														require( "../images/defaultUser.png" )
													}
												/>
												<SugestionData>
													<SugestionFullname>
														{user.fullname}
													</SugestionFullname>
													<SugestionUsername>
														@{user.username}
													</SugestionUsername>
												</SugestionData>
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

ExploreUsers.propTypes = {
	handleChange: PropTypes.func.isRequired,
	getRandom: PropTypes.func.isRequired,
	matchHobbies: PropTypes.func.isRequired,
	chatMatchmaking: PropTypes.func.isRequired,
	searchSuggestions: PropTypes.array,
	loading: PropTypes.bool
};

export default ExploreUsers;
