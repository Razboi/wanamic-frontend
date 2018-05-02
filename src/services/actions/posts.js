export const
	// action types
	SET_NEWSFEED = "SET_NEWSFEED",

	// action creators
	setNewsfeed = posts => ({
		type: SET_NEWSFEED,
		posts: posts
	});
