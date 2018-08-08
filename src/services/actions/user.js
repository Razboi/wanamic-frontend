export const
	SET_LIKES_AND_VIEWS = "SET_LIKES_AND_VIEWS",


	setupLikesViews = ( totalLikes, totalViews ) => ({
		type: SET_LIKES_AND_VIEWS,
		totalLikes: totalLikes,
		totalViews: totalViews
	});
