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
		z-index: 4;
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

class CreateClubPopup extends Component {
	constructor() {
		super();
		this.state = {
			completed: false,
			name: "",
			title: "",
			description: "",
			error: ""
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
		let { name, title, description } = this.state;
		if ( !name || !title || !description ) {
			this.setState({ error: "All fields are required " });
			return;
		}
		name = name.replace( /\s/g, "" );
		try {
			await api.createClubRequest( name, title, description );
			this.setState({ completed: true });
		} catch ( err ) {
			if ( err.response.data === "jwt expired" ) {
				await refreshToken();
				this.complete();
				return;
			}
			if ( err.response.data === "Exceeded club requests" ) {
				this.setState({
					error: "You already have multiple pending requests. Please wait until these are resolved before sending more."
				});
			}
			if ( err.response.data === "This club already exists" ) {
				this.setState({
					error: "A club with this name already exists."
				});
			}
			console.log( err );
		}
	}

	render() {
		if ( this.state.completed ) {
			return (
				<Wrapper>
					<CloseIcon name="close" onClick={this.props.switchCreateForm} />
					<ClubFormDimmer onClick={this.props.switchCreateForm} />
					<CreateClubForm>
						<h4>The request has been sent</h4>
						<p>Average response time: 24h</p>
					</CreateClubForm>
				</Wrapper>
			);
		}
		return (
			<Wrapper>
				<CloseIcon name="close" onClick={this.props.switchCreateForm} />
				<ClubFormDimmer onClick={this.props.switchCreateForm} />
				<CreateClubForm>
					<Form.Field>
						<label>Name</label>
						<p>
							The unique name of the club. No spaces (all spaces will be removed).
							30 characters max.
						</p>
						<input
							name="name"
							value={this.state.name}
							placeholder="scifiBooks"
							onChange={this.handleChange}
							maxLength={30}
						/>
					</Form.Field>
					<Form.Field>
						<label>Title</label>
						<p>This is the name that will be displayed publicly. 50 characters max.</p>
						<input
							name="title"
							value={this.state.title}
							placeholder="Science Fiction Books"
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
							placeholder="A club for the lovers of science fiction books"
							onChange={this.handleChange}
							maxLength={1024}
						/>
					</Form.Field>
					<Button content="Send request" onClick={this.complete} />
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

CreateClubPopup.propTypes = {
	switchCreateForm: PropTypes.func.isRequired
};

export default CreateClubPopup;
