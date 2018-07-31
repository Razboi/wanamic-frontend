import React, { Component } from "react";
import { Image, Icon } from "semantic-ui-react";
import PropTypes from "prop-types";
import styled from "styled-components";
import InputTrigger from "react-input-trigger";
import Suggestions from "./Suggestions";

const
	Wrapper = styled.div`
		overflow: hidden;
		position: fixed;
		height: 100vh;
		width: 100%;
		z-index: 3;
	`,
	Content = styled.div`
		position: absolute;
		height: 100vh;
		width: 100%;
		display: grid;
		grid-template-columns: 100%;
		grid-template-rows: 7% 33% 60%;
		grid-template-areas:
			"hea"
			"inp"
			"img"
	`,
	HeaderWrapper = styled.div`
		grid-area: hea;
		display: flex;
		z-index: 2;
		align-items: center;
		justify-content: space-between;
		padding: 0px 10px;
		color: #fff;
		box-shadow: 0 1px 2px #111;
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
	ContentInputWrapper = styled.div`
		grid-area: inp;
		display: grid;
		padding-bottom: 40px;
	`,
	UserContentInput = {
		width: "90%",
		maxWidth: "1480px",
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
	SelectedMediaImgWrapper = styled.div`
		grid-area: img;
		display: grid;
	`,
	SelectedMediaBackground = styled.div`
		height: 100vh;
		background-image: url(${props => props.background});
		background-size: cover;
		filter: blur(20px) brightness(50%);
	`,
	SelectedMediaImg = styled( Image )`
		justify-self: center;
		align-self: start;
		max-width: 600px !important;
    max-height: 300px !important;
		z-index: 2;
	`,
	SuggestionsWrapper = styled.div`
		z-index: 3;
		grid-area: img;
		position: absolute;
		height: 100%;
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
				this.props.nextStep( this.state.description );
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
							trigger={{ keyCode: 50 }}
							onStart={metaData => this.toggleSuggestions( metaData ) }
							onCancel={metaData => this.toggleSuggestions( metaData ) }
							onType={metaData => this.handleMentionInput( metaData ) }
							endTrigger={endHandler => this.endHandler = endHandler }
						>
							<textarea
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
					<SelectedMediaImgWrapper>
						{this.props.mediaData && this.props.mediaData.image &&
							<SelectedMediaImg src={this.props.mediaData.image} />
						}
					</SelectedMediaImgWrapper>
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
	socialCircle: PropTypes.array.isRequired,
};

export default MediaStep2;
