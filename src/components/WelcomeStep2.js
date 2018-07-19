import React, { Component } from "react";
import { Form } from "semantic-ui-react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { WithContext as ReactTags } from "react-tag-input";


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
	`,
	Hobbies = styled.div`
		margin-bottom: 2rem;
		.ReactTags__tag {
			padding: 0.25rem;
			border: 1px solid rgba( 0,0,0,0.4);
			border-radius: 5px;
			display: inline-block;
			margin: 0 0 0.5rem 0.5rem;
			font-size: 1rem;
			box-shadow: 0 1px 2px rgba(0, 0, 0, .125);
		}
		.ReactTags__remove {
			font-size: 1.7rem;
			margin-left: 0.5rem;
		}
	`,
	HobbiesLabel = styled.label`
		display: block;
		margin: 0 0 .28571429rem 0;
		color: rgba(0,0,0,.87);
		font-size: .92857143em;
		font-weight: 700;
		text-transform: none;
	`,
	KeyCodes = { comma: 188, enter: 13 };


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
					<Hobbies>
						<HobbiesLabel>Hobbies and interests</HobbiesLabel>
						<ReactTags
							tags={this.props.hobbies}
							handleDelete={this.props.handleDelete}
							handleAddition={this.props.handleAddition}
							delimiters={[ KeyCodes.comma, KeyCodes.enter ]}
							placeholder="Add a new interest (with enter or comma)"
							autofocus={false}
							maxLength={"35"}
						/>
					</Hobbies>
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
	handleChange: PropTypes.func.isRequired,
	handleDelete: PropTypes.func.isRequired,
	handleAddition: PropTypes.func.isRequired,
	hobbies: PropTypes.array.isRequired
};

export default Step2;
