import React, { Component } from "react";
import { Form } from "semantic-ui-react";
import api from "../services/api";
import refreshToken from "../utils/refreshToken";
import setUserKw from "../utils/setUserKWs";

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

	componentDidMount() {
		api.getUserInfo( localStorage.getItem( "username" ))
			.then( res => {
				var keywordsString = res.data.keywords.toString().replace( /,/g, " #" );
				this.setState({
					description: res.data.description,
					fullname: res.data.fullname,
					username: res.data.username,
					keywords: keywordsString
				});
			}).catch( err => console.log( err ));
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
		data.append( "fullname", this.state.fullname );
		data.append( "username", this.state.username );
		data.append( "token", localStorage.getItem( "token" ));

		this.setInfo( data );
	}

	setInfo = data => {
		api.setUserInfo( data )
			.then( res => {
				if ( res === "jwt expired" ) {
					refreshToken()
						.then(() => {
							data.set( "token", localStorage.getItem( "token" ));
							this.setInfo( data );
						})
						.catch( err => console.log( err ));
				} else if ( res ) {
					setUserKw( this.state.keywords );
				}
			}).catch( err => console.log( err ));
	}

	render() {
		return (
			<div>
				<Form>
					<h2>User Settings</h2>
					<Form.Input
						className="fullnameInput"
						onChange={this.handleChange}
						name="fullname"
						label="Full Name"
						value={this.state.fullname}
					/>
					<Form.Input
						className="usernameInput"
						onChange={this.handleChange}
						name="username"
						label="Username"
						value={this.state.username}
					/>
					<Form.TextArea
						className="descriptionArea"
						onChange={this.handleChange}
						name="description"
						label="Description"
						value={this.state.description}
					/>
					<Form.Input
						className="keywordsInput"
						onChange={this.handleChange}
						name="keywords"
						label="Keywords"
						value={this.state.keywords}
					/>
					<Form.Input
						className="profileImageInput"
						name="userImage"
						onChange={this.handleFileChange}
						label="Profile Image"
						type="file"
					/>
					<Form.Input
						className="headerImageInput"
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
