export const
	SET_MESSAGES = "SET_MESSAGES",
	ADD_MESSAGE = "ADD_MESSAGE",
	SWITCH_MESSAGES = "SWITCH_MESSAGES",
	CHECK_MESSAGE = "CHECK_MESSAGE",


	setMessages = ( allMessages, newMessages ) => ({
		type: SET_MESSAGES,
		allMessages: allMessages,
		newMessages: newMessages
	}),

	switchMessages = () => ({
		type: SWITCH_MESSAGES
	}),

	addMessage = message => ({
		type: ADD_MESSAGE,
		message: message
	}),

	checkMessage = messageIndex => ({
		type: CHECK_MESSAGE,
		messageIndex: messageIndex
	});
