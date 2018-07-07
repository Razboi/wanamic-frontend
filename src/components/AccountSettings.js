import React, { Component } from "react";
import { Form, Icon, Button, Message } from "semantic-ui-react";
import styled from "styled-components";
import PropTypes from "prop-types";

const
	Wrapper = styled.div`
		position: absolute;
		height: 100vh;
		width: 100%;
		display: grid;
		grid-template-columns: 100%;
		grid-template-rows: 9% 91%;
		grid-template-areas:
			"hea"
			"opt"
	`,
	HeaderWrapper = styled.div`
		grid-area: hea;
		display: flex;
		align-items: center;
		padding-left: 10px;
		border-bottom: 1px solid rgba(0, 0, 0, .5);
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
		padding: 1rem !important;
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
	`;

class AccountSettings extends Component {
	render() {
		return (
			<Wrapper>
				<HeaderWrapper>
					<BackArrow
						name="arrow left"
						onClick={this.props.backToMain}
					/>
					<HeaderTxt>Account</HeaderTxt>
				</HeaderWrapper>
				<Options>
					<Form>
						{this.props.error &&
							<Message negative>
								<Message.Header>{this.props.error}</Message.Header>
							</Message>
						}
						<FormInput
							className="fullnameInput"
							onChange={this.props.handleChange}
							name="fullname"
							label="Full Name"
							value={this.props.fullname}
						/>
						<FormInput
							className="usernameInput"
							onChange={this.props.handleChange}
							name="username"
							label="Username"
							value={this.props.username}
						/>
						<FormTextarea
							className="descriptionArea"
							onChange={this.props.handleChange}
							name="description"
							label="Description"
							value={this.props.description}
						/>
						<FormInput
							className="keywordsInput"
							onChange={this.props.handleChange}
							name="keywords"
							label="Keywords"
							value={this.props.keywords}
						/>
						<FormInput
							className="profileImageInput"
							name="userImage"
							onChange={this.props.handleFileChange}
							label="Profile Image"
							type="file"
						/>
						<FormInput
							className="headerImageInput"
							name="headerImage"
							onChange={this.props.handleFileChange}
							label="Header Image"
							type="file"
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
	keywords: PropTypes.string.isRequired,
	description: PropTypes.string.isRequired,
	username: PropTypes.string.isRequired,
	fullname: PropTypes.string.isRequired,
	error: PropTypes.string.isRequired
};

export default AccountSettings;
