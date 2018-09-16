import store from "../index";
import { userLoggedOut } from "../services/actions/auth";
import api from "../services/api";

const refreshToken = async() => {
	try {
		const res = await api.refreshToken();
		localStorage.setItem( "token", res.token );
		return;
	} catch ( err ) {
		console.log( err );
		if ( err.response.data === "This user is banned" ) {
			localStorage.removeItem( "token" );
			localStorage.removeItem( "refreshToken" );
			localStorage.removeItem( "username" );
			localStorage.removeItem( "fullname" );
			localStorage.removeItem( "uimg" );
			localStorage.removeItem( "id" );
			store.dispatch( userLoggedOut());
			return;
		}
		throw err;
	}
};

export default refreshToken;
