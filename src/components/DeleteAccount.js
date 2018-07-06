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
	FormTextarea = styled( Form.TextArea )`
		margin-bottom: 2rem !important;
		label {
			color: rgba(0,0,0,0.45) !important;
		}
	`,
	DeleteButton = styled( Button )`
		display: flex !important;
		margin: 1rem auto 0 0 !important;
	`;

class DeleteAccount extends Component {
	render() {
		return (
			<Wrapper>
				<HeaderWrapper>
					<BackArrow
						name="arrow left"
						onClick={this.props.backToMain}
					/>
					<HeaderTxt>Delete your account</HeaderTxt>
				</HeaderWrapper>
				<Options>
					<Form>
						<FormInput
							onChange={this.props.handleChange}
							name="deletePassword"
							label="To continue, enter your password"
							value={this.props.deletePassword}
						/>
						<FormTextarea
							onChange={this.props.handleChange}
							name="deleteFeedback"
							label="Why are you deleting your account?"
							value={this.props.deleteFeedback}
						/>
					</Form>
					<DeleteButton
						content="Delete my account"
						onClick={this.props.deleteAccount}
					/>
				</Options>
			</Wrapper>
		);
	}
}

DeleteAccount.propTypes = {
	deleteAccount: PropTypes.func.isRequired,
	handleChange: PropTypes.func.isRequired,
	backToMain: PropTypes.func.isRequired,
	deletePassword: PropTypes.string.isRequired,
	deleteFeedback: PropTypes.string.isRequired
};

export default DeleteAccount;
