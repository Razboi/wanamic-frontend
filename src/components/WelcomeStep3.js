import React, { Component } from "react";
import { Form, Button, Message, Image } from "semantic-ui-react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { WithContext as ReactTags } from "react-tag-input";


const
	Wrapper = styled.div`
		padding: 1rem;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		@media (min-width: 420px) {
			max-width: 600px;
			margin: 0 auto;
		}
	`,
	HeaderWrapper = styled.header`
		display: flex;
		flex-direction: column;
		margin-bottom: 5rem;
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
		margin: 6rem 0;
		.ReactTags__tags {
			width: 100%;
		}
		.ReactTags__tag {
			padding: 0.25rem;
			border: 1px solid rgba( 0,0,0,0.4);
			border-radius: 2px;
			display: inline-block;
			margin: 0 0 0.5rem 0.5rem;
			font-size: 1.1rem;
			box-shadow: 0 1px 2px rgba(0, 0, 0, .125);
		}
		.ReactTags__remove {
			font-size: 1.7rem;
			margin-left: 0.5rem;
		}
	`,
	HobbiesLabel = styled.label`
		display: block;
		margin-bottom: 1rem;
		color: rgba(0,0,0,.87);
		font-size: 1.1rem;
		font-weight: 700;
		text-transform: none;
		text-align: center;
	`,
	HobbiesInputWrapper = styled.div`
		display: flex;
		align-items: flex-end;
	`,
	SuggestionsWrapper = styled.div`
		margin-top: 2rem;
	`,
	SuggestionsTitle = styled.h4`
		font-weight: 200;
		font-size: 1.2rem;
		color: #333;
		font-family: inherit;
		text-align: center;
	`,
	Suggestions = styled.div`
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
	`,
	SuggestionButton = styled( Button )`
		margin: 5px !important;
		opacity: ${props => props.selected && "0 !important"};
		transition: opacity 0.5s !important;
		background: ${props => props.randomcolor } !important;
		color: #fff !important;
	`,
	AddButton = styled( Button )`
		height: 38px;
	`,
	Buttons = styled.div`
		display: flex;
		width: 100%;
		margin: auto 0 1rem 0;
		justify-content: space-between;
	`,
	NextButton = styled( Button )`
		background: rgb(133, 217, 191) !important;
		color: #fff !important;
		font-family: inherit !important;
		border-radius: 2px !important;
		margin: 0 !important;
		z-index: 4 !important;
	`,
	PrevButton = styled( Button )`
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
		text-align: center;
		margin-top: 2rem;
		font-size: 1.1rem;
		.ui.input {
			height: 100%;
		}
	`,
	ImageInput = styled( Form.Input )`
		height: 125px;
		input {
			height: 100% !important;
			z-index: 3 !important;
			opacity: 0 !important;
			:hover {
				cursor: pointer;
			}
		}
	`,
	PreviewImage = styled( Image )`
		height: 125px;
		width: 125px;
		position: absolute !important;
		top: 30px;
		left: 0;
		right: 0;
		margin: auto;
		box-shadow: 2px 2px 10px rgba(0,0,0,0.2) !important;
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
	KeyCodes = { comma: 188, enter: 13 };


class Step3 extends Component {
	constructor() {
		super();
		this.state = {
			addedSuggestions: []
		};
		this.colors = [
			"#FF4848	", "#FF68DD", "#23819C", "#9669FE", "#62A9FF", "#03EBA6",
			"#fa6593"
		];
		this.randomColors = [];
	}

	componentDidMount() {
		this.initializeAddedSuggestions();
		this.generateRandomColors();
	}

	initializeAddedSuggestions = () => {
		var addedSuggestions = [];
		for ( const hobbie of this.props.hobbies ) {
			addedSuggestions.push( hobbie.id );
		}
		this.setState({ addedSuggestions: addedSuggestions });
	}

	generateRandomColors = () => {
		this.props.suggestions.map(() =>
			this.randomColors.push(
				this.colors[ Math.floor( Math.random() * this.colors.length ) ]));
	}

	handleTagChange = value => {
		const fakeEvent = { target: { value: value, name: "tagInput" } };
		this.props.handleChange( fakeEvent );
	}

	handleDelete = index => {
		const { addedSuggestions } = this.state;
		var	updatedAddedSuggestions = addedSuggestions.filter( suggestion => {
			return suggestion !== this.props.hobbies[ index ].id;
		});
		this.setState({ addedSuggestions: updatedAddedSuggestions });
		this.props.handleDelete( index );
	}

	handleManualAddition = () => {
		const { tagInput, handleAddition } = this.props;
		handleAddition({ text: tagInput, id: tagInput });
	}

	handleSuggestionAddition = value => {
		this.setState( state => ({ addedSuggestions: [
			...state.addedSuggestions, value ] }));
		this.props.handleAddition({ text: value, id: value });
	}

	renderSuggestions = () => {
		return (
			this.props.suggestions.map(( suggestion, index ) =>
				<SuggestionButton
					key={index}
					content={suggestion}
					onClick={() => this.handleSuggestionAddition( suggestion )}
					selected={this.state.addedSuggestions.includes( suggestion )}
					randomcolor={this.randomColors[ index ]}
				/>
			)
		);
	}

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
					<Step>Almost done</Step>
					<Subheader>Setup a profile image and add more specific interests.</Subheader>
				</HeaderWrapper>

				<Form>
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
					<Hobbies>
						<HobbiesLabel>Hobbies and interests</HobbiesLabel>
						<HobbiesInputWrapper>
							<ReactTags
								tags={this.props.hobbies}
								handleDelete={this.handleDelete}
								handleAddition={this.props.handleAddition}
								handleInputChange={this.handleTagChange}
								name="tagInput"
								inputValue={this.props.tagInput}
								delimiters={this.props.hobbies.length < 10 ?
									[ KeyCodes.comma, KeyCodes.enter ]
									:
									[]}
								placeholder="Add a new interest"
								autofocus={false}
								maxLength={17}
							/>
							<AddButton
								onClick={this.handleManualAddition}
								content="Add"
								primary
							/>
						</HobbiesInputWrapper>
						<SuggestionsWrapper>
							<SuggestionsTitle>Suggestions</SuggestionsTitle>
							<Suggestions>
								{this.renderSuggestions()}
							</Suggestions>
						</SuggestionsWrapper>
					</Hobbies>
				</Form>

				<Buttons>
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
				</Buttons>
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
	loader: PropTypes.bool,
	tagInput: PropTypes.string.isRequired,
	suggestions: PropTypes.array.isRequired
};

export default Step3;
