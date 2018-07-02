export const
	SET_CONVERSATIONS = "SET_CONVERSATIONS",
	SELECT_CONVERSATION = "SELECT_CONVERSATION",
	ADD_CONVERSATION = "ADD_CONVERSATION",
	UPDATE_CONVERSATION = "UPDATE_CONVERSATION",
	SET_NEW_MESSAGES = "SET_NEW_MESSAGES",
	ADD_MESSAGE = "ADD_MESSAGE",
	SWITCH_MESSAGES = "SWITCH_MESSAGES",
	CHECK_MESSAGE = "CHECK_MESSAGE",


	setConversations = conversations => ({
		type: SET_CONVERSATIONS,
		conversations: conversations
	}),

	selectConversation = conversation => ({
		type: SELECT_CONVERSATION,
		conversation: conversation
	}),

	addConversation = conversation => ({
		type: ADD_CONVERSATION,
		conversation: conversation
	}),

	updateConversation = ( message, index ) => ({
		type: UPDATE_CONVERSATION,
		message: message,
		index: index
	}),

	switchMessages = () => ({
		type: SWITCH_MESSAGES
	}),

	addMessage = ( message, isNewMessage ) => ({
		type: ADD_MESSAGE,
		message: message,
		isNewMessage: isNewMessage
	}),

	checkMessage = messageIndex => ({
		type: CHECK_MESSAGE,
		messageIndex: messageIndex
	});
