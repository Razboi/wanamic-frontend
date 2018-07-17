export const
	// action types
	SET_POSTS = "SET_POSTS",
	ADD_TO_POSTS = "ADD_TO_POSTS",
	SWITCH_MEDIA_OPTIONS = "SWITCH_MEDIA_OPTIONS",
	SWITCH_COMMENTS = "SWITCH_COMMENTS",
	SWITCH_SHARE = "SWITCH_SHARE",
	SET_COMMENTS = "SET_COMMENTS",
	ADD_COMMENT = "ADD_COMMENT",
	DELETE_COMMENT = "DELETE_COMMENT",
	UPDATE_POST = "UPDATE_POST",
	ADD_POST = "ADD_POST",
	DELETE_POST = "DELETE_POST",
	SWITCH_POST_DETAILS = "SWITCH_POST_DETAILS",


	setPosts = ( posts, onExplore, onAlbum ) => ({
		type: SET_POSTS,
		posts: posts,
		onExplore: onExplore,
		onAlbum: onAlbum
	}),

	addToPosts = ( posts, onExplore ) => ({
		type: ADD_TO_POSTS,
		posts: posts,
		onExplore: onExplore
	}),

	addPost = post => ({
		type: ADD_POST,
		post: post
	}),

	deletePost = postId => ({
		type: DELETE_POST,
		postId: postId
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
	}),

	switchPostDetails = () => ({
		type: SWITCH_POST_DETAILS
	});
