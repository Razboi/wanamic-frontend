export const
	SET_CONVERSATIONS = "SET_CONVERSATIONS",
	SELECT_CONVERSATION = "SELECT_CONVERSATION",
	SETUP_NEW_CONVERSATION = "SETUP_NEW_CONVERSATION",
	ADD_CONVERSATION = "ADD_CONVERSATION",
	UPDATE_CONVERSATION = "UPDATE_CONVERSATION",
	DELETE_CHAT = "DELETE_CHAT",
	INCREMENT_CHAT_NEW_MESSAGES = "INCREMENT_CHAT_NEW_MESSAGES",
	SWITCH_MESSAGES = "SWITCH_MESSAGES",
	SWITCH_CONVERSATION = "SWITCH_CONVERSATION",


	setConversations = conversations => ({
		type: SET_CONVERSATIONS,
		conversations: conversations
	}),

	selectConversation = index => ({
		type: SELECT_CONVERSATION,
		index: index
	}),

	setupNewConversation = conversation => ({
		type: SETUP_NEW_CONVERSATION,
		conversation: conversation
	}),

	addConversation = conversation => ({
		type: ADD_CONVERSATION,
		conversation: conversation
	}),

	deleteChat = target => ({
		type: DELETE_CHAT,
		target: target
	}),

	updateConversation = ( message, index ) => ({
		type: UPDATE_CONVERSATION,
		message: message,
		index: index
	}),

	switchMessages = () => ({
		type: SWITCH_MESSAGES
	}),

	switchConversation = shouldDisplay => ({
		type: SWITCH_CONVERSATION,
		shouldDisplay: shouldDisplay
	}),

	incrementChatNewMessages = index => ({
		type: INCREMENT_CHAT_NEW_MESSAGES,
		index: index
	});
