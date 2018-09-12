import React, { Component } from "react";
import { Input, Icon } from "semantic-ui-react";
import PropTypes from "prop-types";
import styled from "styled-components";
import InputTrigger from "../utils/inputTrigger";
import MediaStep3 from "../components/MediaStep3";
import Suggestions from "./Suggestions";

const
	Wrapper = styled.div`
		z-index: 2;
		display: flex;
		position: fixed;
		height: 100vh;
		width: 100%;
		flex-direction: column;
		align-items: center;
	`,
	HeaderWrapper = styled.div`
		display: flex;
		z-index: 2;
		width: 100%;
		height: 7%;
		align-items: center;
		justify-content: space-between;
		padding: 0px 10px;
		color: #fff;
		border-bottom: 1px solid rgba(0, 0, 0, .5);
		@media (min-width: 420px) {
			padding: 0px 40px;
			i {
				font-size: 1.5rem !important;
				:hover {
					cursor: pointer !important;
				}
			}
		}
	`,
	HeaderTxt = styled.span`
		font-weight: bold;
		font-size: 1rem;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		max-width: 65%;
	`,
	BoxContainer = styled.div`
		position: relative;
		display: flex;
		width: 90%;
		flex-direction: column;
		margin-top: 1rem;
		@media (max-width: 500px)  {
			width: 95%;
		}
		@media (min-width: 700px)  {
			width: 600px;
		}
	`,
	TextAreaStyle = {
		width: "100%",
		marginTop: "1rem",
		borderRadius: "2px"
	},
	ShareLinkInput = styled( Input )`
		width: 100%;
		input {
			color: #111 !important;
			::placeholder {
				color: #333 !important;
			}
		}
	`,
	SuggestionsWrapper = styled.div`
		display: ${props => !props.showSuggestions && "none"};
		z-index: 3;
		border: 1px solid rgba(0,0,0,0.1);
		@media (min-width: 420px) {
			position: absolute;
			grid-area: none;
			height: 150px;
			width: 300px;
			top: calc(${props => props.top}px + 70px);
			left: ${props => props.left < 280 ? props.left + "px" : "auto"};
			right: ${props => props.left > 280 ? 0 + "px" : "auto"};
		}
		@media (max-width: 420px) {
			position: fixed;
			bottom: 0;
			left: 0;
			width: 100%;
			height: 50%;
		}
	`;


class ShareLink extends Component {
	constructor() {
		super();
		this.state = {
			link: "",
			description: "",
			step: 1,
			privacyRange: 1,
			checkNsfw: false,
			checkSpoiler: false,
			spoilerDescription: "",
			startPosition: undefined,
			showSuggestions: false,
			suggestionsLeft: undefined,
			suggestionsTop: undefined,
			mentionInput: "",
			currentSelection: 0
		};
	}

	handleKeyPress = e => {
		if ( e.key === "Enter" && this.state.showSuggestions &&
		this.props.socialCircle.length > 0 ) {
			e.preventDefault();
			const
				{ description, startPosition, currentSelection } = this.state,
				user = this.props.socialCircle[ currentSelection ],
				updatedDescription =
					description.slice( 0, startPosition - 1 )
					+ "@" + user.username + " " +
					description.slice( startPosition + user.username.length, description.length );

			this.setState({
				description: updatedDescription,
				startPosition: undefined,
				showSuggestions: false,
				suggestionsLeft: undefined,
				suggestionsTop: undefined,
				mentionInput: "",
				currentSelection: 0
			});

			this.endHandler();
		}

		if ( this.state.showSuggestions ) {
			if ( e.keyCode === 40 &&
			this.state.currentSelection !== this.props.socialCircle.length - 1 ) {
				e.preventDefault();
				this.setState({
					currentSelection: this.state.currentSelection + 1
				});
			}

			if ( e.keyCode === 38 && this.state.currentSelection !== 0 ) {
				e.preventDefault();
				this.setState({
					currentSelection: this.state.currentSelection - 1
				});
			}
		}
	}

	toggleSuggestions = metaData => {
		if ( metaData.hookType === "start" &&
			( this.state.description.length + 31 ) <= 2200 ) {
			this.setState({
				startPosition: metaData.cursor.selectionStart,
				showSuggestions: true,
				suggestionsLeft: metaData.cursor.left,
				suggestionsTop: metaData.cursor.top + metaData.cursor.height,
			});
		}

		if ( metaData.hookType === "cancel" ) {
			this.setState({
				startPosition: undefined,
				showSuggestions: false,
				suggestionsLeft: undefined,
				suggestionsTop: undefined,
				mentionInput: "",
				currentSelection: 0
			});
		}
	}

