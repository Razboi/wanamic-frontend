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
		api.login( credentials ).then( data => {
			if ( data && data.token && data.username ) {
				localStorage.setItem( "token", data.token );
				localStorage.setItem( "username", data.username );
				localStorage.setItem( "id", data.id );
				dispatch( userLoggedIn());
			}
		}).catch( err => {
			throw err;
		}),

	signup = credentials => dispatch =>
		api.signup( credentials ).then( data => {
			if ( data && data.token && data.username ) {
				localStorage.setItem( "token", data.token );
				localStorage.setItem( "username", data.username );
				localStorage.setItem( "id", data.id );
				localStorage.setItem( "NU", true );
				dispatch( userLoggedIn());
			}
		}).catch( err => {
			throw err;
		}),

	logout = () => dispatch => {
		localStorage.removeItem( "token" );
		localStorage.removeItem( "username" );
		localStorage.removeItem( "id" );
		dispatch( userLoggedOut());
	};
