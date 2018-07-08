import React, { Component } from "react";
import { Form, Header } from "semantic-ui-react";
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
	`,
	Subheader = styled.span`
		font-size: 1rem;
		color: rgba( 0,0,0,0.4);
	`,
	FormTextarea = styled( Form.TextArea )`
		margin-bottom: 2rem !important;
	`,
	FormInput = styled( Form.Input )`
		margin-bottom: 2rem !important;
	`;


class Step2 extends Component {
	render() {
		return (
			<Wrapper>
				<HeaderWrapper>
					<Step>Basic information</Step>
					<Subheader>Let us know a little bit about yourself</Subheader>
				</HeaderWrapper>
				<Form>
					<FormTextarea
						className="descriptionArea"
						onChange={this.props.handleChange}
						name="description"
						label="Description"
						placeholder="In my free time I like to pretend I'm a tree..."
						value={this.props.description}
					/>
					<FormTextarea
						className="keywordsInput"
						onChange={this.props.handleChange}
						name="keywords"
						placeholder={"#coding #rock #gaming"}
						label="Hobbies and interests"
						value={this.props.keywords}
					/>
					<FormInput
						className="profileImageInput"
						name="userImage"
						onChange={this.props.handleFileChange}
						label="Profile image"
						type="file"
					/>
					<Form.Button
						className="nextButton"
						type="button"
						floated="right"
						content="Next"
						onClick={this.props.handleNext}
					/>
				</Form>
			</Wrapper>
		);
	}
}

Step2.propTypes = {
	handleNext: PropTypes.func.isRequired,
	handleFileChange: PropTypes.func.isRequired,
	handleChange: PropTypes.func.isRequired
};

export default Step2;
