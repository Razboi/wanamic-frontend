const initialState = {
	totalLikes: 0,
	totalViews: 0,
	feedback: false
};

export default function user( state = initialState, action = {}) {
	switch ( action.type ) {

	case "SET_LIKES_AND_VIEWS":
		return {
			...state,
			totalLikes: action.totalLikes,
			totalViews: action.totalViews
		};

	case "TOGGLE_FEEDBACK_FORM":
		return { ...state, feedback: !state.feedback };

	default:
		return state;
	}
};
