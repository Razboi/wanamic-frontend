
// gets current state and the action, returns the next state
export default function authenticated( state = {}, action = {}) {
	switch ( action.type ) {
	case "USER_LOGGED_IN":
		return true;
	case "USER_LOGGED_OUT":
		return false;
	default:
		return false;
	}
}
