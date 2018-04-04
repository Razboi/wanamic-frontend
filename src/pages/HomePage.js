import React, { Component } from "react";
import styled from "styled-components";
import { Button } from "semantic-ui-react";
import { logout } from "../services/actions/auth";
import { connect } from "react-redux";
import PropTypes from "prop-types";

const
	LogoutButton = styled( Button )`
		position: absolute;
		right: 10px;
		top: 10px;
	`;


class HomePage extends Component {

	handleLogout = () =>
		this.props.logout();

	render() {
		return (
			<div>
				<LogoutButton secondary content="Logout" onClick={this.handleLogout} />
				<h2>Sup</h2>
			</div>
		);
	}
}

HomePage.propTypes = {
	logout: PropTypes.func.isRequired,
};

export default connect( null, { logout })( HomePage );
