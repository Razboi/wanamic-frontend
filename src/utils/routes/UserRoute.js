import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Route, Redirect } from "react-router-dom";

const UserRoute = ({ authenticated, component: Component, ...rest }) => (
	<Route
		{...rest}
		render={props =>
			authenticated ?
				localStorage.getItem( "NU" ) ?
					<Redirect to="/welcome" />
					:
					<Component socket={rest.socket} {...props} />
				:
				<Redirect to="/login" />}
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

export default connect( mapStateToProps )( UserRoute );
