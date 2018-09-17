import React, { Component } from "react";
import styled from "styled-components";
import { login } from "../services/actions/auth";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import LoginForm from "../components/LoginForm";
import validateEmail from "../utils/validateEmail";
import api from "../services/api";

const
	Wrapper = styled.div`
		min-height: 100vh;
		height: 100%;
		background: #222;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	`,
	BackgroundImage = styled.div`
		height: 100%;
		min-height: 100vh;
		width: 100%;
		position: absolute;
		filter: brightness(35%);
		background-image: url(${props => props.image});
		background-repeat: no-repeat;
		background-size: cover;
		background-position: center;
	`,
	HeaderText = styled.div`
		display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
		text-align: center;
		z-index: 2;
		margin-bottom: 5rem;
		@media (max-width: 1450px) {
			text-align: center;
		}
		@media (max-height: 600px) {
			margin: 1rem 0;
		}
		@media (max-height: 500px) {
			display: none;
		}
	`,
	Intro = styled.span`
		font-size: 1.5rem;
		color: #fff;
		line-height: 1.2;
		width: 600px;
		display: flex;
		flex-direction: column;
		@media (max-width: 800px) {
			display: none;
		}
	`,
	Logo = styled.span`
		z-index: 2;
		height: 100px;
		width: 200px;
		display: block;
		background-image: url(${props => props.image});
		background-repeat: no-repeat;
		background-size: 100%;
		position: absolute;
		top: 2rem;
		left: 0;
		right: 0;
		margin: 0 auto;
	`,
	HeaderForm = styled.div`
		display: flex;
    align-items: center;
    justify-content: center;
		@media (max-width: 420px) {
			width: 100%;
		}
	`;

class Login extends Component {
	constructor() {
		super();
		this.state = {
			email: "",
			password: "",
			username: "",
			fullname: "",
			error: undefined,
			blockedLogin: false,
			forgotPassword: false,
			showPopup: true
		};
	}

	componentDidMount() {
		document.title = "Login";
	}

	handleChange = e =>
		this.setState({ [ e.target.name ]: e.target.value })

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
					console.log( err );
					if ( !err.response ) {
						// network error
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
			"Please try again in 2 minutes.",
			blockedLogin: true
		});
		setTimeout(() => {
			this.setState({
				error: "",
				blockedLogin: false
			});
		}, 1000 * 60 * 2 );
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
		return (
			<Wrapper>
				<BackgroundImage
					image={require( "../images/background3.jpg" )}
				/>
				<HeaderText>
					<Logo image={require( "../images/wanamic-logo-name.svg" )} />
					<Intro>
						Find your people.
					</Intro>
				</HeaderText>
				<HeaderForm>
					<LoginForm
						error={this.state.error}
						handleChange={this.handleChange}
						email={this.state.email}
						password={this.state.password}
						handleLogin={this.handleLogin}
						forgotPassword={this.state.forgotPassword}
						toggleForgotPassword={this.toggleForgotPassword}
						resetPassword={this.resetPassword}
					/>
				</HeaderForm>
			</Wrapper>
		);
	}
}

Login.propTypes = {
	history: PropTypes.object.isRequired
};

export default connect( null, { login })( Login );
