import React, { Component } from "react";
import { Button, Image } from "semantic-ui-react";
import PropTypes from "prop-types";
import styled from "styled-components";
import api from "../services/api";
import refreshToken from "../utils/refreshToken";
import InputTrigger from "react-input-trigger";

const
	SelectedWrapper = styled.div`
		overflow: hidden;
	`,
	ShareWrapper = styled.div`
		position: absolute;
		height: 100vh;
		width: 100%;
		display: grid;
		grid-template-columns: 100%;
		grid-template-rows: 35% 65%;
		grid-template-areas:
			"inp"
			"img"
	`,
	ContentInputWrapper = styled.div`
		grid-area: inp;
		display: grid;
		padding-bottom: 40px;
	`,
	UserContentInput = {
		width: "80%",
		alignSelf: "flex-end",
		zIndex: 2
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
		transform: scale(1.2);
	`,
	SelectedMediaImg = styled( Image )`
		width: 128px;
		height: 194px;
		justify-self: center;
		align-self: start;
		z-index: 2;
	`,
	BackButton = styled( Button )`
		position: absolute;
		bottom: 5px;
		left: 5px;
	`,
	ShareButton = styled( Button )`
		position: absolute;
		bottom: 5px;
		right: 5px;
	`,
	Suggestions = styled.div`
		grid-area: img;
		position: absolute;
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


class MediaStep2 extends Component {
	constructor() {
		super();
		this.state = {
			description: "",
			socialCircle: [],
			showSuggestions: false,
			suggestionsTop: undefined,
			suggestionsLeft: undefined,
			mentionInput: "",
			currentSelection: 0,
			startPosition: undefined
		};
	}

	componentDidMount() {
		this.getSocialCircle();
	}

	getSocialCircle = () => {
		api.getSocialCircle()
			.then( res => {
				if ( res === "jwt expired" ) {
					refreshToken()
						.then(() => this.getSocialCircle())
						.catch( err => console.log( err ));
				} else {
					this.setState({ socialCircle: res.data });
				}
			}).catch( err => console.log( err ));
	}

	handleKeyPress = e => {
		if ( e.key === "Enter" ) {
			e.preventDefault();
			if ( this.state.showSuggestions ) {
				const
					{ socialCircle, description, startPosition, currentSelection } = this.state,
					user = socialCircle[ currentSelection ],
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
			this.state.currentSelection !== this.state.socialCircle.length - 1 ) {
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
			<SelectedWrapper>
				<ShareWrapper>
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
								style={UserContentInput}
								className="userInput"
								name="description"
								value={this.state.description}
								placeholder="Share your opinion, tag @users and add #hashtags..."
								onChange={this.handleChange}
								onKeyDown={this.handleKeyPress}
							/>
						</InputTrigger>
						<Suggestions
							showSuggestions={this.state.showSuggestions}
							top={this.state.suggestionsTop}
							left={this.state.suggestionsLeft}
						>
							{this.state.socialCircle
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
					</ContentInputWrapper>
					<SelectedMediaImgWrapper>
						{this.props.mediaData && this.props.mediaData.image ?
							<SelectedMediaImg src={this.props.mediaData.image} />
							:
							<SelectedMediaImg
								src={this.props.DefaultCover}
							/>
						}
					</SelectedMediaImgWrapper>
				</ShareWrapper>
				{this.props.mediaData && this.props.mediaData.image ?
					<SelectedMediaBackground background={this.props.mediaData.image} />
					:
					<SelectedMediaBackground
						background={this.props.DefaultCover}
					/>
				}
				<BackButton
					className="prevButton"
					secondary
					content="Back"
					onClick={this.props.prevStep}
				/>
				<ShareButton
					className="nextButton"
					primary
					content="Next"
					onClick={() => this.props.nextStep( this.state.description )}
				/>
			</SelectedWrapper>
		);
	}
}

MediaStep2.propTypes = {
	handleChange: PropTypes.func.isRequired,
	prevStep: PropTypes.func.isRequired,
	nextStep: PropTypes.func.isRequired,
	mediaData: PropTypes.object.isRequired,
	DefaultCover: PropTypes.string.isRequired
};

export default MediaStep2;
