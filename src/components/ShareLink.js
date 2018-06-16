import React, { Component } from "react";
import { Button, Image, Input } from "semantic-ui-react";
import PropTypes from "prop-types";
import styled from "styled-components";
import InputTrigger from "react-input-trigger";

const
	Wrapper = styled.div`
		z-index: 2;
		display: grid;
		grid-template-rows: 18% 82%;
		grid-template-areas:
			"box"
			"sug"
	`,
	BoxContainer = styled.div`
		display: grid;
		grid-area: box;
	`,
	TextAreaStyle = {
		margin: "0px",
		borderRadius: "0px",
		width: "90%",
		justifySelf: "center"
	},
	InputTriggerStyle = {
		display: "grid"
	},
	ShareLinkInput = styled( Input )`
		width: 90%;
		justify-self: center;
		align-self: center;
		margin-bottom: 10px;
	`,
	SwapBackButton = styled( Button )`
		position: fixed;
		bottom: 5px;
		left: 5px;
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


class ShareLink extends Component {
	constructor() {
		super();
		this.state = {
			link: "",
			description: "",
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
				this.props.submitLink( this.state.description, this.state.link );
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

	render() {
		return (
			<Wrapper>
				<BoxContainer>
					<ShareLinkInput
						style={TextAreaStyle}
						name="link"
						onKeyDown={this.handleKeyPress}
						onChange={this.handleChange}
						placeholder="Share your link"
					/>
					<InputTrigger
						style={InputTriggerStyle}
						trigger={{ keyCode: 50 }}
						onStart={metaData => this.toggleSuggestions( metaData ) }
						onCancel={metaData => this.toggleSuggestions( metaData ) }
						onType={metaData => this.handleMentionInput( metaData ) }
						endTrigger={endHandler => this.endHandler = endHandler }
					>
						<textarea
							rows="2"
							style={TextAreaStyle}
							placeholder="Anything to say?"
							name="description"
							value={this.state.description}
							onChange={this.handleChange}
							onKeyDown={this.handleKeyPress}
						/>
					</InputTrigger>
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

ShareLink.propTypes = {
	socialCircle: PropTypes.array.isRequired,
	submitLink: PropTypes.func.isRequired,
};

export default ShareLink;
