import React, { Component } from "react";
import styled from "styled-components";
import { Button, Icon } from "semantic-ui-react";
import api from "../services/api";
import PropTypes from "prop-types";
import refreshToken from "../utils/refreshToken";

const
	Wrapper = styled.div`
		position: fixed;
		top: 0px;
		left: 0px;
		height: 100vh;
		width: 100vw;
		z-index: 5;
		display: flex;
		align-items: center;
		justify-content: center;
	`,
	Content = styled.div`
		position: fixed;
		background: #fff;
		border-radius: 2px;
		width: 500px;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		align-items: center;
		h1 {
			font-family: inherit;
		}
		p {
			font-size: 1.3rem;
			font-weight: 200;
		}
		textarea {
			width: 100%;
			height: 200px;
		}
		button {
			margin-top: 1rem !important;
		}
		@media (max-width: 500px) {
			width: 100%;
			height: 100%;
			overflow-y: auto;
		}
	`,
	Dimmer = styled.div`
		position: fixed;
		height: 100vh;
		width: 100vw;
		background: rgba(0,0,0,0.6);
		display: flex;
		align-items: center;
		justify-content: center;
	`,
	CloseIcon = styled( Icon )`
		color: #fff;
		position: fixed;
		top: 10px;
		right: 10px;
		font-size: 2rem !important;
		z-index: 3;
		:hover {
			cursor: pointer;
		}
		@media (max-width: 500px) {
			color: #111;
			font-size: 1.5rem;
		}
	`;

class FeedbackForm extends Component {
	constructor() {
		super();
		this.state = {
			completed: false,
			feedbackContent: ""
		};
	}

	componentDidMount() {
		document.body.style.overflowY = "hidden";
	}

	componentWillUnmount() {
		document.body.style.overflowY = "auto";
	}

	handleChange = e => {
		this.setState({ [ e.target.name ]: e.target.value });
	}

	complete = async() => {
		let { feedbackContent } = this.state;
		try {
			if ( !feedbackContent ) {
				return;
			}
			await api.feedback( feedbackContent );
			this.setState({ completed: true });
		} catch ( err ) {
			if ( err.response.data === "jwt expired" ) {
				await refreshToken();
				this.complete();
				return;
			}
			console.log( err );
		}
	}

	render() {
		if ( this.state.completed ) {
			return (
				<Wrapper>
					<CloseIcon name="close" onClick={this.props.toggleFeedback} />
					<Dimmer onClick={this.props.toggleFeedback} />
					<Content>
						<h1>Feedback sent</h1>
						<p>Thanks for helping us improve!</p>
					</Content>
				</Wrapper>
			);
		}
		return (
			<Wrapper>
				<CloseIcon name="close" onClick={this.props.toggleFeedback} />
				<Dimmer onClick={this.props.toggleFeedback} />
				<Content>
					<h1>Feedback</h1>
					<p>
						Found a bug or got a suggestion? We would love to hear your feedback!
					</p>
					<textarea
						name="feedbackContent"
						maxLength="500"
						autoFocus
						value={this.state.feedbackContent}
						onChange={this.handleChange}
					/>
					<Button
						primary
						content="Send"
						onClick={this.complete}
					/>
				</Content>
			</Wrapper>
		);
	}
}

FeedbackForm.propTypes = {
	toggleFeedback: PropTypes.func.isRequired
};

export default FeedbackForm;
