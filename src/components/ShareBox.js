import React, { Component } from "react";
import { Form } from "semantic-ui-react";
import styled from "styled-components";
import PropTypes from "prop-types";
import InputTrigger from "react-input-trigger";
import MediaStep3 from "../components/MediaStep3";

const
	Wrapper = styled.div`
		z-index: 2;
		display: grid;
		grid-template-rows: 10% 90%;
		grid-template-areas:
			"box"
			"sug"
	`,
	BoxContainer = styled.div`
		display: grid;
		grid-area: box;
	`,
	Box = styled( Form )`
		grid-template-columns: 80% 20%;
		display: grid;
		align-self: center;
		padding: 0px 7px;
	`,
	TextAreaStyle = {
		gridColumn: "1/2",
		margin: "0px",
		borderRadius: "0px",
	},
	BoxButton = styled( Form.Button )`
		grid-column: 2/3;
		.ui.button {
			margin: 0px;
			height: 100%;
			width: 100%;
			border-radius: 0px;
		}
	`,
	Suggestions = styled.div`
		grid-area: sug;
		z-index: 3;
		height: 100%;
		width: 100%;
		background: #fff;
		padding: 10px;
		overflow-y: scroll;
		display: ${props => props.showSuggestions ? "block" : "none"};
	`,
	Suggestion = styled.div`
		display: flex;
		flex-direction: column;
		padding: 10px 0px;
		border-bottom: 1px solid #808080;
		background: ${props => props.selection === props.index ? "#808080" : "none"};
	`;


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
		if ( e.key === "Enter" ) {
			e.preventDefault();
			if ( this.state.showSuggestions ) {
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

	handleMentionInput = metaData => {
		if ( this.state.showSuggestions ) {
			this.setState({ mentionInput: metaData.text });
		}
	}

	handleChange = e => {
		this.setState({ [ e.target.name ]: e.target.value });
	}

	nextStep = () => {
		this.setState({ step: this.state.step + 1 });
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
				<BoxContainer>
					<Box id="ShareBox">
						<InputTrigger
							trigger={{ keyCode: 50 }}
							onStart={metaData => this.toggleSuggestions( metaData ) }
							onCancel={metaData => this.toggleSuggestions( metaData ) }
							onType={metaData => this.handleMentionInput( metaData ) }
							endTrigger={endHandler => this.endHandler = endHandler }
						>
							<textarea
								rows="2"
								style={TextAreaStyle}
								id="ShareBoxInput"
								placeholder="Share something cool"
								name="userInput"
								value={this.state.userInput}
								onChange={this.handleChange}
								onKeyDown={this.handleKeyPress}
							/>
						</InputTrigger>

						<BoxButton
							id="ShareBoxButton"
							primary
							content="Share"
							onClick={this.props.handleShare}
						/>
					</Box>
				</BoxContainer>

				<Suggestions showSuggestions={this.state.showSuggestions}>
					{this.props.socialCircle
						.filter( user =>
							user.fullname.toLowerCase().indexOf(
								this.state.mentionInput.toLowerCase()) !== -1
							||
							user.username.indexOf( this.state.mentionInput ) !== -1
						)
						.map(( user, index ) => (
							<Suggestion
								key={index}
								index={index}
								selection={this.state.currentSelection}>
								<b>{user.fullname}</b>
								<span>@{user.username}</span>
							</Suggestion>
						))}
				</Suggestions>
			</Wrapper>
		);
	}
}

ShareBox.propTypes = {
	shareTextPost: PropTypes.func.isRequired,
	socialCircle: PropTypes.array.isRequired,
};

export default ShareBox;
