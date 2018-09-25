import React, { Component } from "react";
import styled from "styled-components";
import { Form, Button, Message } from "semantic-ui-react";
import PropTypes from "prop-types";
import ForgotPasswordForm from "./ForgotPasswordForm";

const
	Wrapper = styled.div`
		z-index: 2;
		@media (max-width: 420px) {
			width: 90%;
		}
	`,
	FormContainer = styled.div`
		display: flex;
		flex-direction: column;
	`,
	FormDimmer = styled.div`
		background: rgba( 139,175,216,0.85 );
		padding: 1.5rem;
		border-radius: 6px;
		margin: 0 auto;
		@media (max-width: 420px) {
			width: 100%;
		}
	`,
	StyledForm = styled( Form )`
		width: 100%;
		margin: 0 auto !important;
		@media (min-width: 420px) {
			width: 400px;
		}
	`,
	EmailInput = styled( Form.Input )`
		input {
			border-width: 0px 0px 1px 0px !important;
			border-color: #fff !important;
			border-radius: 0px !important;
			background: none !important;
			font-family: inherit !important;
			color: #fff !important;
		}
		i {
			left: -10px !important;
			color: #fff !important;
			opacity: 1 !important;
		}
		input::placeholder {
			color: #eee !important;
		}
		margin: 0 !important;
	`,
	PasswordInput = styled( Form.Input )`
		input {
			border-width: 0px 0px 1px 0px !important;
			border-color: #fff !important;
			border-radius: 0px !important;
			background: none !important;
			font-family: inherit !important;
			color: #eee !important;
		}
		i {
			left: -10px !important;
			color: #fff !important;
			opacity: 1 !important;
		}
		input::placeholder {
			color: #eee !important;
		}
		margin: 2rem 0 0 0 !important;
	`,
	LoginButton = styled( Button )`
		width: 100% !important;
		margin: 3rem 0 0 0 !important;
		font-size: 1.2rem !important;
		font-family: inherit !important;
		border-radius: 1px !important;
		color: #fff !important;
		background: rgb(133, 217, 191) !important;
	`,
	ForgotPw = styled.div`
		margin-top: 1rem;
		text-align: center;
		color: #eee;
		@media(min-width: 420px) {
			:hover {
				cursor: pointer;
			}
		}
	`,
	NewAccount = styled.a`
		color: #eee;
		position: absolute;
		bottom: 2rem;
		font-size: 1rem;
		left: 0;
		right: 0;
		text-align: center;
		:hover {
			color: #eee;
		}
		@media(min-width: 420px) {
			font-size: 1.1rem;
		}
	`,
	ErrorMessage = styled( Message )`
		width: 100% !important;
		text-align: center !important;
		border-radius: 0px !important;
	`,
	Signup = styled.span`
		color: #fff;
		margin-left: 0.3rem;
		font-weight: bold;
		@media(min-width: 420px) {
			:hover {
				cursor: pointer;
			}
		}
	`;



class LoginForm extends Component {
	handleKeyPress = e => {
		if ( e.key === "Enter" ) {
			this.props.handleLogin();
		}
	}

	render() {
		if ( this.props.forgotPassword ) {
			return (
				<ForgotPasswordForm
					toggleForgotPassword={this.props.toggleForgotPassword}
					handleChange={this.props.handleChange}
					resetPassword={this.props.resetPassword}
					error={this.props.error}
				/>
			);
		}
		return (
			<Wrapper>
				<FormContainer id="AuthFormContainer">
					{this.props.error &&
						<ErrorMessage negative>
							<Message.Header>{this.props.error}</Message.Header>
						</ErrorMessage>
					}
					<FormDimmer>
						<StyledForm id="AuthForm">
							<EmailInput
								autoFocus
								className="emailInput"
								placeholder="Email address"
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
								content="LOG IN"
								onClick={this.props.handleLogin}
							/>

							<ForgotPw onClick={this.props.toggleForgotPassword}>
								Forgot your password?
							</ForgotPw>

						</StyledForm>
					</FormDimmer>

					<NewAccount href="/signup">
						Don't have an account? <Signup>Sign Up</Signup>
					</NewAccount>
				</FormContainer>
			</Wrapper>
		);
	}
}

LoginForm.propTypes = {
	handleLogin: PropTypes.func.isRequired,
	handleChange: PropTypes.func.isRequired,
	password: PropTypes.string.isRequired,
	email: PropTypes.string.isRequired,
	forgotPassword: PropTypes.bool.isRequired,
	toggleForgotPassword: PropTypes.func.isRequired,
	resetPassword: PropTypes.func.isRequired,
	error: PropTypes.string
};

export default LoginForm;
