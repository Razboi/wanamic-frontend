import React, { Component } from "react";
import { Form } from "semantic-ui-react";
import PropTypes from "prop-types";

class Step2 extends Component {
	render() {
		return (
			<Form>
				<h2>Step 2</h2>
				<Form.TextArea
					className="descriptionArea"
					onChange={this.props.handleChange}
					name="description"
					label="Description"
					value={this.props.description}
				/>
				<Form.TextArea
					className="keywordsInput"
					onChange={this.props.handleChange}
					name="keywords"
					placeholder={"#coding #rock #gaming"}
					label="Keywords"
					value={this.props.keywords}
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
