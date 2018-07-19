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

	createPost: ( userInput, mentions, hashtags, privacyRange, alerts ) =>
		axios({
			method: "post",
			url: "/posts/create",
			data: {
				token: localStorage.getItem( "token" ),
				userInput: userInput,
				mentions: mentions,
				hashtags: hashtags,
				privacyRange: privacyRange,
				alerts: alerts
			}
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

	createMediaLink: ( link, description, mentions, hashtags, privacyRange, alerts ) =>
		axios({
			method: "post",
			url: "/posts/mediaLink",
			data: {
				token: localStorage.getItem( "token" ),
				link: link,
				description: description,
				mentions: mentions,
				hashtags: hashtags,
				privacyRange: privacyRange,
				alerts: alerts
			}
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
			method: "post",
			url: "posts/" + username + "/" + skip,
			data: { token: localStorage.getItem( "token" ) }
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

	updatePost: ( postId, newContent ) =>
		axios({
			method: "patch",
			url: "/posts/update",
			data: {
				token: localStorage.getItem( "token" ),
				postId: postId,
				newContent: newContent
			}
		})
			.then( res => res )
			.catch( err => err.response.data ),

	getUserInfo: username =>
		axios({
			method: "post",
			data: {
				username: username,
				token: localStorage.getItem( "token" )
			},
			url: "/user/userInfo"
		})
			.then( res => res )
			.catch( err => {
				throw err;
			}),

	setUserInfo: data =>
		axios({
			method: "post",
			data: data,
			url: "/user/info"
		})
			.then( res => res )
			.catch( err => {
				throw err;
			}),

	addFriend: username =>
		axios({
			method: "post",
			data: {
				token: localStorage.getItem( "token" ),
				friendUsername: username
			},
			url: "/friends/add"
		})
			.then( res => res )
			.catch( err => err.response.data ),

	deleteFriend: username =>
		axios({
			method: "delete",
			data: {
				token: localStorage.getItem( "token" ),
				friendUsername: username
			},
			url: "/friends/delete"
		})
			.then( res => res )
			.catch( err => err.response.data ),

	followUser: username =>
		axios({
			method: "post",
			data: {
				token: localStorage.getItem( "token" ),
				targetUsername: username
			},
			url: "/followers/follow"
		})
			.then( res => res )
			.catch( err => err.response.data ),

	unfollowUser: username =>
		axios({
			method: "delete",
			data: {
				token: localStorage.getItem( "token" ),
				targetUsername: username
			},
			url: "/followers/unfollow"
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

	updateInterests: newInterests =>
		axios({
			method: "post",
			data: {
				token: localStorage.getItem( "token" ),
				newInterests: newInterests
			},
			url: "/user/updateInterests"
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

	createComment: ( comment, postId, mentions ) =>
		axios({
			method: "post",
			data: {
				token: localStorage.getItem( "token" ),
				comment: comment,
				postId: postId,
				mentions: mentions
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

	sharePost: ( postId, shareComment, privacyRange, alerts ) =>
		axios({
			method: "post",
			data: {
				token: localStorage.getItem( "token" ),
				postId: postId,
				description: shareComment,
				privacyRange: privacyRange,
				alerts: alerts
			},
			url: "/posts/share/"
		})
			.then( res => res )
			.catch( err => err.response.data ),

	getNotifications: skip =>
		axios({
			method: "post",
			data: {
				token: localStorage.getItem( "token" ),
			},
			url: "/notifications/retrieve/" + skip
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

	checkNotifications: () =>
		axios({
			method: "post",
			data: {
				token: localStorage.getItem( "token" )
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

	getSocialCircle: () =>
		axios({
			method: "post",
			data: {
				token: localStorage.getItem( "token" )
			},
			url: "/user/getSocialCircle/"
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
			url: "/conversations/retrieve/"
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
			url: "/conversations/add/"
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

	clearChatNotifications: targetUsername =>
		axios({
			method: "post",
			data: {
				token: localStorage.getItem( "token" ),
				targetUsername: targetUsername
			},
			url: "/conversations/clearNotifications/"
		})
			.then( res => res )
			.catch( err => err.response.data ),

	deleteChat: targetUsername =>
		axios({
			method: "delete",
			data: {
				token: localStorage.getItem( "token" ),
				targetUsername: targetUsername
			},
			url: "/conversations/delete/"
		})
			.then( res => res )
			.catch( err => err.response.data ),

	updatePassword: ( currentPassword, newPassword ) =>
		axios({
			method: "patch",
			data: {
				token: localStorage.getItem( "token" ),
				currentPassword: currentPassword,
				newPassword: newPassword
			},
			url: "/user/updatePassword/"
		})
			.then( res => res )
			.catch( err => {
				throw err;
			}),

	updateEmail: ( currentEmail, newEmail ) =>
		axios({
			method: "patch",
			data: {
				token: localStorage.getItem( "token" ),
				currentEmail: currentEmail,
				newEmail: newEmail
			},
			url: "/user/updateEmail/"
		})
			.then( res => res )
			.catch( err => {
				throw err;
			}),

	deleteAccount: ( password, feedback ) =>
		axios({
			method: "delete",
			data: {
				token: localStorage.getItem( "token" ),
				password: password,
				feedback: feedback
			},
			url: "/user/deleteAccount/"
		})
			.then( res => res )
			.catch( err => {
				throw err;
			}),

	getUserAlbum: username =>
		axios({
			method: "post",
			data: {
				token: localStorage.getItem( "token" ),
				username: username
			},
			url: "/user/getUserAlbum/"
		})
			.then( res => res )
			.catch( err => {
				throw err;
			}),

	getUserNetwork: username =>
		axios({
			method: "post",
			data: {
				token: localStorage.getItem( "token" ),
				username: username
			},
			url: "/user/getUserNetwork/"
		})
			.then( res => res )
			.catch( err => {
				throw err;
			}),

	getLikesAndViews: () =>
		axios({
			method: "post",
			data: { token: localStorage.getItem( "token" ) },
			url: "/user/getLikesAndViews/"
		})
			.then( res => res )
			.catch( err => {
				throw err;
			}),
};
