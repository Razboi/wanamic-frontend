import axios from "axios";

let API_URL = process.env.REACT_APP_STAGE === "dev" ?
	"http://localhost:8081"
	:
	"https://api.wanamic.com";

export default {
	login: credentials =>
		axios({
			method: "post",
			url: API_URL + "/auth/login",
			data: { credentials: credentials }
		})
			.then( res => res.data )
			.catch( err => {
				throw err;
			}),

	signup: credentials =>
		axios({
			method: "post",
			url: API_URL + "/auth/signup",
			data: { credentials: credentials }
		})
			.then( res => res.data )
			.catch( err => {
				throw err;
			}),

	batcaveAuth: password =>
		axios({
			method: "post",
			url: API_URL + "/auth/batcaveAuth",
			data: { password: password, token: localStorage.getItem( "token" ) }
		})
			.then( res => res.data )
			.catch( err => {
				throw err;
			}),

	batcaveData: () =>
		axios({
			method: "post",
			url: API_URL + "/admin/adminData",
			data: { token: localStorage.getItem( "token" ) }
		})
			.then( res => res.data )
			.catch( err => {
				throw err;
			}),

	removeTicket: ticketId =>
		axios({
			method: "delete",
			url: API_URL + "/admin/removeTicket",
			data: {
				token: localStorage.getItem( "token" ),
				ticketId: ticketId
			}
		})
			.then( res => res.data )
			.catch( err => {
				throw err;
			}),

	deleteObject: ticketId =>
		axios({
			method: "delete",
			url: API_URL + "/admin/deleteObject",
			data: {
				token: localStorage.getItem( "token" ),
				ticketId: ticketId
			}
		})
			.then( res => res.data )
			.catch( err => {
				throw err;
			}),

	banUser: ticketId =>
		axios({
			method: "post",
			url: API_URL + "/admin/banUser",
			data: {
				token: localStorage.getItem( "token" ),
				ticketId: ticketId
			}
		})
			.then( res => res.data )
			.catch( err => {
				throw err;
			}),

	resetPassword: email =>
		axios({
			method: "post",
			url: API_URL + "/auth/resetPassword",
			data: { email: email }
		})
			.then( res => res.data )
			.catch( err => {
				throw err;
			}),

	setNewPassword: ( token, newPassword ) =>
		axios({
			method: "post",
			url: API_URL + "/auth/setNewPassword",
			data: { token: token, newPassword: newPassword }
		})
			.then( res => res.data )
			.catch( err => {
				throw err;
			}),

	verifyToken: () =>
		axios({
			method: "post",
			url: API_URL + "/auth/verify",
			data: { token: localStorage.getItem( "token" ) }
		})
			.then( res => res.data )
			.catch( err => {
				throw err;
			}),

	refreshToken: () =>
		axios({
			method: "post",
			url: API_URL + "/auth/token",
			data: { refreshToken: localStorage.getItem( "refreshToken" ) }
		})
			.then( res => res.data )
			.catch( err => {
				throw err;
			}),

	createPost: ( userInput, mentions, hashtags, privacyRange, alerts ) =>
		axios({
			method: "post",
			url: API_URL + "/posts/create",
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
			url: API_URL + "/posts/media",
			data: { token: localStorage.getItem( "token" ), data: data }
		})
			.then( res => res.data )
			.catch( err => err.response.data ),

	createMediaLink: ( link, description, mentions, hashtags, privacyRange, alerts ) =>
		axios({
			method: "post",
			url: API_URL + "/posts/mediaLink",
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
			.catch( err => {
				throw err;
			}),

	createMediaPicture: data =>
		axios({
			method: "post",
			url: API_URL + "/posts/mediaPicture",
			data: data
		})
			.then( res => res.data )
			.catch( err => {
				throw err;
			}),

	getNewsFeed: skip =>
		axios({
			method: "post",
			url: API_URL + "/posts/newsfeed/" + skip,
			data: { token: localStorage.getItem( "token" ) }
		})
			.then( res => res )
			.catch( err => err.response.data ),

	getTimeline: ( skip, username ) =>
		axios({
			method: "post",
			url: API_URL + "/posts/" + username + "/" + skip,
			data: { token: localStorage.getItem( "token" ) }
		})
			.then( res => res )
			.catch( err => console.log( err )),

	deletePost: postId =>
		axios({
			method: "delete",
			url: API_URL + "/posts/delete",
			data: { postId: postId, token: localStorage.getItem( "token" ) }
		})
			.then( res => res )
			.catch( err => err.response.data ),

	updatePost: ( postId, newContent, mentions, hashtags ) =>
		axios({
			method: "patch",
			url: API_URL + "/posts/update",
			data: {
				token: localStorage.getItem( "token" ),
				postId: postId,
				newContent: newContent,
				mentions: mentions,
				hashtags: hashtags
			}
		})
			.then( res => res )
			.catch( err => err.response.data ),

	reportPost: ( postId, content ) =>
		axios({
			method: "post",
			url: API_URL + "/posts/report",
			data: {
				token: localStorage.getItem( "token" ),
				postId: postId,
				content: content
			}
		})
			.then( res => res )
			.catch( err => {
				throw err;
			}),

	reportComment: ( commentId, content ) =>
		axios({
			method: "post",
			url: API_URL + "/comments/report",
			data: {
				token: localStorage.getItem( "token" ),
				commentId: commentId,
				content: content
			}
		})
			.then( res => res )
			.catch( err => {
				throw err;
			}),

	getUserInfo: username =>
		axios({
			method: "post",
			data: {
				username: username,
				token: localStorage.getItem( "token" )
			},
			url: API_URL + "/user/userInfo"
		})
			.then( res => res )
			.catch( err => {
				throw err;
			}),

	setUserInfo: data =>
		axios({
			method: "post",
			data: data,
			url: API_URL + "/user/info"
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
			url: API_URL + "/friends/add"
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
			url: API_URL + "/friends/delete"
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
			url: API_URL + "/followers/follow"
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
			url: API_URL + "/followers/unfollow"
		})
			.then( res => res )
			.catch( err => err.response.data ),

	getInterestsMatches: data =>
		axios({
			method: "post",
			data: { data: data },
			url: API_URL + "/user/match"
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
			url: API_URL + "/user/updateInterests"
		})
			.then( res => res )
			.catch( err => err.response.data ),

	setupFollow: users =>
		axios({
			method: "post",
			data: { token: localStorage.getItem( "token" ), users: users },
			url: API_URL + "/followers/setupFollow"
		})
			.then( res => res )
			.catch( err => err.response.data ),

	getSugested: skip =>
		axios({
			method: "post",
			data: { skip: skip, token: localStorage.getItem( "token" ) },
			url: API_URL + "/user/sugestedUsers"
		})
			.then( res => res )
			.catch( err => err.response.data ),

	getRandom: () =>
		axios({
			method: "post",
			data: { token: localStorage.getItem( "token" ) },
			url: API_URL + "/user/randomUser"
		})
			.then( res => res )
			.catch( err => err.response.data ),

	matchHobbies: ( data, skip ) =>
		axios({
			method: "post",
			data: {
				token: localStorage.getItem( "token" ),
				data: data,
				skip: skip
			},
			url: API_URL + "/user/matchHobbies"
		})
			.then( res => res )
			.catch( err => err.response.data ),

	setUserKw: data =>
		axios({
			method: "post",
			data: { token: localStorage.getItem( "token" ), data: data },
			url: API_URL + "/user/setUserKw"
		})
			.then( res => res )
			.catch( err => {
				throw err;
			}),

	exploreContent: ( skip, limit ) =>
		axios({
			method: "get",
			url: API_URL + `/posts/explore/${skip}/${limit}`
		})
			.then( res => res )
			.catch( err => console.log( err )),

	searchContent: ( skip, search ) =>
		axios({
			method: "post",
			data: { search: search },
			url: API_URL + "/posts/search/:skip" + skip
		})
			.then( res => res )
			.catch( err => {
				throw err;
			}),

	likePost: postId =>
		axios({
			method: "post",
			data: { token: localStorage.getItem( "token" ), postId: postId },
			url: API_URL + "/posts/like/"
		})
			.then( res => res )
			.catch( err => err.response.data ),

	dislikePost: postId =>
		axios({
			method: "patch",
			data: { token: localStorage.getItem( "token" ), postId: postId },
			url: API_URL + "/posts/dislike/"
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
			url: API_URL + "/comments/create/"
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
			url: API_URL + "/comments/delete/"
		})
			.then( res => res )
			.catch( err => err.response.data ),

	updateComment: ( commentId, newContent, mentions, hashtags ) =>
		axios({
			method: "patch",
			data: {
				token: localStorage.getItem( "token" ),
				commentId: commentId,
				newContent: newContent,
				mentions: mentions
			},
			url: API_URL + "/comments/update/"
		})
			.then( res => res )
			.catch( err => err.response.data ),

	getPostComments: ( postId, skip ) =>
		axios({
			method: "post",
			data: { postId: postId },
			url: API_URL + "/comments/retrieve/" + skip
		})
			.then( res => res )
			.catch( err => err.response.data ),

	getComment: commentId =>
		axios({
			method: "post",
			data: { commentId: commentId },
			url: API_URL + "/comments/getComment/"
		})
			.then( res => res )
			.catch( err => {
				throw err;
			}),

	sharePost: ( postId, shareComment, privacyRange, alerts, mentions, hashtags ) =>
		axios({
			method: "post",
			data: {
				token: localStorage.getItem( "token" ),
				postId: postId,
				description: shareComment,
				privacyRange: privacyRange,
				alerts: alerts,
				mentions: mentions,
				hashtags: hashtags
			},
			url: API_URL + "/posts/share/"
		})
			.then( res => res )
			.catch( err => err.response.data ),

	getNotifications: skip =>
		axios({
			method: "post",
			data: {
				token: localStorage.getItem( "token" ),
			},
			url: API_URL + "/notifications/retrieve/" + skip
		})
			.then( res => res )
			.catch( err => err.response.data ),

	getPost: postId =>
		axios({
			method: "post",
			data: {
				postId: postId
			},
			url: API_URL + "/posts/getPost/"
		})
			.then( res => res )
			.catch( err => {
				throw err;
			}),

	checkNotifications: () =>
		axios({
			method: "post",
			data: {
				token: localStorage.getItem( "token" )
			},
			url: API_URL + "/notifications/check/"
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
			url: API_URL + "/friends/isRequested/"
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
			url: API_URL + "/friends/accept/"
		})
			.then( res => res )
			.catch( err => err.response.data ),

	getFriends: () =>
		axios({
			method: "post",
			data: {
				token: localStorage.getItem( "token" )
			},
			url: API_URL + "/friends/getFriends/"
		})
			.then( res => res )
			.catch( err => err.response.data ),

	getSocialCircle: () =>
		axios({
			method: "post",
			data: {
				token: localStorage.getItem( "token" )
			},
			url: API_URL + "/user/getSocialCircle/"
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
			url: API_URL + "/conversations/retrieve/"
		})
			.then( res => res )
			.catch( err => err.response.data ),

	sendMessage: ( friendId, content ) =>
		axios({
			method: "post",
			data: {
				token: localStorage.getItem( "token" ),
				friendId: friendId,
				content: content
			},
			url: API_URL + "/conversations/add/"
		})
			.then( res => res )
			.catch( err => err.response.data ),

	getChats: () =>
		axios({
			method: "post",
			data: { token: localStorage.getItem( "token" ) },
			url: API_URL + "/user/getChats/"
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
			url: API_URL + "/conversations/clearNotifications/"
		})
			.then( res => res )
			.catch( err => err.response.data ),

	deleteChat: targetId =>
		axios({
			method: "delete",
			data: {
				token: localStorage.getItem( "token" ),
				targetId: targetId
			},
			url: API_URL + "/conversations/delete/"
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
			url: API_URL + "/user/updatePassword/"
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
			url: API_URL + "/user/updateEmail/"
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
			url: API_URL + "/user/deleteAccount/"
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
			url: API_URL + "/user/getUserAlbum/"
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
			url: API_URL + "/user/getUserNetwork/"
		})
			.then( res => res )
			.catch( err => {
				throw err;
			}),

	getLikesAndViews: () =>
		axios({
			method: "post",
			data: { token: localStorage.getItem( "token" ) },
			url: API_URL + "/user/getLikesAndViews/"
		})
			.then( res => res )
			.catch( err => {
				throw err;
			}),
};
