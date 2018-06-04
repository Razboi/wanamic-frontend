import axios from "axios";

export default {
	login: credentials =>
		axios({
			method: "post",
			url: "/auth/login",
			data: { credentials: credentials }
		})
			.then( res => res.data )
			.catch( err => {
				throw err;
			}),

	signup: credentials =>
		axios({
			method: "post",
			url: "/auth/signup",
			data: { credentials: credentials }
		})
			.then( res => res.data )
			.catch( err => {
				throw err;
			}),

	verifyToken: () =>
		axios({
			method: "post",
			url: "/auth/verify",
			data: { token: localStorage.getItem( "token" ) }
		})
			.then( res => res.data )
			.catch( err => err.response.data ),

	refreshToken: () =>
		axios({
			method: "post",
			url: "/auth/token",
			data: { refreshToken: localStorage.getItem( "refreshToken" ) }
		})
			.then( res => res.data )
			.catch( err => err ),

	createPost: post =>
		axios({
			method: "post",
			url: "/posts/create",
			data: { token: localStorage.getItem( "token" ), post: post }
		})
			.then( res => res.data )
			.catch( err => err.response.data ),

	createMediaPost: data =>
		axios({
			method: "post",
			url: "/posts/media",
			data: { token: localStorage.getItem( "token" ), data: data }
		})
			.then( res => res.data )
			.catch( err => err.response.data ),

	createMediaLink: data =>
		axios({
			method: "post",
			url: "/posts/mediaLink",
			data: { token: localStorage.getItem( "token" ), data: data }
		})
			.then( res => res.data )
			.catch( err => err.response.data ),

	createMediaPicture: data =>
		axios({
			method: "post",
			url: "/posts/mediaPicture",
			data: data
		})
			.then( res => res.data )
			.catch( err => err.response.data ),

	getNewsFeed: skip =>
		axios({
			method: "post",
			url: "posts/newsfeed/" + skip,
			data: { token: localStorage.getItem( "token" ) }
		})
			.then( res => res )
			.catch( err => err.response.data ),

	getTimeline: ( skip, username ) =>
		axios({
			method: "get",
			url: "posts/" + username + "/" + skip,
		})
			.then( res => res )
			.catch( err => console.log( err )),

	deletePost: postId =>
		axios({
			method: "delete",
			url: "/posts/delete",
			data: { post: { id: postId, token: localStorage.getItem( "token" ) } }
		})
			.then( res => res )
			.catch( err => err.response.data ),

	updatePost: ( postId, content ) =>
		axios({
			method: "patch",
			url: "/posts/update",
			data: { data: {
				token: localStorage.getItem( "token" ),
				post: { id: postId, content: content }
			} }
		})
			.then( res => res )
			.catch( err => err.response.data ),

	getUserInfo: username =>
		axios({
			method: "get",
			url: "/user/" + username
		})
			.then( res => res )
			.catch( err => console.log( err )),

	setUserInfo: data =>
		axios({
			method: "post",
			data: data,
			url: "/user/info"
		})
			.then( res => res )
			.catch( err => err.response.data ),

	addFriend: username =>
		axios({
			method: "post",
			data: { token: localStorage.getItem( "token" ), friendUsername: username },
			url: "/friends/add"
		})
			.then( res => res )
			.catch( err => err.response.data ),

	deleteFriend: username =>
		axios({
			method: "delete",
			data: { token: localStorage.getItem( "token" ), friendUsername: username },
			url: "/friends/delete"
		})
			.then( res => res )
			.catch( err => err.response.data ),

	followUser: username =>
		axios({
			method: "post",
			data: { token: localStorage.getItem( "token" ), targetUsername: username },
			url: "/followers/follow"
		})
			.then( res => res )
			.catch( err => err.response.data ),

	getInterestsMatches: data =>
		axios({
			method: "post",
			data: { data: data },
			url: "/user/match"
		})
			.then( res => res )
			.catch( err => err.response.data ),

	addInterests: data =>
		axios({
			method: "post",
			data: { token: localStorage.getItem( "token" ), data: data },
			url: "/user/addInterests"
		})
			.then( res => res )
			.catch( err => err.response.data ),

	setupFollow: users =>
		axios({
			method: "post",
			data: { token: localStorage.getItem( "token" ), users: users },
			url: "/followers/setupFollow"
		})
			.then( res => res )
			.catch( err => err.response.data ),

	getSugested: skip =>
		axios({
			method: "post",
			data: { skip: skip, token: localStorage.getItem( "token" ) },
			url: "/user/sugestedUsers"
		})
			.then( res => res )
			.catch( err => err.response.data ),

	getRandom: () =>
		axios({
			method: "post",
			data: { token: localStorage.getItem( "token" ) },
			url: "/user/randomUser"
		})
			.then( res => res )
			.catch( err => err.response.data ),

	matchKwUsers: ( data, skip ) =>
		axios({
			method: "post",
			data: { token: localStorage.getItem( "token" ), data: data, skip: skip },
			url: "/user/matchKwUsers"
		})
			.then( res => res )
			.catch( err => err.response.data ),

	setUserKw: data =>
		axios({
			method: "post",
			data: { token: localStorage.getItem( "token" ), data: data },
			url: "/user/setUserKw"
		})
			.then( res => res )
			.catch( err => err.response.data ),

	exploreContent: skip =>
		axios({
			method: "get",
			url: "/posts/explore/" + skip
		})
			.then( res => res )
			.catch( err => console.log( err )),

	likePost: postId =>
		axios({
			method: "post",
			data: { token: localStorage.getItem( "token" ), postId: postId },
			url: "/posts/like/"
		})
			.then( res => res )
			.catch( err => err.response.data ),

	dislikePost: postId =>
		axios({
			method: "patch",
			data: { token: localStorage.getItem( "token" ), postId: postId },
			url: "/posts/dislike/"
		})
			.then( res => res )
			.catch( err => err.response.data ),

	createComment: ( comment, postId ) =>
		axios({
			method: "post",
			data: {
				token: localStorage.getItem( "token" ),
				comment: comment,
				postId: postId
			},
			url: "/comments/create/"
		})
			.then( res => res )
			.catch( err => err.response.data ),

	deleteComment: ( commentId, postId ) =>
		axios({
			method: "delete",
			data: {
				token: localStorage.getItem( "token" ),
				commentId: commentId,
				postId: postId
			},
			url: "/comments/delete/"
		})
			.then( res => res )
			.catch( err => err.response.data ),

	updateComment: ( commentId, newContent ) =>
		axios({
			method: "patch",
			data: {
				token: localStorage.getItem( "token" ),
				commentId: commentId,
				newContent: newContent
			},
			url: "/comments/update/"
		})
			.then( res => res )
			.catch( err => err.response.data ),

	getPostComments: ( postId, skip ) =>
		axios({
			method: "post",
			data: { token: localStorage.getItem( "token" ), postId: postId },
			url: "/comments/postComments/" + skip
		})
			.then( res => res )
			.catch( err => err.response.data ),

	sharePost: ( postId, shareComment ) =>
		axios({
			method: "post",
			data: {
				token: localStorage.getItem( "token" ),
				postId: postId,
				shareComment: shareComment
			},
			url: "/posts/share/"
		})
			.then( res => res )
			.catch( err => err.response.data ),

	getNotifications: () =>
		axios({
			method: "post",
			data: {
				token: localStorage.getItem( "token" ),
			},
			url: "/notifications/retrieve/"
		})
			.then( res => res )
			.catch( err => err.response.data ),

	getPost: postId =>
		axios({
			method: "post",
			data: {
				postId: postId
			},
			url: "/posts/getPost/"
		})
			.then( res => res )
			.catch( err => console.log( err )),

	checkNotification: notificationId =>
		axios({
			method: "post",
			data: {
				token: localStorage.getItem( "token" ),
				notificationId: notificationId
			},
			url: "/notifications/check/"
		})
			.then( res => res )
			.catch( err => err.response.data ),

	isRequested: targetUsername =>
		axios({
			method: "post",
			data: {
				token: localStorage.getItem( "token" ),
				targetUsername: targetUsername
			},
			url: "/friends/isRequested/"
		})
			.then( res => res )
			.catch( err => err.response.data ),

	acceptRequest: friendUsername =>
		axios({
			method: "post",
			data: {
				token: localStorage.getItem( "token" ),
				friendUsername: friendUsername
			},
			url: "/friends/accept/"
		})
			.then( res => res )
			.catch( err => err.response.data ),

	getFriends: () =>
		axios({
			method: "post",
			data: {
				token: localStorage.getItem( "token" )
			},
			url: "/friends/getFriends/"
		})
			.then( res => res )
			.catch( err => err.response.data ),

	getConversation: friendUsername =>
		axios({
			method: "post",
			data: {
				token: localStorage.getItem( "token" ),
				friendUsername: friendUsername
			},
			url: "/messages/retrieve/"
		})
			.then( res => res )
			.catch( err => err.response.data ),

	sendMessage: ( friendUsername, content ) =>
		axios({
			method: "post",
			data: {
				token: localStorage.getItem( "token" ),
				friendUsername: friendUsername,
				content: content
			},
			url: "/messages/add/"
		})
			.then( res => res )
			.catch( err => err.response.data ),

	getChats: () =>
		axios({
			method: "post",
			data: { token: localStorage.getItem( "token" ) },
			url: "/user/getChats/"
		})
			.then( res => res )
			.catch( err => err.response.data ),
};
