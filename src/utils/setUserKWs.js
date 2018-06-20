import api from "../services/api";
import refreshToken from "../utils/refreshToken";
var keywordsArray = undefined;

const setKW = keywordsString => {
	if ( !keywordsArray ) {
		keywordsArray = ( keywordsString ).split( /\s*#/ );
		keywordsArray.shift();
	}

	api.setUserKw( keywordsArray )
		.then( res => {
			if ( res === "jwt expired" ) {
				refreshToken()
					.then(() => this.setKW( keywordsString ))
					.catch( err => console.log( err ));
			}
		}).catch( err => console.log( err ));
};

export default setKW;
