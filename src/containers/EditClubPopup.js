import React, { Component } from "react";
import styled from "styled-components";
import { Form, Button, Icon, Message } from "semantic-ui-react";
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
	CreateClubForm = styled( Form )`
		padding: 2rem;
		width: 500px;
		background: #fff;
		z-index: 2;
		h4 {
			font-family: inherit;
		}
		@media (max-width: 500px) {
			width: 100%;
			height: 100%;
			overflow-y: auto;
		}
	`,
	ClubFormDimmer = styled.div`
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

class EditClubPopup extends Component {
	constructor( props ) {
		super( props );
		this.state = {
			title: props.title,
			description: props.description,
			error: "",
			successor: "",
			afterGiveUp: false
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

	update = async() => {
		let { title, description } = this.state;
		if ( !title || !description ) {
			this.setState({ error: "All fields are required " });
			return;
		}
		try {
			await api.updateClub( this.props.clubId, title, description );
			this.props.updateData( title, description );
		} catch ( err ) {
			if ( err.response.data === "jwt expired" ) {
				await refreshToken();
				this.update();
				return;
			}
			console.log( err );
		}
	}

	giveUp = async() => {
		try {
			await api.giveUpPresidency( this.state.successor, this.props.clubId );
			this.setState({ afterGiveUp: true });
		} catch ( err ) {
			if ( err.response.data === "jwt expired" ) {
				await refreshToken();
				this.giveUp();
				return;
			}
			if ( err.response.data === "Duplicated notification" ) {
				this.setState({ error: "Already notified." });
			}
			if ( err.response.data === "User doesn't exist" ) {
				this.setState({ error: "This user doesn't exist." });
			}
			console.log( err );
		}
	}

	render() {
		if ( this.props.giveUpForm ) {
			return (
				<Wrapper>
					<CloseIcon name="close" onClick={this.props.toggleGiveUpForm} />
					<ClubFormDimmer onClick={this.props.toggleGiveUpForm} />
					<CreateClubForm>
						{this.state.afterGiveUp ?
							<p>A request has been sent to @{this.state.successor}. If the user accepts, you will be removed from the presidency.</p>
							:
							<React.Fragment>
								<Form.Field>
									<p>Enter the username of your successor.</p>
									<input
										placeholder="skankhunt42"
										name="successor"
										value={this.state.successor}
										onChange={this.handleChange}
										maxLength={20}
									/>
								</Form.Field>
								<Button
									content="Give Up"
									color="red"
									onClick={this.giveUp}
								/>
								{this.state.error &&
									<Message negative>
										<Message.Header>{this.state.error}</Message.Header>
									</Message>
								}
							</React.Fragment>
						}
					</CreateClubForm>
				</Wrapper>
			);
		}
		return (
			<Wrapper>
				<CloseIcon name="close" onClick={this.props.switchForm} />
				<ClubFormDimmer onClick={this.props.switchForm} />
				<CreateClubForm>
					<Form.Field>
						<label>Title</label>
						<p>This is the name that will be displayed publicly. 50 characters max.</p>
						<input
							name="title"
							value={this.state.title}
							onChange={this.handleChange}
							maxLength={50}
						/>
					</Form.Field>
					<Form.Field>
						<label>Description</label>
						<p>
							What's the club about? This is the description users will see.
							1024 characters max.
						</p>
						<textarea
							name="description"
							value={this.state.description}
							onChange={this.handleChange}
							maxLength={1024}
						/>
					</Form.Field>
					<Button content="Update" onClick={this.update} />
					{this.state.error &&
						<Message negative>
							<Message.Header>{this.state.error}</Message.Header>
						</Message>
					}
				</CreateClubForm>
			</Wrapper>
		);
	}
}

EditClubPopup.propTypes = {
	switchForm: PropTypes.func.isRequired,
	toggleGiveUpForm: PropTypes.func.isRequired,
	updateData: PropTypes.func.isRequired,
	clubId: PropTypes.string,
	title: PropTypes.string,
	description: PropTypes.string,
	giveUpForm: PropTypes.bool.isRequired
};

export default EditClubPopup;
