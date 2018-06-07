import api from "../services/api";
import { userLoggedIn } from "../services/actions/auth";

const verifyToken = store => {
	return new Promise( function( resolve, reject ) {

		api.verifyToken()
			.then( res => {

				if ( res === "jwt expired" ) {
					api.refreshToken().then( res => {
						if ( !res.token ) {
							reject( "New token is undefined" );
						}
						localStorage.setItem( "token", res.token );
						store.dispatch( userLoggedIn());
						resolve();
					}).catch( err => reject( err ));

				} else {
					if ( res === "OK" ) {
						store.dispatch( userLoggedIn());
					}
					resolve();
				}
			}).catch( err => reject( err ));
	});
};

export default verifyToken;
