import React, { Component } from "react";
import { Form, Icon, Button } from "semantic-ui-react";
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
	SaveButton = styled( Button )`
		display: flex !important;
		margin: 1rem 0 0 auto !important;
	`;

class EmailSettings extends Component {
	render() {
		return (
			<Wrapper>
				<HeaderWrapper>
					<BackArrow
						name="arrow left"
						onClick={this.props.backToMain}
					/>
					<HeaderTxt>Change Email</HeaderTxt>
				</HeaderWrapper>
				<Options>
					<Form>
						<FormInput
							type="email"
							onChange={this.props.handleChange}
							name="currentEmail"
							label="Current email"
							value={this.props.currentEmail}
						/>
						<FormInput
							type="email"
							onChange={this.props.handleChange}
							name="newEmail"
							label="New email"
							value={this.props.newEmail}
						/>
					</Form>
					<SaveButton content="Save" onClick={this.props.updateEmail} />
				</Options>
			</Wrapper>
		);
	}
}

EmailSettings.propTypes = {
	updateEmail: PropTypes.func.isRequired,
	handleChange: PropTypes.func.isRequired,
	backToMain: PropTypes.func.isRequired,
	currentEmail: PropTypes.string.isRequired,
	newEmail: PropTypes.string.isRequired
};

export default EmailSettings;
