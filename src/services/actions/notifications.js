export const
	// action types
	SET_NOTIFICATIONS = "SET_NOTIFICATIONS",
	ADD_NOTIFICATION = "ADD_NOTIFICATION",
	DELETE_NOTIFICATION = "DELETE_NOTIFICATION",


	setNotifications = notifications => ({
		type: SET_NOTIFICATIONS,
		notifications: notifications
	}),

	addNotification = notification => ({
		type: ADD_NOTIFICATION,
		notification: notification
	}),

	deleteNotification = notificationIndex => ({
		type: DELETE_NOTIFICATION,
		notificationIndex: notificationIndex
	});
