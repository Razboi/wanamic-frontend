import React, { Component } from "react";
import { Form, Message, Button } from "semantic-ui-react";
import PropTypes from "prop-types";
import styled from "styled-components";


const
	Wrapper = styled.div`
		display: grid;
		z-index: 2;
		height: 100%;
		min-height: 100vh;
		background: #618CBC;
		width: 100%;
		grid-template-columns: 100%;
		grid-template-rows: 40% 60%;
		grid-template-areas:
			"header"
			"form"
	`,
	HeaderWrapper = styled.div`
		grid-area: header;
		display: flex;
		padding: 0 10px;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		font-family: inherit !important;
		text-align: center;
	`,
	WelcomeHeader = styled.span`
		font-size: 2rem;
		line-height: 1;
		color: #fff;
	`,
	Subheader = styled.span`
		font-size: 1rem;
		margin-top: 1.7rem;
		color: #fff;
		text-align: center;
		@media (min-width: 420px) {
			font-size: 1.1rem;
		}
	`,
	FormContainer = styled.div`
		grid-area: form;
		display: flex;
		flex-direction: column;
	`,
	FormDimmer = styled.div`
		background: rgba( 0, 0, 0, 0.4 );
		padding: 1.5rem;
		border-radius: 3px;
		margin: 0 auto;
		@media (max-width: 420px) {
			background: none;
			width: 100%;
		}
	`,
	StyledForm = styled( Form )`
		width: 100%;
		@media (min-width: 420px) {
			width: 400px;
		}
	`,
	FormInput = styled( Form.Input )`
		margin-top: ${props => props.username ? "2rem" : "0"} !important;
		input {
			border-width: 0px 0px 1px 0px !important;
			border-color: #fff !important;
			border-radius: 0px !important;
			background: none !important;
			font-family: inherit !important;
			color: #fff !important;
			text-align: center !important;
		}
		input::placeholder {
			color: #eee !important;
			text-align: center !important;
		}
	`,
	NextButton = styled( Button )`
		position: fixed !important;
		bottom: 1rem;
		right: 1rem;
		font-size: 1.1rem !important;
		font-family: inherit !important;
		border-radius: 1px !important;
		color: #fff !important;
		background: rgb(133, 217, 191) !important;
		@media (min-width: 420px) {
			bottom: 2rem;
			right: 2rem;
		}
	`,
	ErrorMessage = styled( Message )`
		position: fixed !important;
		top: 0 !important;
		width: 100% !important;
		text-align: center !important;
		border-radius: 0px !important;
	`,
	FieldsPatterns = styled.span`
		display: flex;
		align-items: center;
		justify-content: center;
		color: #eee;
		margin: auto;
		font-size: 1rem;
		text-align: center;
		@media(min-width: 420px) {
			font-size: 1.05rem;
		}
	`;


class Step1 extends Component {
	handleKeyPress = e => {
		if ( e.key === "Enter" ) {
			this.props.handleSignup();
		}
	}
	render() {
		return (
			<Wrapper>
				<HeaderWrapper>
					<WelcomeHeader>Welcome, what should we call you?</WelcomeHeader>
					<Subheader>
						Only your @username is unique. You can always change them later.
					</Subheader>
				</HeaderWrapper>

				<FormContainer>
					{this.props.error &&
						<ErrorMessage negative>
							<Message.Header>{this.props.error}</Message.Header>
						</ErrorMessage>
					}
					<FormDimmer>
						<StyledForm>
							<FormInput
								autoFocus
								maxLength="30"
								pattern="[a-zA-Z]"
								className="fullnameInput"
								onChange={this.props.handleChange}
								onKeyPress={this.handleKeyPress}
								name="fullname"
								placeholder="Full name *"
							/>
							<FormInput
								username={1}
								maxLength="20"
								pattern="[a-zA-Z0-9-_]"
								className="usernameInput"
								onChange={this.props.handleChange}
								onKeyPress={this.handleKeyPress}
								name="username"
								placeholder="Username **"
							/>

							<NextButton
								className="signupButton"
								type="button"
								floated="right"
								content="Next"
								onClick={this.props.handleSignup}
							/>
						</StyledForm>
					</FormDimmer>

					<FieldsPatterns>
						*Letters and spaces.<br/>
						**Letters, numbers and underscores.
					</FieldsPatterns>
				</FormContainer>
			</Wrapper>
		);
	}
}

Step1.propTypes = {
	handleChange: PropTypes.func.isRequired,
	handleSignup: PropTypes.func.isRequired
};

export default Step1;
