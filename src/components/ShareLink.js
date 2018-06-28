import React, { Component } from "react";
import { Input, Icon } from "semantic-ui-react";
import PropTypes from "prop-types";
import styled from "styled-components";
import InputTrigger from "react-input-trigger";
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
		marginTop: "1rem"
	},
	ShareLinkInput = styled( Input )`
		width: 100%;
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
			startPosition: undefined,
			showSuggestions: false,
			suggestionsLeft: undefined,
			suggestionsTop: undefined,
			mentionInput: "",
			currentSelection: 0
		};
	}

	handleKeyPress = e => {
		if ( e.key === "Enter" ) {
			e.preventDefault();
			if ( this.state.showSuggestions ) {
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
			} else {
				this.nextStep();
			}
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
		if ( metaData.hookType === "start" ) {
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

	handleSubmit = () => {
		const {
				description, link, privacyRange, checkNsfw, checkSpoiler
			} = this.state,
			alerts = { nsfw: checkNsfw, spoiler: checkSpoiler };
		this.props.submitLink( description, link, privacyRange, alerts );
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
						style={TextAreaStyle}
						name="link"
						value={this.state.link}
						onKeyDown={this.handleKeyPress}
						onChange={this.handleChange}
						placeholder="Share your link"
					/>
					<InputTrigger
						trigger={{ keyCode: 50 }}
						onStart={metaData => this.toggleSuggestions( metaData ) }
						onCancel={metaData => this.toggleSuggestions( metaData ) }
						onType={metaData => this.handleMentionInput( metaData ) }
						endTrigger={endHandler => this.endHandler = endHandler }
					>
						<textarea
							rows="4"
							style={TextAreaStyle}
							placeholder="Anything to say?"
							name="description"
							value={this.state.description}
							onChange={this.handleChange}
							onKeyDown={this.handleKeyPress}
						/>
					</InputTrigger>
				</BoxContainer>

				<Suggestions
					socialCircle={this.props.socialCircle}
					showSuggestions={this.state.showSuggestions}
					mentionInput={this.state.mentionInput}
					selectFromMentions={this.selectFromMentions}
				/>
			</Wrapper>
		);
	}
}

ShareLink.propTypes = {
	socialCircle: PropTypes.array.isRequired,
	submitLink: PropTypes.func.isRequired,
};

export default ShareLink;
