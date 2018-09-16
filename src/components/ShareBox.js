import React, { Component } from "react";
import { Form, Icon } from "semantic-ui-react";
import styled from "styled-components";
import PropTypes from "prop-types";
import MediaStep3 from "./MediaStep3";
import InputWithMentions from "./InputWithMentions";

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
		align-self: flex-start;
		align-items: center;
		justify-content: space-between;
		padding: 0px 10px;
		color: #fff;
		box-shadow: 0 1px 2px #111;
		i {
			font-size: 1.5rem !important;
		}
		@media (max-width: 420px) {
			height: 55px;
			padding: 0px 20px;
		}
		@media (min-width: 420px) {
			height: 80px;
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
		font-size: 1rem;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		max-width: 65%;
		font-size: 1.2rem;
		@media (min-width: 420px) {
			font-size: 1.3rem;
		}
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
			position: relative;
		}
	`;


class ShareBox extends Component {
	constructor() {
		super();
		this.state = {
			userInput: "",
			step: 1,
			checkNsfw: false,
			checkSpoiler: false,
			spoilerDescription: ""
		};
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

	handleCheck = ( e, semanticUiProps ) => {
		this.setState({ [ semanticUiProps.name ]: semanticUiProps.checked });
	}

	handleSubmit = ( feed, selectedClub ) => {
		const {
				userInput, checkNsfw, checkSpoiler,
				spoilerDescription
			} = this.state,
			alerts = {
				nsfw: checkNsfw,
				spoiler: checkSpoiler,
				spoilerDescription: spoilerDescription
			};

		this.props.shareTextPost( userInput, feed, selectedClub, alerts );
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
					spoilers={this.state.checkSpoiler}
					handleChange={this.handleChange}
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
					<InputWithMentions
						userInput={this.state.userInput}
						socialCircle={this.props.socialCircle}
						handleChange={this.handleChange}
						setUserInput={userInput => this.setState({ userInput: userInput })}
						textareaProps={{
							maxLength: "2200",
							autoFocus: true,
							rows: "3",
							id: "ShareBoxInput",
							placeholder: "Express yourself.",
							name: "userInput"
						}}
					/>
				</Box>

			</Wrapper>
		);
	}
}

ShareBox.propTypes = {
	shareTextPost: PropTypes.func.isRequired,
	socialCircle: PropTypes.array.isRequired,
};

export default ShareBox;
