import api from "../services/api";
import { userLoggedIn, userLoggedOut } from "../services/actions/auth";
import refreshToken from "./refreshToken";

const verifyToken = async store => {
	try {
		await api.verifyToken();
		store.dispatch( userLoggedIn());
		return;
	} catch ( err ) {
		console.log( err );
		if ( err.response.data === "jwt expired" ) {
			await refreshToken();
			verifyToken( store );
		}
		if ( err.response.data === "This user is banned" ) {
			localStorage.removeItem( "token" );
			localStorage.removeItem( "refreshToken" );
			localStorage.removeItem( "username" );
			localStorage.removeItem( "fullname" );
			localStorage.removeItem( "uimg" );
			localStorage.removeItem( "id" );
			store.dispatch( userLoggedOut());
		}
		return;
	}
};

export default verifyToken;
