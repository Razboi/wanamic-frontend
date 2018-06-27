import React, { Component } from "react";
import { Form, Icon } from "semantic-ui-react";
import styled from "styled-components";
import PropTypes from "prop-types";
import InputTrigger from "react-input-trigger";
import MediaStep3 from "../components/MediaStep3";

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
	Box = styled( Form )`
		display: flex;
		margin: 1rem 0;
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
	},
	Suggestions = styled.div`
		z-index: 3;
		flex-direction: column;
		flex-grow: 1;
		width: 100vw;
		background: #fff;
		padding: 10px;
		overflow-y: scroll;
		display: ${props => props.showSuggestions ? "flex" : "none"};
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
			} else if ( this.state.userInput ) {
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
							rows="2"
							id="ShareBoxInput"
							placeholder="Share something cool"
							name="userInput"
							value={this.state.userInput}
							onChange={this.handleChange}
							onKeyDown={this.handleKeyPress}
						/>
					</InputTrigger>
				</Box>

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
