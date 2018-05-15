const initialState = {
	allMessages: [],
	newMessages: 0,
	displayMessages: false
};

export default function notifications( state = initialState, action = {}) {
	switch ( action.type ) {

	case "SET_MESSAGES":
		return {
			...state,
			allMessages: action.allMessages,
			newMessages: action.newMessages
		};

	case "SWITCH_MESSAGES":
		return {
			...state,
			displayMessages: !state.displayMessages
		};

	case "ADD_MESSAGE":
		return {
			...state,
			allMessages: [ ...state.allMessages, action.message ],
			newMessages: state.newMessages + 1
		};

	case "CHECK_MESSAGE":
		return {
			...state,
			allMessages: state.allMessages.map(( message, index ) => {
				if ( index === action.messageIndex ) {
					return {
						...message,
						...state.allMessages[ action.messageIndex ].checked = true
					};
				}
				return message;
			}),
			newMessages: state.newMessages - 1
		};

	default:
		return state;
	}
};
