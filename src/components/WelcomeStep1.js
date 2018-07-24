import React, { Component } from "react";
import { Form, Message, Button } from "semantic-ui-react";
import PropTypes from "prop-types";
import styled from "styled-components";


const
	Wrapper = styled.div`
		display: grid;
		padding: 0 0.5rem;
		height: 100%;
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
		color: #eee;
		text-align: center;
	`,
	FormContainer = styled.div`
		@media (max-width: 420px) {
			grid-area: form;
			display: grid;
		}
	`,
	StyledForm = styled( Form )`
		width: 90%;
		height: 60%;
		align-self: flex-start;
		justify-self: center;
	`,
	FormInput = styled( Form.Input )`
		margin: ${props => props.username ? "2rem" : "0"};
		max-width: 300px;
		input {
			border-width: 0px 0px 1px 0px !important;
			border-color: #fff !important;
			border-radius: 0px !important;
			background: none !important;
			font-family: inherit !important;
			color: #fff !important;
			text-align: center;
		}
		input::placeholder {
			color: #eee !important;
			text-align: center;
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
						<Message negative>
							<Message.Header>{this.props.error}</Message.Header>
						</Message>
					}
					<StyledForm>
						<FormInput
							maxLength="30"
							className="fullnameInput"
							onChange={this.props.handleChange}
							onKeyPress={this.handleKeyPress}
							name="fullname"
							placeholder="Full name"
						/>
						<FormInput
							username
							maxLength="30"
							className="usernameInput"
							onChange={this.props.handleChange}
							onKeyPress={this.handleKeyPress}
							name="username"
							placeholder="Username"
						/>

						<NextButton
							className="signupButton"
							type="button"
							floated="right"
							content="Next"
							onClick={this.props.handleSignup}
						/>
					</StyledForm>
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
