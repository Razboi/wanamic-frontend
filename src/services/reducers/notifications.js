const initialState = {
	allNotifications: [],
	newNotifications: []
};

export default function notifications( state = initialState, action = {}) {
	switch ( action.type ) {

	case "SET_NOTIFICATIONS":
		return {
			...state,
			allNotifications: action.allNotifications,
			newNotifications: action.newNotifications
		};

	case "ADD_NOTIFICATION":
		return {
			...state,
			notifications: [ action.notification, ...state.all ]
		};

	case "DELETE_NOTIFICATION":
		return {
			...state,
			notifications: state.all.filter(( notification, index ) => {
				return index !== action.notificationIndex;
			})
		};

	default:
		return state;
	}
};
