import React, { Component } from "react";
import { Form, Icon } from "semantic-ui-react";
import styled from "styled-components";
import PropTypes from "prop-types";
import InputTrigger from "react-input-trigger";
import MediaStep3 from "./MediaStep3";
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
		align-self: flex-start;
		align-items: center;
		justify-content: space-between;
		padding: 0px 10px;
		color: #fff;
		box-shadow: 0 1px 2px #111;
	`,
	HeaderTxt = styled.span`
		font-weight: bold;
		font-size: 1rem;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		max-width: 65%;
	`,
	Box = styled( Form )`
		display: flex;
		margin: 2rem 0;
		width: 90%;
		@media (max-width: 500px)  {
			width: 95%;
		}
		@media (min-width: 700px)  {
			width: 600px;
		}
	`,
	TextAreaStyle = {
		width: "100%"
	};


class ShareBox extends Component {
	constructor() {
		super();
		this.state = {
			userInput: "",
			step: 1,
			privacyRange: 1,
			checkNsfw: false,
			checkSpoiler: false,
			showSuggestions: false,
			suggestionsTop: undefined,
			suggestionsLeft: undefined,
			mentionInput: "",
			currentSelection: 0,
			startPosition: undefined
		};
	}

	handleKeyPress = e => {
		if ( e.key === "Enter" && this.state.showSuggestions ) {
			e.preventDefault();
			const
				{ userInput, startPosition, currentSelection } = this.state,
				user = this.props.socialCircle[ currentSelection ],
				updatedUserInput =
					userInput.slice( 0, startPosition - 1 )
					+ "@" + user.username + " " +
					userInput.slice( startPosition + user.username.length, userInput.length );

			this.setState({
				userInput: updatedUserInput,
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

	selectFromMentions = user => {
		const
			{ userInput, startPosition } = this.state,
			updatedUserInput =
				userInput.slice( 0, startPosition - 1 )
				+ "@" + user.username + " " +
				userInput.slice( startPosition + user.username.length, userInput.length );

		this.setState({
			userInput: updatedUserInput,
			startPosition: undefined,
			showSuggestions: false,
			suggestionsLeft: undefined,
			suggestionsTop: undefined,
			mentionInput: "",
			currentSelection: 0
		});

		this.endHandler();
	}

	toggleSuggestions = metaData => {
		if ( metaData.hookType === "start" &&
			( this.state.userInput.length + 31 ) <= 2200 ) {
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

	handleMentionInput = metaData => {
		if ( this.state.showSuggestions ) {
			this.setState({ mentionInput: metaData.text });
		}
	}

	handleChange = e => {
		this.setState({ [ e.target.name ]: e.target.value });
	}

	nextStep = () => {
		if ( this.state.userInput ) {
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
				userInput, privacyRange, checkNsfw, checkSpoiler
			} = this.state,
			alerts = { nsfw: checkNsfw, spoiler: checkSpoiler };

		this.props.shareTextPost( userInput, privacyRange, alerts );
		this.setState({ userInput: "" });
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
						onClick={() => this.props.switchState()}
					/>
					<HeaderTxt>Share state</HeaderTxt>
					<Icon
						className="nextIcon"
						name="check"
						onClick={this.nextStep}
					/>
				</HeaderWrapper>
				<Box id="ShareBox">
					<InputTrigger
						style={TextAreaStyle}
						trigger={{ keyCode: 50 }}
						onStart={metaData => this.toggleSuggestions( metaData ) }
						onCancel={metaData => this.toggleSuggestions( metaData ) }
						onType={metaData => this.handleMentionInput( metaData ) }
						endTrigger={endHandler => this.endHandler = endHandler }
					>
						<textarea
							maxLength="2200"
							autoFocus
							rows="3"
							id="ShareBoxInput"
							placeholder="Express yourself."
							name="userInput"
							value={this.state.userInput}
							onChange={this.handleChange}
							onKeyDown={this.handleKeyPress}
						/>
					</InputTrigger>
				</Box>

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

ShareBox.propTypes = {
	shareTextPost: PropTypes.func.isRequired,
	socialCircle: PropTypes.array.isRequired,
};

export default ShareBox;
