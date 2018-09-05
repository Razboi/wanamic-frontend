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
				localStorage.setItem( "refreshToken", data.refreshToken );
				localStorage.setItem( "username", data.username );
				localStorage.setItem( "fullname", data.fullname );
				if ( data.profileImage ) {
					localStorage.setItem( "uimg", data.profileImage );
				}
				if ( data.admin ) {
					localStorage.setItem( "ai", true );
				}
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
				localStorage.setItem( "refreshToken", data.refreshToken );
				localStorage.setItem( "username", data.username );
				localStorage.setItem( "fullname", data.fullname );
				localStorage.setItem( "uimg", data.profileImage );
				localStorage.setItem( "id", data.id );
				localStorage.setItem( "NU", true );
				dispatch( userLoggedIn());
			}
		}).catch( err => {
			throw err;
		}),

	logout = () => dispatch => {
		localStorage.removeItem( "token" );
		localStorage.removeItem( "refreshToken" );
		localStorage.removeItem( "username" );
		localStorage.removeItem( "fullname" );
		localStorage.removeItem( "uimg" );
		localStorage.removeItem( "id" );
		dispatch( userLoggedOut());
	};
