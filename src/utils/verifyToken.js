import api from "../services/api";
import { userLoggedIn, userLoggedOut } from "../services/actions/auth";
import refreshToken from "./refreshToken";

const verifyToken = store => {
	return new Promise(( resolve, reject ) => {
		async function main() {
			try {
				await api.verifyToken();
				store.dispatch( userLoggedIn());
				resolve();
			} catch ( err ) {
				if ( err.response && err.response.data === "jwt expired" ) {
					await refreshToken();
					main();
					return;
				}
				if ( err.response && err.response.data === "This user is banned" ) {
					localStorage.removeItem( "token" );
					localStorage.removeItem( "refreshToken" );
					localStorage.removeItem( "username" );
					localStorage.removeItem( "fullname" );
					localStorage.removeItem( "uimg" );
					localStorage.removeItem( "id" );
					store.dispatch( userLoggedOut());
				}
				if ( err.response.status !== 422 ) {
					console.log( err );
				}
				resolve();
			}
		};
		main();
	});
};

export default verifyToken;
