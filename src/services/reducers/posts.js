const initialState = {
	newsfeed: [],
	explore: [],
	album: [],
	comments: [],
	mediaOptions: false,
	displayComments: false,
	displayShare: false,
	displayPostDetails: false,
	postDetailsId: undefined,
	postDetailsIndex: undefined,
	postToShare: {}
};

export default function posts( state = initialState, action = {}) {
	switch ( action.type ) {
	case "SET_POSTS":
		if ( action.onExplore ) {
			return { ...state, explore: action.posts };
		} else if ( action.onAlbum ) {
			return { ...state, album: action.posts };
		} else {
			return { ...state, newsfeed: action.posts };
		}

	case "ADD_TO_POSTS":
		if ( !action.onExplore ) {
			return { ...state, newsfeed: [ ...state.newsfeed, ...action.posts ] };
		} else {
			return { ...state, explore: [ ...state.explore, ...action.posts ] };
		}

	case "ADD_POST":
		return { ...state, newsfeed: [ action.post, ...state.newsfeed ] };

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
			comments: state.comments.filter(( comment, index ) => {
				return index !== action.commentIndex;
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

	case "SWITCH_COMMENTS":
		return {
			...state,
			displayComments: !state.displayComments,
			postDetailsId: action.postDetailsId
		};

	case "SWITCH_POST_DETAILS":
		return {
			...state,
			displayPostDetails: !state.displayPostDetails,
			postDetailsIndex: action.index
		};

	default:
		return state;
	}
};
