import React, { Component } from "react";
import { Form } from "semantic-ui-react";

class Step1 extends Component {
	render() {
		return (
			<Form>
				<h2>Step 1</h2>
				<Form.Input
					className="fullnameInput"
					onChange={this.props.handleChange}
					name="fullname"
					label="Full name"
				/>
				<Form.Input
					className="usernameInput"
					onChange={this.props.handleChange}
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
