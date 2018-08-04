import React, { Component } from "react";
import styled from "styled-components";
import { Icon } from "semantic-ui-react";
import api from "../services/api";
import PropTypes from "prop-types";
import SharedPost from "./SharedPost";
import { addPost, switchShare, updatePost } from "../services/actions/posts";
import { connect } from "react-redux";
import refreshToken from "../utils/refreshToken";
import MediaStep3 from "../components/MediaStep3";
import InputTrigger from "react-input-trigger";
import Suggestions from "../components/Suggestions";

const
	Wrapper = styled.div`
		position: absolute;
		z-index: 20;
		background: #222;
		color: #fff !important;
		display: grid;
		overflow-y: auto;
		height: 100vh;
		width: 100%;
		grid-template-columns: 100%;
		grid-template-rows: 7% 93%;
		grid-template-areas:
			"hea"
			"com";
		@media (min-width: 760px) and (min-height: 700px) {
			height: 700px;
			width: 600px;
		}
		@media (max-height: 500px) {
			grid-template-rows: 12% 88%;
		}
		::-webkit-scrollbar {
			display: block !important;
			width: 5px !important;
			background: #fff;
		}
	`,
	HeaderWrapper = styled.div`
		grid-area: hea;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0px 10px;
		box-shadow: 0 1px 2px #111;
	`,
	HeaderTxt = styled.span`
		font-weight: bold;
		font-size: 16px;
	`,
	ShareWrapper = styled.div`
		grid-area: com;
		display: grid;
		grid-template-columns: 100%;
		grid-template-rows: 15% 85%;
		grid-template-areas:
			"inp"
			"mai";
		@media (max-height: 450px) {
			grid-template-areas:
				"inp";
			grid-template-rows: 100%;
		}
	`,
	InputWrapper = styled.div`
		position: relative;
	`,
	UserContentInput = {
		width: "90%",
		minHeight: "45px",
		zIndex: 2,
		fontFamily: "inherit",
		background: "none",
		border: "none",
		resize: "none"
	},
	InputTriggerStyles = {
		gridArea: "inp",
		display: "flex",
		justifyContent: "center",
		zIndex: 2,
		height: "100%"
	},
	SuggestionsWrapper = styled.div`
		display: ${props => !props.showSuggestions && "none"};
		z-index: 3;
		position: fixed;
		width: 100%;
		height: 80%;
		bottom: 0;
		left: 0;
		border: 1px solid rgba(0,0,0,0.1);
		@media (min-width: 420px) {
			position: absolute;
			bottom: auto;
			height: 150px;
			width: 300px;
			top: calc( ${props => props.top}px + 40px );
			left: ${props => props.left}px;
		}
	`,
	ShareMain = styled.div`
		grid-area: mai;
		position: relative;
	`,
	PostToShare = styled.div`
		transform: scale( 0.75 );
		background: #fff;
		max-width: 390px;
		max-height: 600px;
    margin: 0 auto;
		overflow-y: auto;
		::-webkit-scrollbar {
			display: block !important;
			width: 10px !important;
			background: #fff;
		}
		@media (max-height: 450px) {
			display: none;
		}
	`;

class Share extends Component {
	constructor() {
		super();
		this.state = {
			description: "",
			step: 1,
			privacyRange: 1,
			checkNsfw: false,
			checkSpoiler: false,
			spoilerDescription: "",
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
					{ description, startPosition, currentSelection } = this.state,
					user = this.state.socialCircle[ currentSelection ],
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
				this.props.nextStep();
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

	handleShare = async() => {
		var response;
		const {
				description, privacyRange, checkNsfw, checkSpoiler
			} = this.state,
			alerts = { nsfw: checkNsfw, spoiler: checkSpoiler };

		try {
			response = await api.sharePost(
				this.props.postToShare._id, description, privacyRange, alerts
			);
		} catch ( err ) {
			console.log( err );
		}

		if ( response === "jwt expired" ) {
			await refreshToken();
			this.handleShare();
		} else if ( response.data ) {
			this.props.addPost( response.data.newPost );
			this.props.updatePost( response.data.postToShare );
			this.props.switchShare( undefined );
		}
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

	render() {
		if ( this.state.step === 2 ) {
			return (
				<Wrapper>
					<MediaStep3
						handleCheck={this.handleCheck}
						setPrivacyRange={this.setPrivacyRange}
						prevStep={this.prevStep}
						handleSubmit={this.handleShare}
						mediaData={{}}
						privacyRange={this.state.privacyRange}
						spoilers={this.state.checkSpoiler}
						handleChange={this.handleChange}
						onShare
					/>
				</Wrapper>
			);
		}
		return (
			<Wrapper>
				<HeaderWrapper>
					<Icon
						className="backIcon"
						name="arrow left"
						onClick={() => this.props.switchShare( undefined )}
					/>
					<HeaderTxt>Share</HeaderTxt>
					<Icon
						className="nextIcon"
						name="check"
						onClick={this.nextStep}
					/>
				</HeaderWrapper>
				<ShareWrapper>
					<InputWrapper>
						<InputTrigger
							style={InputTriggerStyles}
							trigger={{ key: "@" }}
							onStart={metaData => this.toggleSuggestions( metaData ) }
							onCancel={metaData => this.toggleSuggestions( metaData ) }
							onType={metaData => this.handleMentionInput( metaData ) }
							endTrigger={endHandler => this.endHandler = endHandler }
						>
							<textarea
								id="SharePostInput"
								maxLength="2200"
								style={UserContentInput}
								autoFocus
								name="description"
								value={this.state.description}
								placeholder="Share your opinion, tag @users and add #hashtags..."
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
								socialCircle={this.state.socialCircle}
								showSuggestions={this.state.showSuggestions}
								mentionInput={this.state.mentionInput}
								selectFromMentions={this.selectFromMentions}
								media={"true"}
							/>
						</SuggestionsWrapper>
					</InputWrapper>

					<ShareMain>
						<PostToShare>
							<SharedPost
								post={this.props.postToShare.sharedPost ?
									this.props.postToShare.sharedPost
									:
									this.props.postToShare
								}
							/>
						</PostToShare>
					</ShareMain>
				</ShareWrapper>
			</Wrapper>
		);
	}
}

Share.propTypes = {
	postToShare: PropTypes.object.isRequired,
	switchShare: PropTypes.func.isRequired,
};

const
	mapStateToProps = state => ({
		postToShare: state.posts.postToShare
	}),

	mapDispatchToProps = dispatch => ({
		updatePost: post => dispatch( updatePost( post )),
		addPost: post => dispatch( addPost( post )),
		switchShare: postIndex => dispatch( switchShare( postIndex ))
	});

export default connect( mapStateToProps, mapDispatchToProps )( Share );
