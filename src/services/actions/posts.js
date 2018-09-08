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
	UPDATE_COMMENT = "UPDATE_COMMENT",
	UPDATE_POST = "UPDATE_POST",
	ADD_POST = "ADD_POST",
	DELETE_POST = "DELETE_POST",
	SWITCH_POST_DETAILS = "SWITCH_POST_DETAILS",
	ADD_TO_COMMENTS = "ADD_TO_COMMENTS",
	SET_FEED = "SET_FEED",
	SET_CLUB = "SET_CLUB",
	SET_CLUBS = "SET_CLUBS",


	setPosts = ( posts, onExplore, onAlbum, onProfile ) => ({
		type: SET_POSTS,
		posts: posts,
		onExplore: onExplore,
		onAlbum: onAlbum,
		onProfile: onProfile
	}),

	addToPosts = ( posts, onExplore, onProfile ) => ({
		type: ADD_TO_POSTS,
		posts: posts,
		onExplore: onExplore,
		onProfile: onProfile
	}),

	addPost = ( post, onProfile ) => ({
		type: ADD_POST,
		post: post,
		onProfile: onProfile
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

	addToComments = comments => ({
		type: ADD_TO_COMMENTS,
		comments: comments
	}),

	addComment = comment => ({
		type: ADD_COMMENT,
		comment: comment
	}),

	updateComment = comment => ({
		type: UPDATE_COMMENT,
		comment: comment
	}),

	deleteComment = commentId => ({
		type: DELETE_COMMENT,
		commentId: commentId
	}),

	switchMediaOptions = () => ({
		type: SWITCH_MEDIA_OPTIONS
	}),

	switchShare = post => ({
		type: SWITCH_SHARE,
		post: post
	}),

	setFeed = feed => ({
		type: SET_FEED,
		feed: feed
	}),

	setClub = club => ({
		type: SET_CLUB,
		club: club
	}),

	setClubs = clubs => ({
		type: SET_CLUBS,
		clubs: clubs
	}),

	switchPostDetails = post => ({
		type: SWITCH_POST_DETAILS,
		post: post
	});
