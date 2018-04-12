import React, { Component } from "react";
import { Form } from "semantic-ui-react";
import api from "../services/api";


class SettingsPage extends Component {
	constructor() {
		super();
		this.state = {
			userImage: null,
			headerImage: null,
			description: "",
			fullname: "",
			keywords: "",
			username: ""
		};
	}

	handleFileChange = e => {
		this.setState({
			[ e.target.name ]: e.target.files[ 0 ]
		});
	}

	handleChange = e =>
		this.setState({ [ e.target.name ]: e.target.value })


	handleSubmit = () => {
		var data = new FormData();
		data.append( "userImage", this.state.userImage );
		data.append( "headerImage", this.state.headerImage );
		data.append( "description", this.state.description );
		data.append( "keywords", this.state.keywords );
		data.append( "fullname", this.state.fullname );
		data.append( "username", this.state.username );
		data.append( "token", localStorage.getItem( "token" ));

		api.setUserInfo( data );
	}

	render() {
		return (
			<div>
				<Form>
					<h2>User Settings</h2>
					<Form.Input
						onChange={this.handleChange} name="fullname" label="Full Name"
					/>
					<Form.Input
						onChange={this.handleChange} name="username" label="Username"
					/>
					<Form.TextArea
						onChange={this.handleChange} name="description" label="Description"
					/>
					<Form.Input
						onChange={this.handleChange} name="keywords" label="Keywords"
					/>
					<Form.Input
						name="userImage"
						onChange={this.handleFileChange}
						label="Profile Image"
						type="file"
					/>
					<Form.Input
						name="headerImage"
						onChange={this.handleFileChange}
						label="Header Image"
						type="file"
					/>
					<Form.Button
						primary content="Submit" onClick={this.handleSubmit}
					/>
				</Form>
			</div>
		);
	}
}

export default SettingsPage;
