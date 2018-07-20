export const
	SET_NOTIFICATIONS = "SET_NOTIFICATIONS",
	SET_NEW_NOTIFICATIONS = "SET_NEW_NOTIFICATIONS",
	ADD_TO_NOTIFICATIONS = "ADD_TO_NOTIFICATIONS",
	ADD_NOTIFICATION = "ADD_NOTIFICATION",
	DELETE_NOTIFICATION = "DELETE_NOTIFICATION",
	SWITCH_NOTIFICATIONS = "SWITCH_NOTIFICATIONS",
	CHECK_NOTIFICATIONS = "CHECK_NOTIFICATIONS",


	setNotifications = allNotifications => ({
		type: SET_NOTIFICATIONS,
		allNotifications: allNotifications
	}),

	setNewNotifications = newNotifications => ({
		type: SET_NEW_NOTIFICATIONS,
		newNotifications: newNotifications
	}),

	addToNotifications = notifications => ({
		type: ADD_TO_NOTIFICATIONS,
		notifications: notifications
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

	checkNotifications = () => ({
		type: CHECK_NOTIFICATIONS
	});
