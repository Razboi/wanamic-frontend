import React, { Component } from "react";
import styled from "styled-components";
import { login, signup } from "../services/actions/auth";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import LoginForm from "../components/LoginForm";
import SignupForm from "../components/SignupForm";

const
	Wrapper = styled.div`
		height: 100vh;
		display: grid;
	`;


class AuthPage extends Component {
	constructor() {
		super();
		this.state = {
			email: "",
			password: "",
			username: "",
			fullname: "",
			signup: false,
			signupStep: 1
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
		const credentials = {
			email: this.state.email, password: this.state.password,
			username: this.state.username, fullname: this.state.fullname
		};
		if ( credentials.email !== "" && credentials.password !== "" &&
				credentials.username !== "" && credentials.fullname !== "" ) {
			this.props.signup( credentials )
				.then(() => this.props.history.push( "/welcome" ))
				.catch( err => console.log( err ));
		}
	};

	handleSignupNext = () => {
		this.setState({ signupStep: 2 });
	}

	render() {
		return (
			<Wrapper>
				{this.state.signup ?
					<SignupForm
						handleChange={this.handleChange}
						swapForm={this.swapForm}
						handleSignup={this.handleSignup}
						handleSignupNext={this.handleSignupNext}
						step={this.state.signupStep}
					/>
					:
					<LoginForm
						handleChange={this.handleChange}
						swapForm={this.swapForm}
						email={this.state.email}
						password={this.state.password}
						handleLogin={this.handleLogin}
					/>
				}
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
