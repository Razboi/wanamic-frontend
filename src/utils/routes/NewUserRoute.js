import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Route, Redirect } from "react-router-dom";


const NewUserRoute = ({ authenticated, component: Component, ...rest }) => (
	<Route
		{...rest}
		render={props =>
			authenticated ?
				localStorage.getItem( "NU" ) === null ?
					<Redirect to="/" />
					:
					<Component socket={rest.socket} {...props} />
				:
				<Redirect to="/login" />}
	/>
);

NewUserRoute.propTypes = {
	component: PropTypes.func.isRequired,
	authenticated: PropTypes.bool.isRequired
};

function mapStateToProps( state ) {
	return {
		authenticated: !!state.authenticated
	};
};

export default connect( mapStateToProps )( NewUserRoute );
