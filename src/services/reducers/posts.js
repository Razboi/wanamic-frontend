const initialState = {
	newsfeed: [],
	explore: [],
	album: [],
	profilePosts: [],
	comments: [],
	mediaOptions: false,
	displayShare: false,
	displayPostDetails: false,
	postDetails: {},
	postToShare: {},
	feed: "global",
	selectedClub: undefined,
	clubs: []
};

export default function posts( state = initialState, action = {}) {
	switch ( action.type ) {
	case "SET_POSTS":
		if ( action.onExplore ) {
			return { ...state, explore: action.posts };
		} else if ( action.onAlbum ) {
			return { ...state, album: action.posts };
		} else if ( action.onProfile ) {
			return { ...state, profilePosts: action.posts };
		} else {
			return { ...state, newsfeed: action.posts };
		}

	case "ADD_TO_POSTS":
		if ( action.onExplore ) {
			return { ...state, explore: [ ...state.explore, ...action.posts ] };
		} else if ( action.onProfile ) {
			return { ...state, profilePosts: [ ...state.profilePosts, ...action.posts ] };
		} else {
			return { ...state, newsfeed: [ ...state.newsfeed, ...action.posts ] };
		}

	case "ADD_POST":
		if ( action.onProfile ) {
			return { ...state, profilePosts: [ action.post, ...state.profilePosts ] };
		} else {
			return { ...state, newsfeed: [ action.post, ...state.newsfeed ] };
		}

	case "DELETE_POST":
		return {
			...state,
			newsfeed: state.newsfeed.filter( post => {
				return post._id !== action.postId;
			}),
			album: state.album.filter( post => {
				return post._id !== action.postId;
			}),
			explore: state.explore.filter( post => {
				return post._id !== action.postId;
			}),
			profilePosts: state.profilePosts.filter( post => {
				return post._id !== action.postId;
			}),
			displayPostDetails: false
		};


	case "SET_COMMENTS":
		return { ...state, comments: action.comments };

	case "ADD_TO_COMMENTS":
		return {
			...state,
			comments: [ ...state.comments, ...action.comments ]
		};

	case "UPDATE_POST":
		return {
			...state,
			profilePosts: state.profilePosts.map( post => {
				if ( post._id === action.post._id ) {
					return { ...post, ...action.post };
				}
				return post;
			}),
			explore: state.explore.map( post => {
				if ( post._id === action.post._id ) {
					return { ...post, ...action.post };
				}
				return post;
			}),
			album: state.album.map( post => {
				if ( post._id === action.post._id ) {
					return { ...post, ...action.post };
				}
				return post;
			}),
			newsfeed: state.newsfeed.map( post => {
				if ( post._id === action.post._id ) {
					return { ...post, ...action.post };
				}
				return post;
			})
		};

	case "ADD_COMMENT":
		return { ...state, comments: [ action.comment, ...state.comments ] };

	case "DELETE_COMMENT":
		return {
			...state,
			comments: state.comments.filter( comment => {
				return comment._id !== action.commentId;
			})
		};

	case "UPDATE_COMMENT":
		return {
			...state,
			comments: state.comments.map( comment => {
				if ( comment._id === action.comment._id ) {
					return { ...comment, ...action.comment };
				}
				return comment;
			})
		};

	case "SWITCH_MEDIA_OPTIONS":
		return { ...state, mediaOptions: !state.mediaOptions };

	case "SWITCH_SHARE":
		return {
			...state,
			displayShare: !state.displayShare,
			postToShare: action.post
		};

	case "SWITCH_POST_DETAILS":
		return {
			...state,
			displayPostDetails: !state.displayPostDetails,
			postDetails: action.post
		};

	case "SET_FEED":
		return {
			...state,
			feed: action.feed
		};

	case "SET_CLUB":
		return {
			...state,
			selectedClub: action.club
		};

	case "SET_CLUBS":
		return {
			...state,
			clubs: action.clubs
		};

	default:
		return state;
	}
};
