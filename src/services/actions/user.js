export const
	SET_LIKES_AND_VIEWS = "SET_LIKES_AND_VIEWS",
	TOGGLE_FEEDBACK_FORM = "TOGGLE_FEEDBACK_FORM",


	setupLikesViews = ( totalLikes, totalViews ) => ({
		type: SET_LIKES_AND_VIEWS,
		totalLikes: totalLikes,
		totalViews: totalViews
	}),

	toggleFeedbackForm = () => ({
		type: TOGGLE_FEEDBACK_FORM
	});
