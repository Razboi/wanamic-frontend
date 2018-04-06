import api from "../api";

export const
	userLoggedIn = () => ({
		type: "USER_LOGGED_IN"
	}),

	userLoggedOut = () => ({
		type: "USER_LOGGED_OUT"
	}),

	// pass the credentials to the login api, then if the response is a token
	// save it to localStorage and dispatch userLoggedIn action
	login = credentials => dispatch =>
		api.login( credentials ).then( token => {
			if ( token ) {
				localStorage.setItem( "token", token );
				dispatch( userLoggedIn());
			}
		}).catch( err => console.log( err )),

	signup = credentials => dispatch =>
		api.signup( credentials ).then( token => {
			if ( token ) {
				localStorage.setItem( "token", token );
				dispatch( userLoggedIn());
			}
		}).catch( err => console.log( err )),

	logout = () => dispatch => {
		localStorage.removeItem( "token" );
		dispatch( userLoggedOut());
	};
