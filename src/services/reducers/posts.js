const initialState = {
	newsfeed: []
};

export default function posts( state = initialState, action = {}) {
	switch ( action.type ) {
	case "SET_NEWSFEED":
		return { ...state, newsfeed: action.posts };
	default:
		return state;
	}
};
