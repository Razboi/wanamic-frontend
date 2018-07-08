import React, { Component } from "react";
import { Form, Message } from "semantic-ui-react";
import PropTypes from "prop-types";
import styled from "styled-components";


const
	Wrapper = styled.div`
		padding: 1rem;
	`,
	HeaderWrapper = styled.header`
		display: flex;
		flex-direction: column;
		margin-bottom: 3rem;
		align-items: center;
	`,
	Step = styled.h2`
		text-align: center;
	`,
	Subheader = styled.span`
		font-size: 1rem;
		text-align: center;
		color: rgba( 0,0,0,0.4);
	`,
	FormInput = styled( Form.Input )`
		margin: 2rem auto !important;
		max-width: 300px;
	`;


class Step1 extends Component {
	handleKeyPress = e => {
		if ( e.key === "Enter" ) {
			this.props.handleSignup();
		}
	}
	render() {
		return (
			<Wrapper>
				<HeaderWrapper>
					<Step>Welcome, what should we call you?</Step>
					<Subheader>
						Only your @username is unique. You can always change them later.
					</Subheader>
				</HeaderWrapper>

				<Form>
					{this.props.error &&
						<Message negative>
							<Message.Header>{this.props.error}</Message.Header>
						</Message>
					}
					<FormInput
						className="fullnameInput"
						onChange={this.props.handleChange}
						onKeyPress={this.handleKeyPress}
						name="fullname"
						label="Full name"
					/>
					<FormInput
						className="usernameInput"
						onChange={this.props.handleChange}
						onKeyPress={this.handleKeyPress}
						name="username"
						label="Username"
					/>

					<Form.Button
						className="signupButton"
						type="button"
						floated="right"
						content="Next"
						onClick={this.props.handleSignup}
					/>
				</Form>
			</Wrapper>
		);
	}
}

Step1.propTypes = {
	handleChange: PropTypes.func.isRequired,
	handleSignup: PropTypes.func.isRequired
};

export default Step1;
