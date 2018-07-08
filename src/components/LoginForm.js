import React, { Component } from "react";
import styled from "styled-components";
import { Form, Button, Message } from "semantic-ui-react";
import PropTypes from "prop-types";

const
	Wrapper = styled.div`
		display: grid;
		height: 100%;
		width: 100%;
		grid-template-columns: 100%;
		grid-template-rows: 40% 60%;
		grid-template-areas:
			"header"
			"form"
	`,
	HeaderContainer = styled.div`
		grid-area: header;
		display: grid;
	`,
	HeaderLogo = styled.span`
	align-self: center;
	justify-self: center;
	font-size: 2rem;
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
	EmailInput = styled( Form.Input )`
		input {
			border-width: 0px 0px 1px 0px !important;
			border-radius: 0px !important;
		}
		i {
			left: -10px !important;
		}
		margin: 0 !important;
	`,
	PasswordInput = styled( Form.Input )`
		input {
			border-width: 0px 0px 1px 0px !important;
			border-radius: 0px !important;
		}
		i {
			left: -10px !important;
		}
		margin: 2rem 0 0 0 !important;
	`,
	LoginButton = styled( Button )`
		width: 100% !important;
		margin: 3rem 0 0 0 !important;
		font-size: 1.2rem !important;
	`,
	ForgotPw = styled.div`
		margin-top: 1rem;
		text-align: center;
	`,
	NewAccount = styled.span`
		align-self: flex-end;
		justify-self: center;
		margin-bottom: 1rem;
	`,
	ErrorMessage = styled( Message )`
		position: absolute !important;
		top: 0 !important;
		width: 100% !important;
		text-align: center !important;
		border-radius: 0px !important;
	`;



class LoginForm extends Component {
	handleKeyPress = e => {
		if ( e.key === "Enter" ) {
			this.props.handleLogin();
		}
	}

	render() {
		return (
			<Wrapper>

				<HeaderContainer className="formHeader">
					<HeaderLogo>Wanamic</HeaderLogo>
				</HeaderContainer>

				<FormContainer id="AuthFormContainer">
					{this.props.error &&
						<ErrorMessage negative>
							<Message.Header>{this.props.error}</Message.Header>
						</ErrorMessage>
					}

					<StyledForm id="AuthForm">
						<EmailInput
							className="emailInput"
							placeholder="Email"
							name="email"
							onChange={this.props.handleChange}
							onKeyPress={this.handleKeyPress}
							value={this.props.email}
							icon="mail"
							iconPosition="left"
						/>
						<PasswordInput
							className="passwordInput"
							placeholder="Password"
							type="password"
							name="password"
							onChange={this.props.handleChange}
							onKeyPress={this.handleKeyPress}
							value={this.props.password}
							icon="lock"
							iconPosition="left"
						/>

						<LoginButton
							type="button"
							className="loginButton"
							content="Log In"
							onClick={this.props.handleLogin}
						/>

						<ForgotPw>Forgot your password?</ForgotPw>

					</StyledForm>
					<NewAccount className="swapLink" onClick={this.props.swapForm}>
						Don't have an account? <b>Sign Up</b>
					</NewAccount>
				</FormContainer>
			</Wrapper>
		);
	}
}

LoginForm.propTypes = {
	handleLogin: PropTypes.func.isRequired,
	handleChange: PropTypes.func.isRequired,
	swapForm: PropTypes.func.isRequired,
	password: PropTypes.string.isRequired,
	email: PropTypes.string.isRequired,
};

export default LoginForm;
