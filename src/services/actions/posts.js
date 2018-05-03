export const
	// action types
	SET_NEWSFEED = "SET_NEWSFEED",
	SWITCH_MEDIA_OPTIONS = "SWITCH_MEDIA_OPTIONS",
	SWITCH_COMMENTS = "SWITCH_COMMENTS",
	SET_COMMENTS = "SET_COMMENTS",
	ADD_COMMENT = "ADD_COMMENT",
	DELETE_COMMENT = "DELETE_COMMENT",
	UPDATE_POST = "UPDATE_POST",

	// action creators
	setNewsfeed = posts => ({
		type: SET_NEWSFEED,
		posts: posts
	}),

	updatePost = post => ({
		type: UPDATE_POST,
		post: post
	}),

	setComments = comments => ({
		type: SET_COMMENTS,
		comments: comments
	}),

	addComment = comment => ({
		type: ADD_COMMENT,
		comment: comment
	}),

	deleteComment = commentIndex => ({
		type: DELETE_COMMENT,
		commentIndex: commentIndex
	}),

	switchMediaOptions = () => ({
		type: SWITCH_MEDIA_OPTIONS
	}),

	switchComments = ( id, index ) => ({
		type: SWITCH_COMMENTS,
		postDetailsId: id,
		postDetailsIndex: index
	});
