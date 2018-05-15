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

	case "SWITCH_NOTIFICATIONS":
		return {
			...state,
			displayNotifications: !state.displayNotifications
		};

	case "ADD_NOTIFICATION":
		return {
			...state,
			allNotifications: [ action.notification, ...state.allNotifications ]
		};

	case "DELETE_NOTIFICATION":
		return {
			...state,
			allNotifications: state.allNotifications.filter(( notification, index ) => {
				return index !== action.notificationIndex;
			})
		};

	case "CHECK_NOTIFICATION":
		return {
			...state,
			allNotifications: state.allNotifications.map(( notification, index ) => {
				if ( index === action.notificationIndex ) {
					return {
						...notification,
						...state.allNotifications[ action.notificationIndex ].checked = true
					};
				}
				return notification;
			}),
			newNotifications: state.newNotifications - 1
		};

	default:
		return state;
	}
};