	selectFromMentions = user => {
		const
			{ description, startPosition } = this.state,
			updatedUserInput =
				description.slice( 0, startPosition - 1 )
				+ "@" + user.username + " " +
				description.slice( startPosition + user.username.length, description.length );

		this.setState({
			description: updatedUserInput,
			startPosition: undefined,
			showSuggestions: false,
			suggestionsLeft: undefined,
			suggestionsTop: undefined,
			mentionInput: "",
			currentSelection: 0
		});

		this.endHandler();
	}

	handleMentionInput = metaData => {
		if ( this.state.showSuggestions ) {
			this.setState({ mentionInput: metaData.text });
		}
	}

	handleChange = e => {
		this.setState({ [ e.target.name ]: e.target.value });
	}

	nextStep = () => {
		if ( this.state.link ) {
			this.setState({ step: this.state.step + 1 });
		}
	}

	prevStep = () => {
		if ( this.state.step !== 1 ) {
			this.setState({ step: this.state.step - 1 });
		}
	}

	setPrivacyRange = range => {
		this.setState({ privacyRange: range });
	}

	handleCheck = ( e, semanticUiProps ) => {
		this.setState({ [ semanticUiProps.name ]: semanticUiProps.checked });
	}

	handleSubmit = ( feed, selectedClub ) => {
		const {
				description, link, checkNsfw, checkSpoiler,
				spoilerDescription
			} = this.state,
			alerts = {
				nsfw: checkNsfw,
				spoiler: checkSpoiler,
				spoilerDescription: spoilerDescription
			};
		this.props.submitLink( description, link, feed, selectedClub, alerts );
	}

	render() {
		if ( this.state.step === 2 ) {
			return (
				<MediaStep3
					handleCheck={this.handleCheck}
					setPrivacyRange={this.setPrivacyRange}
					prevStep={this.prevStep}
					handleSubmit={this.handleSubmit}
					mediaData={{}}
					privacyRange={this.state.privacyRange}
					spoilers={this.state.checkSpoiler}
					handleChange={this.handleChange}
				/>
			);
		}
		return (
			<Wrapper>
				<HeaderWrapper>
					<Icon
						name="arrow left"
						onClick={() => this.props.switchLink()}
					/>
					<HeaderTxt>Share link</HeaderTxt>
					<Icon
						className="nextIcon"
						name="check"
						onClick={this.nextStep}
					/>
				</HeaderWrapper>
				<BoxContainer>
					<ShareLinkInput
						maxLength="300"
						autoFocus
						style={TextAreaStyle}
						name="link"
						value={this.state.link}
						onKeyDown={this.handleKeyPress}
						onChange={this.handleChange}
						placeholder="Share your link"
					/>
					<InputTrigger
						trigger={{ key: "@" }}
						onStart={metaData => this.toggleSuggestions( metaData ) }
						onCancel={metaData => this.toggleSuggestions( metaData ) }
						onType={metaData => this.handleMentionInput( metaData ) }
						endTrigger={endHandler => this.endHandler = endHandler }
					>
						<textarea
							id="ShareLinkTextarea"
							maxLength="2200"
							rows="4"
							style={TextAreaStyle}
							placeholder="Share your opinion, tag @users and add #hashtags..."
							name="description"
							value={this.state.description}
							onChange={this.handleChange}
							onKeyDown={this.handleKeyPress}
						/>
					</InputTrigger>

					<SuggestionsWrapper
						showSuggestions={this.state.showSuggestions}
						left={this.state.suggestionsLeft}
						top={this.state.suggestionsTop}
					>
						<Suggestions
							socialCircle={this.props.socialCircle}
							showSuggestions={this.state.showSuggestions}
							mentionInput={this.state.mentionInput}
							selectFromMentions={this.selectFromMentions}
						/>
					</SuggestionsWrapper>
				</BoxContainer>
			</Wrapper>
		);
	}
}

ShareLink.propTypes = {
	socialCircle: PropTypes.array.isRequired,
	submitLink: PropTypes.func.isRequired,
};

export default ShareLink;
