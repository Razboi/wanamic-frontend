const initialState = {
	notifications: []
};

export default function notifications( state = initialState, action = {}) {
	switch ( action.type ) {

	case "SET_NOTIFICATIONS":
		return { ...state, notifications: action.notifications };

	case "ADD_NOTIFICATION":
		return {
			...state,
			notifications: [ action.notification, ...state.notifications ]
		};

	case "DELETE_NOTIFICATION":
		return {
			...state,
			notifications: state.notifications.filter(( notification, index ) => {
				return index !== action.notificationIndex;
			})
		};

	default:
		return state;
	}
};
