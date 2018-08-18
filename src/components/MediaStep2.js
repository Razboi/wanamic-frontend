import React, { Component } from "react";
import { Image, Icon } from "semantic-ui-react";
import PropTypes from "prop-types";
import styled from "styled-components";
import InputTrigger from "../utils/inputTrigger";
import Suggestions from "./Suggestions";

const
	Wrapper = styled.div`
		position: absolute;
		height: 100%;
		width: 100%;
		z-index: 3;
		overflow-y: auto;
	`,
	Content = styled.div`
		height: 100%;
		width: 100%;
		display: flex;
		flex-direction: column;
	`,
	HeaderWrapper = styled.div`
		display: flex;
		z-index: 2;
		align-items: center;
		justify-content: space-between;
		box-shadow: 0 1px 2px #111;
		color: #fff;
		i {
			font-size: 1.5rem !important;
		}
		@media (max-width: 420px) {
			height: 55px;
			min-height: 55px;
			padding: 0px 20px;
		}
		@media (min-width: 420px) {
			height: 80px;
			min-height: 80px;
			padding: 0px 40px;
			i {
				:hover {
					cursor: pointer !important;
				}
			}
		}
	`,
	HeaderTxt = styled.span`
		font-weight: bold;
		font-size: 1.35rem;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		max-width: 65%;
		@media (max-width: 450px) {
			font-size: 1.2rem;
		}
	`,
	ContentInputWrapper = styled.div`
		display: grid;
		@media (min-width: 420px) {
			position: relative;
		}
	`,
	UserContentInput = {
		width: "90%",
		maxWidth: "1000px",
		minHeight: "45px",
		alignSelf: "flex-end",
		zIndex: 2,
		fontFamily: "inherit",
		background: "none",
		border: "none",
		resize: "none",
		textAlign: "center",
		fontSize: "1.2rem"
	},
	InputTriggerStyles = {
		display: "flex",
		justifyContent: "center",
		zIndex: 2
	},
	SelectedMediaBackground = styled.div`
		height: 100%;
		width: 100%;
		top: 0;
		position: fixed;
		background-image: url(${props => props.background});
		background-size: cover;
		filter: blur(20px) brightness(50%);
		transform: scale(1.05);
	`,
	SelectedMediaImg = styled( Image )`
		justify-self: center;
		align-self: start;
		max-width: 100% !important;
    max-height: 300px !important;
		z-index: 2;
		margin: 2rem auto;
		@media (min-width: 600px) and (min-height: 300px) {
			max-width: 600px !important;
	    max-height: 300px !important;
		}
		@media (min-width: 1200px) and (min-height: 600px) {
			max-width: 1200px !important;
	    max-height: 600px !important;
			margin: 4rem auto 2rem auto;
		}
	`,
	SuggestionsWrapper = styled.div`
		z-index: 3;
		grid-area: img;
		position: absolute;
		height: 100%;
		@media (min-width: 420px) {
			grid-area: none;
			height: 150px;
			width: 300px;
			top: 90%;
			left: 50%;
		}
		@media (max-width: 420px) {
			position: fixed;
			bottom: 0;
			left: 0;
			width: 100%;
			height: 50%;
		}
	`;


class MediaStep2 extends Component {
	constructor() {
		super();
		this.state = {
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
		if ( e.key === "Enter" && this.state.showSuggestions &&
		this.props.socialCircle.length > 0 ) {
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

	render() {
		return (
			<Wrapper>
				<Content>
					<HeaderWrapper>
						<Icon
							className="backIcon"
							name="arrow left"
							onClick={this.props.prevStep}
						/>
						<HeaderTxt>
							{this.props.mediaData.title ?
								this.props.mediaData.title
								:
								"Description"
							}
						</HeaderTxt>
						<Icon
							className="nextIcon"
							name="check"
							onClick={() => this.props.nextStep( this.state.description )}
						/>
					</HeaderWrapper>
					<ContentInputWrapper>
						<InputTrigger
							style={InputTriggerStyles}
							trigger={{ key: "@" }}
							onStart={metaData => this.toggleSuggestions( metaData ) }
							onCancel={metaData => this.toggleSuggestions( metaData ) }
							onType={metaData => this.handleMentionInput( metaData ) }
							endTrigger={endHandler => this.endHandler = endHandler }
							inputdata={this.state.description}
						>
							<textarea
								id="mediaStep2Input"
								maxLength="2200"
								style={UserContentInput}
								autoFocus
								className="mediaPostDescription"
								name="description"
								value={this.state.description}
								placeholder="Share your opinion, tag @users and add #hashtags..."
								onChange={this.handleChange}
								onKeyDown={this.handleKeyPress}
							/>
						</InputTrigger>
						<SuggestionsWrapper>
							<Suggestions
								socialCircle={this.props.socialCircle}
								showSuggestions={this.state.showSuggestions}
								mentionInput={this.state.mentionInput}
								selectFromMentions={this.selectFromMentions}
								media={"true"}
							/>
						</SuggestionsWrapper>

					</ContentInputWrapper>
					<div>
						{this.props.mediaData && this.props.mediaData.image &&
							<SelectedMediaImg src={this.props.mediaData.image} />
						}
					</div>
				</Content>
				{this.props.mediaData && this.props.mediaData.image &&
					<SelectedMediaBackground background={this.props.mediaData.image} />
				}
			</Wrapper>
		);
	}
}

MediaStep2.propTypes = {
	prevStep: PropTypes.func.isRequired,
	nextStep: PropTypes.func.isRequired,
	mediaData: PropTypes.object.isRequired,
	socialCircle: PropTypes.array.isRequired
};

export default MediaStep2;
