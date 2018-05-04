import React, { Component } from "react";
import styled from "styled-components";
import { Form, Button, Header } from "semantic-ui-react";
import Step1 from "./WelcomeStep1";
import PropTypes from "prop-types";

const
	FormContainer = styled.div`
		@media (max-width: 420px) {
			width: 90%;
			height: 60%;
			margin: auto;
			padding: 25px;
		}
		border: 1px solid #808080;
		width: 300px;
		height: 400px;
		grid-row: 1 / 3;
		margin: 0px auto;
	`,

	FormHeader = styled( Header )`
		margin-bottom: 30px;
		text-align: center;
	`,

	SwapButton = styled( Button )`
		position: absolute;
		right: 10px;
		top: 10px;
	`;


class SignupForm extends Component {
	handleKeyPress = e => {
		if ( e.key === "Enter" ) {
			this.props.handleSignupNext();
		}
	}

	render() {
		if ( this.props.step === 2 ) {
			return (
				<Step1
					handleChange={this.props.handleChange}
					handleSignup={this.props.handleSignup}
				/>
			);
		} else {
			return (
				<FormContainer id="AuthFormContainer">
					<SwapButton
						className="swapButton"
						secondary
						content="Log In"
						onClick={this.props.swapForm}
					/>
					<FormHeader className="formHeader" content="Sign Up" />
					<Form id="AuthForm">
						<Form.Input
							className="emailInput"
							label="Email"
							name="email"
							onChange={this.props.handleChange}
							onKeyPress={this.handleKeyPress}
							value={this.props.email}
						/>
						<Form.Input
							className="passwordInput"
							label="Password"
							type="password"
							name="password"
							onChange={this.props.handleChange}
							onKeyPress={this.handleKeyPress}
							value={this.props.password}
						/>
						<Form.Button
							type="button"
							className="signupButton"
							floated="right"
							primary
							content="Sign Up"
							onClick={this.props.handleSignupNext}
						/>
					</Form>
				</FormContainer>
			);
		}
	}
}

SignupForm.propTypes = {
	handleSignupNext: PropTypes.func.isRequired,
	handleChange: PropTypes.func.isRequired,
	handleSignup: PropTypes.func.isRequired,
	swapForm: PropTypes.func.isRequired,
	password: PropTypes.string.isRequired,
	email: PropTypes.string.isRequired,
};

export default SignupForm;
