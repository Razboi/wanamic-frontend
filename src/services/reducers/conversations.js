const initialState = {
	allConversations: [],
	selectedConversation: 0,
	newConversation: undefined,
	displayMessages: false,
	displayConversation: false
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
						messages: [ ...conver.messages, action.message ]
					};
				}
				return conver;
			})
		};

	case "DELETE_CHAT":
		return {
			...state,
			allConversations: state.allConversations.filter( conver =>
				conver.target._id !== action.target._id
			)
		};

	case "SWITCH_MESSAGES":
		return {
			...state,
			displayMessages: !state.displayMessages
		};

	case "SWITCH_CONVERSATION":
		return {
			...state,
			displayConversation: action.shouldDisplay
		};

	case "INCREMENT_CHAT_NEW_MESSAGES":
		return {
			...state,
			allConversations: state.allConversations.map(( conver, index ) => {
				if ( index === action.index && ( index !==
					state.selectedConversation || !state.displayConversation )) {
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
