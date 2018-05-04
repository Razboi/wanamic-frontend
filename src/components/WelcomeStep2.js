import React, { Component } from "react";
import { Form } from "semantic-ui-react";
import PropTypes from "prop-types";

class Step2 extends Component {
	handleKeyPress = e => {
		if ( e.key === "Enter" ) {
			this.props.handleNext();
		}
	}

	render() {
		return (
			<Form>
				<h2>Step 2</h2>
				<Form.TextArea
					className="descriptionArea"
					onChange={this.props.handleChange}
					onKeyPress={this.handleKeyPress}
					name="description"
					label="Description"
				/>
				<Form.Input
					className="profileImageInput"
					name="userImage"
					onChange={this.props.handleFileChange}
					label="Profile Image"
					type="file"
				/>
				<Form.Button
					className="nextButton"
					primary
					type="button"
					floated="right"
					content="Next"
					onClick={this.props.handleNext}
				/>
			</Form>
		);
	}
}

Step2.propTypes = {
	handleNext: PropTypes.func.isRequired,
	handleFileChange: PropTypes.func.isRequired,
	handleChange: PropTypes.func.isRequired
};

export default Step2;
