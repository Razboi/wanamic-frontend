export const
	// action types
	SET_NOTIFICATIONS = "SET_NOTIFICATIONS",
	ADD_NOTIFICATION = "ADD_NOTIFICATION",
	DELETE_NOTIFICATION = "DELETE_NOTIFICATION",
	SWITCH_NOTIFICATIONS = "SWITCH_NOTIFICATIONS",
	CHECK_NOTIFICATION = "CHECK_NOTIFICATION",


	setNotifications = ( allNotifications, newNotifications ) => ({
		type: SET_NOTIFICATIONS,
		allNotifications: allNotifications,
		newNotifications: newNotifications
	}),

	switchNotifications = () => ({
		type: SWITCH_NOTIFICATIONS
	}),

	addNotification = notification => ({
		type: ADD_NOTIFICATION,
		notification: notification
	}),

	deleteNotification = notificationIndex => ({
		type: DELETE_NOTIFICATION,
		notificationIndex: notificationIndex
	}),

	checkNotification = notificationIndex => ({
		type: CHECK_NOTIFICATION,
		notificationIndex: notificationIndex
	});
