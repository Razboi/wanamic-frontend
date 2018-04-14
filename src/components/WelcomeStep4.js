import React, { Component } from "react";
import { Form } from "semantic-ui-react";

class Step4 extends Component {
	render() {
		return (
			<Form>
				<h2>Step 4</h2>
				<Form.Button
					primary floated="right" content="Next" onClick={this.props.handleNext}
				/>
				<Form.Button
					secondary floated="left" content="Prev" onClick={this.props.handlePrev}
				/>
			</Form>
		);
	}
}

export default Step4;
