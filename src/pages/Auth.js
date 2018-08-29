import React, { Component } from "react";
import styled from "styled-components";
import { Icon } from "semantic-ui-react";
import { login, signup } from "../services/actions/auth";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import LoginForm from "../components/LoginForm";
import SignupForm from "../components/SignupForm";
import validateEmail from "../utils/validateEmail";
import api from "../services/api";

const
	Wrapper = styled.div`
		min-height: 100vh;
		height: 100%;
		background: rgba(0,0,0,0.55);
		display: flex;
		flex-direction: column;
	`,
	BackgroundImage = styled.div`
		height: 100%;
		width: 100%;
		position: absolute;
		filter: brightness(75%);
		background-image: url(${props => props.image});
		background-position: ${props => !props.signup ?
		"left bottom"
		:
		props.signupStep === 1 ?
			"center bottom"
			:
			"right bottom"};
		background-repeat: no-repeat;
		background-size: cover;
		transition: background-position 1s;
		@media(min-width: 420px) {
			background-position: ${props => !props.signup ?
		"left bottom"
		:
		"left top"};
		};
	`,
	CookiesPopup = styled.div`
		width: 100%;
		background: rgba(0,0,0,0.5);
		color: #ccc;
		padding: 1rem;
		text-align: center;
		z-index: 3;
	`,
	ClosePopup = styled( Icon )`
		margin-left: 15px !important;
		color: #ccc !important;
		:hover {
			cursor: pointer;
		}
	`;

var background;
class AuthPage extends Component {
	constructor() {
		super();
		this.state = {
			email: "",
			password: "",
			username: "",
			fullname: "",
			signup: false,
			signupStep: 1,
			error: undefined,
			blockedLogin: false,
			forgotPassword: false,
			showPopup: true
		};
	}

	handleChange = e =>
		this.setState({ [ e.target.name ]: e.target.value })

	swapForm = () =>
		this.setState({ signup: !this.state.signup, error: undefined })

	handleLogin = () => {
		if ( this.state.blockedLogin ) {
			return;
		}
		const credentials = {
			email: this.state.email, password: this.state.password
		};
		if ( !validateEmail( this.state.email )) {
			this.setState({ error: "Invalid email format" });
			return;
		}
		if ( credentials.email !== "" && credentials.password !== "" ) {
			this.props.login( credentials )
				.then(() => this.props.history.push( "/" ))
				.catch( err => {
					if ( err.response.status === 503 ) {
						this.blockLogin();
						return;
					}
					this.setState({ error: err.response.data });
				});
		}
	};

	blockLogin = () => {
		this.setState({
			error: "You have exceeded the login attempts limit. " +
			"Please try again in a minute.",
			blockedLogin: true
		});
		setTimeout(() => {
			this.setState({
				error: "",
				blockedLogin: false
			});
		}, 1000 * 60 );
	}

	handleSignup = () => {
		const credentials = {
			email: this.state.email.trim(), password: this.state.password,
			username: this.state.username.trim(),
			fullname: this.state.fullname.trim()
		};
		if ( !validateEmail( credentials.email )) {
			this.setState({ error: "Invalid email format" });
			return;
		}
		if ( !/[a-z\s]+$/i.test( credentials.fullname ) ||
			/[._]/.test( credentials.fullname )) {
			this.setState({
				error: "Invalid fullname format. Letters and spaces only."
			});
			return;
		}

		if ( !/[\w]+$/.test( credentials.username )
		|| /[\s.]/.test( credentials.username )) {
			this.setState({
				error: "Invalid username format. Alphanumeric and underscores only."
			});
			return;
		}
		if ( credentials.email !== "" && credentials.password !== "" &&
				credentials.username !== "" && credentials.fullname !== "" ) {
			this.props.signup( credentials )
				.then(() => this.props.history.push( "/welcome" ))
				.catch( err => {
					if ( err.response.data === "Email already registered" ) {
						this.setState({ error: err.response.data, signupStep: 1 });
						return;
					}
					if ( err.response.data === "Invalid email format" ) {
						this.setState({ error: err.response.data, signupStep: 1 });
						return;
					}
					if ( err.response.data === "Invalid password format" ) {
						this.setState({ error: err.response.data, signupStep: 1 });
						return;
					}
					this.setState({ error: err.response.data });
				});
		}
	};

	handleSignupNext = () => {
		if ( !this.state.email || !this.state.password ) {
			return;
		}
		if ( !validateEmail( this.state.email )) {
			this.setState({ error: "Invalid email format" });
			return;
		}
		if ( !/^(?=.*\d)(?=.*[a-zA-Z]).{8,}$/.test(
			this.state.password )) {
			this.setState({
				error: "The password must be at least 8 characters " +
				"containing letters and numbers."
			});
			return;
		}
		this.setState({ signupStep: 2, error: undefined });
	}

	toggleForgotPassword = () => {
		this.setState( state => ({ forgotPassword: !state.forgotPassword }));
	}

	resetPassword = async() => {
		if ( !this.state.email ) {
			return;
		}
		if ( !validateEmail( this.state.email )) {
			this.setState({ error: "Invalid email format" });
			return;
		}
		try {
			this.setState({ error: undefined });
			await api.resetPassword( this.state.email );
		} catch ( err ) {
			console.log( err );
			this.setState({ error: err.response.data });
		}
	}

	closePopup = () => {
		this.setState({ showPopup: false });
	}

	render() {
		try {
			background = require( "../images/stars.jpg" );
		} catch ( err ) {
			console.log( err );
		}
		return (
			<Wrapper>
				{this.state.showPopup &&
					<CookiesPopup>
						We use cookies to provide the best possible experience. By navigating Wanamic, you agree to our use of cookies. <a href="/information/cookies">Cookies Policy</a>
						<ClosePopup name="close" onClick={this.closePopup} />
					</CookiesPopup>
				}
				<BackgroundImage
					signup={this.state.signup}
					signupStep={this.state.signupStep}
					image={background}
				/>
				{this.state.signup ?
					<SignupForm
						error={this.state.error}
						handleChange={this.handleChange}
						swapForm={this.swapForm}
						handleSignup={this.handleSignup}
						handleSignupNext={this.handleSignupNext}
						step={this.state.signupStep}
						email={this.state.email}
						password={this.state.password}
					/>
					:
					<LoginForm
						error={this.state.error}
						handleChange={this.handleChange}
						swapForm={this.swapForm}
						email={this.state.email}
						password={this.state.password}
						handleLogin={this.handleLogin}
						forgotPassword={this.state.forgotPassword}
						toggleForgotPassword={this.toggleForgotPassword}
						resetPassword={this.resetPassword}
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
