const initialState = {
	newsfeed: [],
	comments: [],
	mediaOptions: false,
	displayComments: false,
	displayShare: false,
	postDetailsId: undefined,
	postDetailsIndex: undefined,
	postToShare: {}
};

export default function posts( state = initialState, action = {}) {
	switch ( action.type ) {
	case "SET_NEWSFEED":
		return { ...state, newsfeed: action.posts };

	case "ADD_TO_NEWSFEED":
		return { ...state, newsfeed: [ ...action.posts, ...state.newsfeed ] };

	case "ADD_POST":
		return { ...state, newsfeed: [ action.post, ...state.newsfeed ] };

	case "DELETE_POST":
		return {
			...state,
			newsfeed: state.newsfeed.filter(( post, index ) => {
				return index !== action.postIndex;
			})
		};

	case "SET_COMMENTS":
		return { ...state, comments: action.comments };

	case "UPDATE_POST":
		return { ...state, newsfeed: state.newsfeed.map( post => {
			if ( post._id === action.post._id ) {
				return { ...post, ...action.post };
			}
			return post;
		}) };

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
			postDetailsIndex: action.postIndex,
			postToShare: state.newsfeed[ action.postIndex ]
		};

	case "SWITCH_COMMENTS":
		return {
			...state,
			displayComments: !state.displayComments,
			postDetailsId: action.postDetailsId,
			postDetailsIndex: action.postDetailsIndex
		};

	default:
		return state;
	}
};
