const initialState = {
	allConversations: [],
	selectedConversation: 0,
	newConversation: undefined,
	notifications: [],
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
			selectedConversation: action.index,
			notifications: state.notifications.filter( author =>
				author !== state.allConversations[ action.index ].target.username
			),
			allConversations: state.allConversations.map(( conver, index ) => {
				if ( index === action.index ) {
					return {
						...conver,
						newMessagesCount: 0
					};
				}
				return conver;
			})
		};

	case "SETUP_NEW_CONVERSATION":
		return {
			...state,
			newConversation: action.conversation
		};

	case "ADD_CONVERSATION":
		return {
			...state,
			newConversation: undefined,
			allConversations: [ action.conversation, ...state.allConversations ]
		};

	case "UPDATE_CONVERSATION":
		return {
			...state,
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

	case "SET_CHAT_NOTIFICATIONS":
		return {
			...state,
			notifications: action.notifications
		};

	case "ADD_CHAT_NOTIFICATION":
		return {
			...state,
			notifications: [ action.newNotification, ...state.notifications ]
		};

	case "INCREMENT_CHAT_NEW_MESSAGES":
		return {
			...state,
			allConversations: state.allConversations.map(( conver, index ) => {
				if ( index === action.index ) {
					return {
						...conver,
						newMessagesCount: conver.newMessagesCount += 1
					};
				}
				return conver;
			})
		};

	default:
		return state;
	}
};
