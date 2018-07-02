const initialState = {
	allConversations: [],
	currentConversation: {},
	newMessages: 0,
	displayMessages: false
};

export default function conversations( state = initialState, action = {}) {
	switch ( action.type ) {

	case "SET_CONVERSATIONS":
		return {
			...state,
			allConversations: action.conversations
		};

	case "SELECT_CONVERSATION":
		return {
			...state,
			currentConversation: action.conversation
		};

	case "ADD_CONVERSATION":
		return {
			...state,
			allConversations: [ action.conversation, ...state.allConversations ]
		};

	case "UPDATE_CONVERSATION":
		return {
			...state,
			currentConversation: {
				...state.currentConversation,
				messages: [ action.message, ...state.currentConversation.messages ]
			},
			allConversations: state.allConversations.map(( conver, index ) => {
				if ( index === action.index ) {
					return {
						...conver,
						messages: [ action.message, ...conver.messages ]
					};
				}
				return conver;
			})
		};

	case "SWITCH_MESSAGES":
		return {
			...state,
			displayMessages: !state.displayMessages
		};

	case "ADD_MESSAGE":
		return {
			...state,
			currentConversation: {
				...state.currentConversation,
				messages: [ action.message, ...state.currentConversation.messages ]
			},
			newMessages: action.isNewMessage ?
				state.newMessages + 1
				:
				state.newMessages
		};

	case "CHECK_MESSAGE":
		return {
			...state,
			currentMessages: state.currentMessages.map(( message, index ) => {
				if ( index === action.messageIndex ) {
					return {
						...message,
						...state.currentMessages[ action.messageIndex ].checked = true
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
