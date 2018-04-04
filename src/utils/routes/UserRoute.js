import React from "react";
import PropTypes from "prop-types";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

const UserRoute = ({ authenticated, component: Component, ...rest }) => (
	<Route
		{...rest}
		render={props =>
			authenticated ? <Component {...props} /> : <Redirect to="/login" />}
	/>
);

UserRoute.propTypes = {
	component: PropTypes.func.isRequired,
	authenticated: PropTypes.bool.isRequired
};

function mapStateToProps( state ) {
	return {
		authenticated: !!state.authenticated
	};
};

export default withRouter( connect( mapStateToProps )( UserRoute ));
