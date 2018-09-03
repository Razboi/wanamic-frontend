import React, { Component } from "react";
import { Form, Button, Message, Image } from "semantic-ui-react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { WithContext as ReactTags } from "react-tag-input";


const
	Wrapper = styled.div`
		padding: 1rem;
		@media (min-width: 420px) {
			max-width: 600px;
			margin: 0 auto;
		}
	`,
	HeaderWrapper = styled.header`
		display: flex;
		flex-direction: column;
		margin-bottom: 3rem;
		align-items: center;
	`,
	Step = styled.h2`
		font-family: inherit !important;
	`,
	Subheader = styled.span`
		font-size: 1rem;
		color: #444;
		font-family: inherit;
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
	NextButton = styled( Button )`
		background: rgb(133, 217, 191) !important;
		color: #fff !important;
		font-family: inherit !important;
		border-radius: 2px !important;
		margin: 0 !important;
		z-index: 4 !important;
	`,
	StyledMessage = styled( Message )`
		z-index: 2;
	`,
	ImageInputWrapper = styled.div`
		position: relative;
	`,
	ImageInput = styled( Form.Input )`
		input {
			z-index: 3 !important;
			opacity: 0 !important;
			height: 60px !important;
		}
	`,
	PreviewImage = styled( Image )`
		height: 55px;
		width: 55px;
		position: absolute !important;
		top: 30px;
		left: 10px;
	`,
	LoaderDimmer = styled.div`
		position: fixed;
		left: 0;
		top: 0;
		height: 100vh;
		width: 100vw;
		z-index: 5;
		background: rgba(0,0,0,0.6);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	`,
	PrevButton = styled( Button )`
		font-family: inherit !important;
		border-radius: 2px !important;
		margin: 0 !important;
	`,
	KeyCodes = { comma: 188, enter: 13 };


class Step3 extends Component {
	render() {
		var previewImage;
		try {
			if ( this.props.imagePreview ) {
				previewImage = this.props.imagePreview;
			} else {
				previewImage = require( "../images/defaultUser.png" );
			}
		} catch ( err ) {
			console.log( err );
		}
		return (
			<Wrapper>
				{this.props.loader &&
					<LoaderDimmer>
						<div className="lds-ring"><div></div><div></div><div></div><div></div></div>
					</LoaderDimmer>
				}
				{this.props.error &&
					<StyledMessage negative>
						<Message.Header>{this.props.error}</Message.Header>
					</StyledMessage>
				}
				<HeaderWrapper>
					<Step>Basic information</Step>
					<Subheader>Let us know a little bit about yourself</Subheader>
				</HeaderWrapper>
				<Form>
					<Hobbies>
						<HobbiesLabel>Hobbies and interests</HobbiesLabel>
						<ReactTags
							tags={this.props.hobbies}
							handleDelete={this.props.handleDelete}
							handleAddition={this.props.handleAddition}
							delimiters={this.props.hobbies.length < 10 ?
								[ KeyCodes.comma, KeyCodes.enter ]
								:
								[]}
							placeholder="Add a new interest (with enter or comma)"
							autofocus={false}
							maxLength={17}
						/>
					</Hobbies>
					<ImageInputWrapper>
						<ImageInput
							className="profileImageInput"
							name="userImage"
							onChange={this.props.handleFileChange}
							label="Profile image"
							type="file"
							accept="image/*"
						/>
						<PreviewImage circular src={previewImage} />
					</ImageInputWrapper>

					<PrevButton
						secondary
						className="prevButton"
						content="Prev"
						onClick={this.props.handlePrev}
					/>

					<NextButton
						className="nextButton"
						type="button"
						floated="right"
						content="Next"
						onClick={this.props.handleNext}
						disabled={!!this.props.error}
					/>
				</Form>
			</Wrapper>
		);
	}
}

Step3.propTypes = {
	handlePrev: PropTypes.func.isRequired,
	handleNext: PropTypes.func.isRequired,
	handleFileChange: PropTypes.func.isRequired,
	handleChange: PropTypes.func.isRequired,
	handleDelete: PropTypes.func.isRequired,
	handleAddition: PropTypes.func.isRequired,
	hobbies: PropTypes.array.isRequired,
	imagePreview: PropTypes.string,
	loader: PropTypes.bool
};

export default Step3;
