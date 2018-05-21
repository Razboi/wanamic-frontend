import React, { Component } from "react";
import { Form, Message } from "semantic-ui-react";
import PropTypes from "prop-types";

class Step1 extends Component {
	handleKeyPress = e => {
		if ( e.key === "Enter" ) {
			this.props.handleSignup();
		}
	}

	render() {
		return (
			<Form>
				{this.props.error &&
					<Message negative>
						<Message.Header>{this.props.error.response.data}</Message.Header>
					</Message>
				}
				<h2>Step 1</h2>
				<Form.Input
					className="fullnameInput"
					onChange={this.props.handleChange}
					onKeyPress={this.handleKeyPress}
					name="fullname"
					label="Full name"
				/>
				<Form.Input
					className="usernameInput"
					onChange={this.props.handleChange}
					onKeyPress={this.handleKeyPress}
					name="username"
					label="Username"
				/>

				<Form.Button
					className="signupButton"
					primary
					type="button"
					floated="right"
					content="Next"
					onClick={this.props.handleSignup}
				/>
			</Form>
		);
	}
}

Step1.propTypes = {
	handleChange: PropTypes.func.isRequired,
	handleSignup: PropTypes.func.isRequired
};

export default Step1;
