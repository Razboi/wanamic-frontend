const initialState = {
	newsfeed: [],
	comments: [],
	mediaOptions: false,
	displayComments: false,
	postDetailsId: undefined,
	postDetailsIndex: undefined
};

export default function posts( state = initialState, action = {}) {
	switch ( action.type ) {
	case "SET_NEWSFEED":
		return { ...state, newsfeed: action.posts };
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
		return { ...state, comments: [ ...state.comments, action.comment ] };
	case "DELETE_COMMENT":
		return {
			...state,
			comments: state.comments.filter(( comment, index ) => {
				return index !== action.commentIndex;
			})
		};
	case "SWITCH_MEDIA_OPTIONS":
		return { ...state, mediaOptions: !state.mediaOptions };
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
