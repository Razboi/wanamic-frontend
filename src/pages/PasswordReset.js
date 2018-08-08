import React, { Component } from "react";
import styled from "styled-components";
import { Form, Button, Message } from "semantic-ui-react";
import api from "../services/api";

const
	Wrapper = styled.div`
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
		min-height: 100vh;
		width: 100%;
	`,
	Header = styled.h4`
		z-index: 2;
		color: #fff;
		text-align: center;
		font-size: 1.5rem;
		margin-bottom: 3rem;
		font-family: inherit !important;
	`,
	FormContainer = styled.div`
		display: flex;
		flex-direction: column;
	`,
	FormDimmer = styled.div`
		position: relative;
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
	StyledInput = styled( Form.Input )`
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
		margin-bottom: 2rem !important;
	`,
	ContinueButton = styled( Button )`
		width: 100% !important;
		margin: 2rem 0 0 0 !important;
		font-size: 1.2rem !important;
		font-family: inherit !important;
		border-radius: 1px !important;
		color: #fff !important;
		background: rgb(133, 217, 191) !important;
	`,
	ErrorMessage = styled( Message )`
		position: absolute !important;
		top: 0 !important;
		left: 0 !important;
		width: 100% !important;
		text-align: center !important;
		border-radius: 0px !important;
	`,
	BackgroundImage = styled.div`
		height: 100%;
		width: 100%;
		position: absolute;
		filter: brightness(75%);
		background-image: url(${props => props.image});
		background-repeat: no-repeat;
		background-size: cover;
	`;



class PasswordReset extends Component {
	constructor() {
		super();
		this.state = {
			error: "",
			password: "",
			passwordConfirm: ""
		};
	}

	handleChange = e => {
		this.setState({ [ e.target.name ]: e.target.value });
	}

	setNewPassword = async() => {
		const { password, passwordConfirm } = this.state;
		if ( !password ) {
			return;
		}
		if ( password !== passwordConfirm ) {
			this.setState({ error: "Passwords don't match." });
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
		try {
			this.setState({ error: "" });
			await api.setNewPassword(
				this.props.match.params.token, this.state.password );
			this.props.history.push( "/login" );
		} catch ( err ) {
			console.log( err );
			if ( err.response.data === "jwt expired" ) {
				this.setState({
					error: "This password reset request has expired. " +
						"Please request another password reset and use it " +
						"before an hour."
				});
				return;
			}
			this.setState({ error: err.response.data });
		}
	}

	render() {
		let background;
		try {
			background = require( "../images/stars.jpg" );
		} catch ( err ) {
			console.log( err );
		}
		return (
			<Wrapper>
				<BackgroundImage image={background} />
				<FormContainer id="AuthFormContainer">
					{this.state.error &&
						<ErrorMessage negative>
							<Message.Header>{this.state.error}</Message.Header>
						</ErrorMessage>
					}
					<Header>Choose a new password</Header>
					<FormDimmer>
						<StyledForm id="AuthForm">
							<StyledInput
								autoFocus
								type="password"
								placeholder="New Password"
								name="password"
								onChange={this.handleChange}
								value={this.state.password}
								icon="lock"
								iconPosition="left"
							/>

							<StyledInput
								type="password"
								placeholder="Confirm Password"
								name="passwordConfirm"
								onChange={this.handleChange}
								value={this.state.passwordConfirm}
								icon="check"
								iconPosition="left"
							/>

							<ContinueButton
								type="button"
								content="Continue"
								onClick={this.setNewPassword}
							/>

						</StyledForm>
					</FormDimmer>
				</FormContainer>
			</Wrapper>
		);
	}
}

PasswordReset.propTypes = {
};

export default PasswordReset;
