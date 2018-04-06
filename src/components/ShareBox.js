import React, { Component } from "react";
import { Form } from "semantic-ui-react";
import styled from "styled-components";

const
	Box = styled( Form )`
	@media (max-width: 420px) {
		grid-template-columns: 75% 25%;
		padding: 15px;
	}
		display: grid;
	`,
	BoxInput = styled( Form.Input )`
	@media (max-width: 420px) {
		grid-column: 1/2;
		margin: 0px !important;
		input {
			border-radius: 0px !important;
		}

	}
	`,
	BoxButton = styled( Form.Button )`
	@media (max-width: 420px) {
		grid-column: 2/3;
		.ui.button {
			margin: 0px;
			height: 100%;
			width: 100%;
			border-radius: 0px;
		}
	}
	`;


class ShareBox extends Component {
	render() {
		return (
			<div>
				<Box id="ShareBox">
					<BoxInput
						id="ShareBoxInput"
						placeholder="Share something cool"
						name="sharebox"
						value={this.props.sharebox}
						onChange={this.props.handleChange}
					/>
					<BoxButton
						id="ShareBoxButton"
						primary
						content="Share"
						onClick={this.props.handleShare}
					/>
				</Box>
			</div>
		);
	}
}

export default ShareBox;
