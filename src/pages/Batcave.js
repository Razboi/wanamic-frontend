import React, { Component } from "react";
import styled from "styled-components";
import { Input, Button } from "semantic-ui-react";
import api from "../services/api";
import refreshToken from "../utils/refreshToken";
import BatcaveData from "../containers/BatcaveData";
import PropTypes from "prop-types";

const
	FormWrapper = styled.div`
		height: 100%;
		width: 100%;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background: #111;
	`,
	FormHeader = styled.h4`
		margin: 0;
		font-family: inherit;
		font-size: 1.2rem;
		color: #fff;
	`,
	FormInput = styled( Input )`
		margin: 2rem auto !important;
	`,
	AccessButton = styled( Button )`
		font-size: 1.2rem !important;
		font-family: inherit !important;
		border-radius: 1px !important;
		color: #fff !important;
		background: rgb(133, 217, 191) !important;
	`;

class Batcave extends Component {
	constructor() {
		super();
		this.state = {
			auth: false,
			password: ""
		};
	}

	onChange = e => {
		this.setState({ [ e.target.name ]: e.target.value });
	}

	handleContinue = async() => {
		if ( !this.state.password ) {
			return;
		}
		try {
			const res = await api.batcaveAuth( this.state.password );
			if ( res ) {
				this.setState({ auth: true });
			}
		} catch ( err ) {
			console.log( err );
			if ( err.response.data === "jwt expired" ) {
				await refreshToken();
				this.handleContinue();
				return;
			}
			this.props.history.push( "/" );
		}
	}

	render() {
		if ( !this.state.auth ) {
			return (
				<FormWrapper>
					<FormHeader>Enter your password</FormHeader>
					<FormInput
						name="password"
						type="password"
						onChange={this.onChange}
						autoFocus
					/>
					<AccessButton content="Continue" onClick={this.handleContinue} />
				</FormWrapper>
			);
		}
		return (
			<BatcaveData history={this.props.history} socket={this.props.socket} />
		);
	}
}

Batcave.propTypes = {
	history: PropTypes.object.isRequired,
	socket: PropTypes.object.isRequired
};

export default Batcave;
