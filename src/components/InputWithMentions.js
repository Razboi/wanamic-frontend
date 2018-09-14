import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import InputTrigger from "../utils/inputTrigger";
import Suggestions from "./Suggestions";

const
	TextAreaStyle = {
		width: "100%",
		borderRadius: "2px"
	},
	SuggestionsWrapper = styled.div`
		display: ${props => !props.showSuggestions && "none"};
		z-index: 3;
		border: 1px solid rgba(0,0,0,0.1);
		@media (min-width: 420px) {
			position: absolute;
			grid-area: none;
			height: 150px;
			width: 300px;
			top: ${props => props.top}px;
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


class MentionsInput extends Component {
	constructor() {
		super();
		this.state = {
			showSuggestions: false,
			suggestionsTop: undefined,
			suggestionsLeft: undefined,
			mentionInput: "",
			currentSelection: 0,
			startPosition: undefined
		};
	}

	handleKeyPress = e => {
		if ( e.key === "Enter" && this.state.showSuggestions &&
		this.props.socialCircle.length > 0 ) {
			e.preventDefault();
			this.selectFromMentions(
				this.props.socialCircle[ this.state.currentSelection ]);
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
			{ startPosition } = this.state,
			{ userInput } = this.props,
			updatedUserInput =
				userInput.slice( 0, startPosition - 1 )
				+ "@" + user.username + " " +
				userInput.slice( startPosition + user.username.length, userInput.length );

		this.setState({
			startPosition: undefined,
			showSuggestions: false,
			suggestionsLeft: undefined,
			suggestionsTop: undefined,
			mentionInput: "",
			currentSelection: 0
		});
		this.props.setUserInput( updatedUserInput );

		this.endHandler();
	}

	toggleSuggestions = metaData => {
		if ( metaData.hookType === "start" &&
			( this.props.userInput.length + 31 ) <= 2200 ) {
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

	render() {
		return (
			<React.Fragment>
				<InputTrigger
					style={TextAreaStyle}
					trigger={{ key: "@" }}
					onStart={metaData => this.toggleSuggestions( metaData ) }
					onCancel={metaData => this.toggleSuggestions( metaData ) }
					onType={metaData => this.handleMentionInput( metaData ) }
					endTrigger={endHandler => this.endHandler = endHandler }
				>
					<textarea
						{...this.props.textareaProps}
						value={this.props.userInput}
						onChange={this.props.handleChange}
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
			</React.Fragment>
		);
	}
}

MentionsInput.propTypes = {
	textareaProps: PropTypes.object.isRequired,
	socialCircle: PropTypes.array.isRequired,
	handleChange: PropTypes.func.isRequired,
	setUserInput: PropTypes.func.isRequired
};

export default MentionsInput;
