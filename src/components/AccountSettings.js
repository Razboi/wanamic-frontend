import React, { Component } from "react";
import { Form, Icon, Button, Message } from "semantic-ui-react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { WithContext as ReactTags } from "react-tag-input";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";

const
	Wrapper = styled.div`
		height: 100%;
		width: 100%;
		@media (max-width: 760px) {
			position: relative;
			display: ${props => props.largeScreen && "none"} !important;
			grid-area: main;
			display: grid;
			grid-template-columns: 100%;
			grid-template-rows: 9% 91%;
			grid-template-areas:
				"hea"
				"opt";
		}
		@media (min-width: 760px) {
			grid-area: main;
			background: #fff;
		}
	`,
	StyledMessage = styled( Message )`
		z-index: 2;
		@media (max-width: 760px) {
			position: fixed !important;
			width: 100%;
			left: 0;
		}
	`,
	HeaderWrapper = styled.div`
		grid-area: hea;
		height: 60px;
		display: flex;
		align-items: center;
		padding-left: 10px;
		border-bottom: 1px solid rgba(0, 0, 0, .5);
		@media (min-width: 760px) {
			display: none;
		}
	`,
	BackArrow = styled( Icon )`
		font-size: 1.3rem !important;
		margin: 0 !important;
	`,
	HeaderTxt = styled.span`
		margin-left: 1rem;
		font-weight: bold;
		font-size: 1.25rem;
	`,
	Options = styled.div`
		grid-area: opt;
		padding: 1rem 1rem 0 1rem !important;
		::-webkit-scrollbar {
			display: none !important;
		}
		overflow-y: scroll;
	`,
	FormInput = styled( Form.Input )`
		margin-bottom: 2rem !important;
		label {
			color: rgba(0,0,0,0.45) !important;
		}
	`,
	FormTextarea = styled( Form.TextArea )`
		margin-bottom: 2rem !important;
		label {
			color: rgba(0,0,0,0.45) !important;
		}
	`,
	SaveButton = styled( Button )`
		display: flex !important;
		margin: 1rem 0 0 auto !important;
	`,
	Hobbies = styled.div`
		margin-bottom: 2rem;
		.ReactTags__tags {
			width: 100%;
		}
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
	CustomLabel = styled.label`
		display: block;
		margin: 0 0 .28571429rem 0;
		color: rgba(0,0,0,0.45);
		font-size: .92857143em;
		font-weight: 700;
		text-transform: none;
	`,
	Location = styled.div`
		margin-bottom: 2rem;
		select {
			margin-bottom: 1rem;
		}
	`,
	Gender = styled.div`
		margin-bottom: 2rem;
	`,
	LoaderDimmer = styled.div`
		position: absolute;
		height: 100%;
		width: 100%;
		z-index: 5;
		background: rgba(0,0,0,0.6);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	`,
	HobbiesInputWrapper = styled.div`
		display: flex;
		align-items: flex-end;
	`,
	AddButton = styled( Button )`
		height: 38px;
	`,
	KeyCodes = { comma: 188, enter: 13 };

class AccountSettings extends Component {
	handleTagChange = value => {
		const fakeEvent = { target: { value: value, name: "tagInput" } };
		this.props.handleChange( fakeEvent );
	}

	handleManualAddition = () => {
		const { tagInput, handleAddition } = this.props;
		handleAddition({ text: tagInput, id: tagInput });
	}

	render() {
		return (
			<Wrapper largeScreen={this.props.largeScreen}>
				{this.props.loader &&
					<LoaderDimmer>
						<div className="lds-ring"><div></div><div></div><div></div><div></div></div>
					</LoaderDimmer>
				}
				<HeaderWrapper>
					<BackArrow
						name="arrow left"
						onClick={this.props.backToMain}
					/>
					<HeaderTxt>Account Settings</HeaderTxt>
				</HeaderWrapper>
				<Options>
					<Form>
						{this.props.error &&
							<StyledMessage negative>
								<Message.Header>{this.props.error}</Message.Header>
							</StyledMessage>
						}
						<FormInput
							maxLength={30}
							className="fullnameInput"
							onChange={this.props.handleChange}
							name="fullname"
							label="Full Name"
							value={this.props.fullname}
						/>
						<FormInput
							maxLength={30}
							className="usernameInput"
							onChange={this.props.handleChange}
							name="username"
							label="Username"
							value={this.props.username}
						/>
						<FormTextarea
							maxLength={250}
							className="descriptionArea"
							onChange={this.props.handleChange}
							name="description"
							label="Description"
							value={this.props.description}
						/>
						<Hobbies>
							<CustomLabel>Hobbies and interests</CustomLabel>
							<HobbiesInputWrapper>
								<ReactTags
									tags={this.props.hobbies}
									handleDelete={this.props.handleDelete}
									handleAddition={this.props.handleAddition}
									handleInputChange={this.handleTagChange}
									name="tagInput"
									inputValue={this.props.tagInput}
									delimiters={[ KeyCodes.comma, KeyCodes.enter ]}
									placeholder="Add a new interest"
									autofocus={false}
									maxLength={20}
									allowDeleteFromEmptyInput={false}
								/>
								<AddButton
									onClick={this.handleManualAddition}
									content="Add"
									primary
								/>
							</HobbiesInputWrapper>
						</Hobbies>
						<Location>
							<CustomLabel>Location</CustomLabel>
							<CountryDropdown
								value={this.props.country}
								onChange={e => this.props.handleChange({
									target: { name: "country", value: e }
								})}
							/>
							<RegionDropdown
								country={this.props.country}
								value={this.props.region}
								onChange={e => this.props.handleChange({
									target: { name: "region", value: e }
								})}
							/>
						</Location>
						<FormInput
							name="birthday"
							onChange={this.props.handleChange}
							label="Birthday"
							type="date"
							value={this.props.birthday}
						/>
						<Gender>
							<CustomLabel>Gender</CustomLabel>
							<select name="gender" onChange={this.props.handleChange}>
								<option>{this.props.gender}</option>
								{this.props.gender !== "Male" &&
								<option value="Male">Male</option>
								}
								{this.props.gender !== "Female" &&
								<option value="Female">Female</option>
								}
								{this.props.gender !== "Other" &&
								<option value="Other">Other</option>
								}
							</select>
						</Gender>
						<FormInput
							className="profileImageInput"
							name="userImage"
							onChange={this.props.handleFileChange}
							label="Profile Image"
							type="file"
							accept="image/*"
						/>
						<FormInput
							className="headerImageInput"
							name="headerImage"
							onChange={this.props.handleFileChange}
							label="Header Image"
							type="file"
							accept="image/*"
						/>
					</Form>
					<SaveButton content="Save" onClick={this.props.updateUserInfo} />
				</Options>
			</Wrapper>
		);
	}
}

AccountSettings.propTypes = {
	updateUserInfo: PropTypes.func.isRequired,
	handleFileChange: PropTypes.func.isRequired,
	handleChange: PropTypes.func.isRequired,
	backToMain: PropTypes.func.isRequired,
	hobbies: PropTypes.array,
	description: PropTypes.string,
	username: PropTypes.string.isRequired,
	fullname: PropTypes.string.isRequired,
	error: PropTypes.string.isRequired,
	handleDelete: PropTypes.func.isRequired,
	handleAddition: PropTypes.func.isRequired,
	largeScreen: PropTypes.bool,
	region: PropTypes.string,
	country: PropTypes.string,
	gender: PropTypes.string,
	birthday: PropTypes.string,
	loader: PropTypes.bool,
	tagInput: PropTypes.string.isRequired
};

export default AccountSettings;
