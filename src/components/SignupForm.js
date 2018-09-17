import React, { Component } from "react";
import styled from "styled-components";
import { Form, Button, Message } from "semantic-ui-react";
import PropTypes from "prop-types";

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
	SignupButton = styled( Button )`
		width: 100% !important;
		margin: 3rem 0 0 0 !important;
		font-size: 1.2rem !important;
		font-family: inherit !important;
		border-radius: 1px !important;
		color: #fff !important;
		background: rgb(133, 217, 191) !important;
	`,
	LoginWrapper = styled.a`
		display: flex;
		align-items: center;
		justify-content: center;
		color: #eee;
		margin: auto;
		font-size: 1rem;
		margin-top: 2rem;
		:hover {
			color: #eee;
		}
		@media(min-width: 420px) {
			font-size: 1.05rem;
		}
	`,
	ErrorMessage = styled( Message )`
		width: 100% !important;
		text-align: center !important;
		border-radius: 0px !important;
	`,
	Login = styled.span`
		color: #fff;
		margin-left: 0.3rem;
		font-weight: bold;
		@media(min-width: 420px) {
			:hover {
				cursor: pointer;
			}
		}
	`;


class SignupForm extends Component {
	handleKeyPress = e => {
		if ( e.key === "Enter" ) {
			this.props.handleSignupNext();
		}
	}

	render() {
		return (
			<Wrapper>
				<FormContainer>
					{this.props.error &&
						<ErrorMessage negative>
							<Message.Header>{this.props.error}</Message.Header>
						</ErrorMessage>
					}

					<FormDimmer>
						<StyledForm>
							<EmailInput
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

							<SignupButton
								type="button"
								className="signupButton"
								content="SIGN UP"
								onClick={this.props.handleSignupNext}
							/>
						</StyledForm>

						<LoginWrapper href="/login">
							Already have an account? <Login>Sign In</Login>
						</LoginWrapper>
					</FormDimmer>
				</FormContainer>
			</Wrapper>
		);
	}
}

SignupForm.propTypes = {
	handleSignupNext: PropTypes.func.isRequired,
	handleChange: PropTypes.func.isRequired,
	handleSignup: PropTypes.func.isRequired,
	password: PropTypes.string.isRequired,
	email: PropTypes.string.isRequired,
};

export default SignupForm;
