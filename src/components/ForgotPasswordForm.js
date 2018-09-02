import React, { Component } from "react";
import styled from "styled-components";
import { Form, Button, Message, Icon } from "semantic-ui-react";
import PropTypes from "prop-types";

const
	Wrapper = styled.div`
		display: grid;
		z-index: 2;
		height: 100%;
		width: 100%;
		grid-template-columns: 100%;
		grid-template-rows: 40% 60%;
		grid-template-areas:
			"header"
			"form";
	`,
	HeaderContainer = styled.div`
		grid-area: header;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		@media (max-width: 420px) {
			padding: 0 10px;
		}
	`,
	HeaderLogo = styled.span`
		font-size: 3rem;
		color: #fff;
	`,
	Subheader = styled.span`
		text-align: center;
		font-size: 1rem;
		margin-top: 1.7rem;
		color: #fff;
		@media (min-width: 420px) {
			font-size: 1.2rem;
		}
	`,
	FormContainer = styled.div`
		grid-area: form;
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
	ContinueButton = styled( Button )`
		width: 100% !important;
		margin: 3rem 0 0 0 !important;
		font-size: 1.2rem !important;
		font-family: inherit !important;
		border-radius: 1px !important;
		color: #fff !important;
		background: rgb(133, 217, 191) !important;
	`,
	ErrorMessage = styled( Message )`
		position: absolute !important;
		top: 0 !important;
		width: 100% !important;
		text-align: center !important;
		border-radius: 0px !important;
	`,
	CloseIcon = styled( Icon )`
		color: #fff !important;
		font-size: 1.1rem !important;
		position: absolute !important;
		top: 2px;
		right: 0px;
		:hover {
			cursor: pointer;
		}
	`;



class ForgotPasswordForm extends Component {
	render() {
		return (
			<Wrapper>
				<FormContainer id="AuthFormContainer">
					{this.props.error &&
						<ErrorMessage negative>
							<Message.Header>{this.props.error}</Message.Header>
						</ErrorMessage>
					}
					<FormDimmer>
						<CloseIcon
							name="close"
							onClick={this.props.toggleForgotPassword}
						/>
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

							<ContinueButton
								type="button"
								content="Reset Password"
								onClick={this.props.resetPassword}
							/>

						</StyledForm>
					</FormDimmer>
				</FormContainer>
			</Wrapper>
		);
	}
}

ForgotPasswordForm.propTypes = {
	handleChange: PropTypes.func.isRequired,
	resetPassword: PropTypes.func.isRequired,
	toggleForgotPassword: PropTypes.func.isRequired,
	error: PropTypes.string.isRequired
};

export default ForgotPasswordForm;
