import api from "../services/api";

const refreshToken = store => {
	return new Promise( function( resolve, reject ) {

		api.refreshToken()
			.then( res => {
				localStorage.setItem( "token", res.token );
				resolve();
			}).catch( err => reject( err ));
	});
};

export default refreshToken;
