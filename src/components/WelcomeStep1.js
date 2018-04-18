import React, { Component } from "react";
import { Form } from "semantic-ui-react";

class Step1 extends Component {
	handleKeyPress = e => {
		if ( e.key === "Enter" ) {
			this.props.handleSignup();
		}
	}

	render() {
		return (
			<Form>
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

export default Step1;
