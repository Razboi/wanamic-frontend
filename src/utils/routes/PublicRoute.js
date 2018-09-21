import React from "react";
import PropTypes from "prop-types";
import { Route } from "react-router-dom";


const PublicRoute = ({ component: Component, ...rest }) => (
	<Route
		{...rest}
		render={props => <Component socket={rest.socket} {...props} />}
	/>
);

PublicRoute.propTypes = {
	component: PropTypes.func.isRequired
};

export default PublicRoute;
