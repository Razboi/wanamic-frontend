export const
	// action types
	SET_NEWSFEED = "SET_NEWSFEED",
	ADD_TO_NEWSFEED = "ADD_TO_NEWSFEED",
	SWITCH_MEDIA_OPTIONS = "SWITCH_MEDIA_OPTIONS",
	SWITCH_COMMENTS = "SWITCH_COMMENTS",
	SWITCH_SHARE = "SWITCH_SHARE",
	SET_COMMENTS = "SET_COMMENTS",
	ADD_COMMENT = "ADD_COMMENT",
	DELETE_COMMENT = "DELETE_COMMENT",
	UPDATE_POST = "UPDATE_POST",
	ADD_POST = "ADD_POST",
	DELETE_POST = "DELETE_POST",

	// action creators
	setNewsfeed = posts => ({
		type: SET_NEWSFEED,
		posts: posts
	}),

	addToNewsfeed = posts => ({
		type: ADD_TO_NEWSFEED,
		posts: posts
	}),

	addPost = post => ({
		type: ADD_POST,
		post: post
	}),

	deletePost = postIndex => ({
		type: DELETE_POST,
		postIndex: postIndex
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

	switchShare = postIndex => ({
		type: SWITCH_SHARE,
		postIndex: postIndex
	}),

	switchComments = ( id ) => ({
		type: SWITCH_COMMENTS,
		postDetailsId: id
	});
