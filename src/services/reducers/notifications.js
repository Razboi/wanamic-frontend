const initialState = {
	allNotifications: [],
	newNotifications: 0,
	displayNotifications: false
};

export default function notifications( state = initialState, action = {}) {
	switch ( action.type ) {

	case "SET_NOTIFICATIONS":
		return {
			...state,
			allNotifications: action.allNotifications,
			newNotifications: action.newNotifications
		};

	case "ADD_TO_NOTIFICATIONS":
		return {
			...state,
			allNotifications: [
				...state.allNotifications, ...action.notifications
			]
		};

	case "SWITCH_NOTIFICATIONS":
		return {
			...state,
			displayNotifications: !state.displayNotifications
		};

	case "ADD_NOTIFICATION":
		return {
			...state,
			allNotifications: [ action.notification, ...state.allNotifications ],
			newNotifications: state.newNotifications + 1
		};

	case "DELETE_NOTIFICATION":
		return {
			...state,
			allNotifications: state.allNotifications.filter(( notification, index ) => {
				return index !== action.notificationIndex;
			})
		};

	case "CHECK_NOTIFICATIONS":
		return {
			...state,
			newNotifications: 0
		};

	default:
		return state;
	}
};
