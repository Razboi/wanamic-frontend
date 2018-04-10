import React, { Component } from "react";
import styled from "styled-components";
import { Form, Button, Header } from "semantic-ui-react";
import { login, signup } from "../services/actions/auth";
import { connect } from "react-redux";
import PropTypes from "prop-types";

const
	Wrapper = styled.div`
		height: 100vh;
		display: grid;
	`,
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


class AuthPage extends Component {
	constructor() {
		super();
		this.state = {
			email: "",
			password: "",
			signup: false
		};
	}

	handleChange = e =>
		this.setState({ [ e.target.name ]: e.target.value })

	swapForm = () =>
		this.setState({ signup: !this.state.signup })

	handleLogin = () => {
		const credentials = { email: this.state.email, password: this.state.password };
		if ( credentials.email !== "" && credentials.password !== "" ) {
			this.props.login( credentials ).then(() => this.props.history.push( "/" ));
		}
	};

	handleSignup = () => {
		const credentials = { email: this.state.email, password: this.state.password };
		if ( credentials.email !== "" && credentials.password !== "" ) {
			this.props.signup( credentials ).then(() => this.props.history.push( "/" ));
		}
	};

	render() {
		return (
			<Wrapper>
				<FormContainer id="AuthFormContainer">
					{ this.state.signup ?
						<SwapButton
							className="swapButton"
							secondary
							content="Log In"
							onClick={this.swapForm}
						/>
						:
						<SwapButton
							className="swapButton"
							secondary
							content="Sign Up"
							onClick={this.swapForm}
						/>
					}
					{ this.state.signup ?
						<FormHeader className="formHeader" content="Sign Up" />
						:
						<FormHeader className="formHeader" content="Log In" />
					}
					<Form id="AuthForm">
						<Form.Input
							className="emailInput"
							label="Email"
							name="email"
							onChange={this.handleChange}
							value={this.state.email}
						/>
						<Form.Input
							className="passwordInput"
							label="Password"
							type="password"
							name="password"
							onChange={this.handleChange}
							value={this.state.password}
						/>
						{ this.state.signup ?
							<Form.Button
								className="authFormButton"
								floated="right"
								primary
								content="Sign Up"
								onClick={this.handleSignup}
							/>
							:
							<Form.Button
								className="authFormButton"
								floated="right"
								primary
								content="Log In"
								onClick={this.handleLogin}
							/>
						}
					</Form>
				</FormContainer>
			</Wrapper>
		);
	}
}

AuthPage.propTypes = {
	history: PropTypes.shape({
		push: PropTypes.func.isRequired
	}).isRequired,
	login: PropTypes.func.isRequired,
	signup: PropTypes.func.isRequired
};

export default connect( null, { login, signup })( AuthPage );