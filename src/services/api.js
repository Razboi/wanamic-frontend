import axios from "axios";


export default {
	login: credentials =>
		axios({
			method: "post",
			url: "/auth/login",
			data: { credentials: credentials }
		})
			.then( res => res.data )
			.catch( err => console.log( err )),

	signup: credentials =>
		axios({
			method: "post",
			url: "/auth/signup",
			data: { credentials: credentials }
		})
			.then( res => res.data )
			.catch( err => console.log( err )),

	createPost: post =>
		axios({
			method: "post",
			url: "/posts/create",
			data: post
		})
			.then( res => res.data )
			.catch( err => console.log( err )),

	createMediaPost: ( token, data ) =>
		axios({
			method: "post",
			url: "/posts/media",
			data: { token: token, data: data }
		})
			.then( res => res.data )
			.catch( err => console.log( err )),

	createMediaLink: ( token, data ) =>
		axios({
			method: "post",
			url: "/posts/mediaLink",
			data: { token: token, data: data }
		})
			.then( res => res.data )
			.catch( err => console.log( err )),

	createMediaPicture: data =>
		axios({
			method: "post",
			url: "/posts/mediaPicture",
			data: data
		})
			.then( res => res.data )
			.catch( err => console.log( err )),

	getNewsFeed: ( skip, token ) =>
		axios({
			method: "post",
			url: "posts/newsfeed/" + skip,
			data: { token: token }
		})
			.then( res => res )
			.catch( err => console.log( err )),

	getTimeline: ( skip, username ) =>
		axios({
			method: "get",
			url: "posts/" + username + "/" + skip,
		})
			.then( res => res )
			.catch( err => console.log( err )),

	deletePost: ( postId, token ) =>
		axios({
			method: "delete",
			url: "/posts/delete",
			data: { post: { id: postId, token: token } }
		})
			.then( res => res )
			.catch( err => console.log( err )),

	updatePost: ( token, postId, content ) =>
		axios({
			method: "patch",
			url: "/posts/update",
			data: { data: {
				token: token,
				post: { id: postId, content: content }
			} }
		})
			.then( res => res )
			.catch( err => console.log( err )),

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
			.catch( err => console.log( err )),

	addFriend: ( token, username ) =>
		axios({
			method: "post",
			data: { token: token, friendUsername: username },
			url: "/friends/add"
		})
			.then( res => res )
			.catch( err => console.log( err )),

	followUser: ( token, username ) =>
		axios({
			method: "post",
			data: { token: token, targetUsername: username },
			url: "/followers/follow"
		})
			.then( res => res )
			.catch( err => console.log( err )),

	getInterestsMatches: data =>
		axios({
			method: "post",
			data: { data: data },
			url: "/user/match"
		})
			.then( res => res )
			.catch( err => console.log( err )),

	addInterests: ( data, token ) =>
		axios({
			method: "post",
			data: { token: token, data: data },
			url: "/user/addInterests"
		})
			.then( res => res )
			.catch( err => console.log( err )),

	setupFollow: ( users, token ) =>
		axios({
			method: "post",
			data: { token: token, users: users },
			url: "/followers/setupFollow"
		})
			.then( res => res )
			.catch( err => console.log( err )),

	getSugested: ( token, skip ) =>
		axios({
			method: "post",
			data: { skip: skip, token: token },
			url: "/user/sugestedUsers"
		})
			.then( res => res )
			.catch( err => console.log( err )),

	getRandom: token =>
		axios({
			method: "post",
			data: { token: token },
			url: "/user/randomUser"
		})
			.then( res => res )
			.catch( err => console.log( err )),

	matchKwUsers: ( token, data, skip ) =>
		axios({
			method: "post",
			data: { token: token, data: data, skip: skip },
			url: "/user/matchKwUsers"
		})
			.then( res => res )
			.catch( err => console.log( err )),

	setUserKw: ( token, data ) =>
		axios({
			method: "post",
			data: { token: token, data: data },
			url: "/user/setUserKw"
		})
			.then( res => res )
			.catch( err => console.log( err )),
};
