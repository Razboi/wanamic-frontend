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
			data: { token: localStorage.getItem( "token" ), post: post }
		})
			.then( res => res.data )
			.catch( err => console.log( err )),

	createMediaPost: data =>
		axios({
			method: "post",
			url: "/posts/media",
			data: { token: localStorage.getItem( "token" ), data: data }
		})
			.then( res => res.data )
			.catch( err => console.log( err )),

	createMediaLink: data =>
		axios({
			method: "post",
			url: "/posts/mediaLink",
			data: { token: localStorage.getItem( "token" ), data: data }
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

	getNewsFeed: skip =>
		axios({
			method: "post",
			url: "posts/newsfeed/" + skip,
			data: { token: localStorage.getItem( "token" ) }
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

	deletePost: postId =>
		axios({
			method: "delete",
			url: "/posts/delete",
			data: { post: { id: postId, token: localStorage.getItem( "token" ) } }
		})
			.then( res => res )
			.catch( err => console.log( err )),

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

	addFriend: username =>
		axios({
			method: "post",
			data: { token: localStorage.getItem( "token" ), friendUsername: username },
			url: "/friends/add"
		})
			.then( res => res )
			.catch( err => console.log( err )),

	followUser: username =>
		axios({
			method: "post",
			data: { token: localStorage.getItem( "token" ), targetUsername: username },
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

	addInterests: data =>
		axios({
			method: "post",
			data: { token: localStorage.getItem( "token" ), data: data },
			url: "/user/addInterests"
		})
			.then( res => res )
			.catch( err => console.log( err )),

	setupFollow: users =>
		axios({
			method: "post",
			data: { token: localStorage.getItem( "token" ), users: users },
			url: "/followers/setupFollow"
		})
			.then( res => res )
			.catch( err => console.log( err )),

	getSugested: skip =>
		axios({
			method: "post",
			data: { skip: skip, token: localStorage.getItem( "token" ) },
			url: "/user/sugestedUsers"
		})
			.then( res => res )
			.catch( err => console.log( err )),

	getRandom: () =>
		axios({
			method: "post",
			data: { token: localStorage.getItem( "token" ) },
			url: "/user/randomUser"
		})
			.then( res => res )
			.catch( err => console.log( err )),

	matchKwUsers: ( data, skip ) =>
		axios({
			method: "post",
			data: { token: localStorage.getItem( "token" ), data: data, skip: skip },
			url: "/user/matchKwUsers"
		})
			.then( res => res )
			.catch( err => console.log( err )),

	setUserKw: data =>
		axios({
			method: "post",
			data: { token: localStorage.getItem( "token" ), data: data },
			url: "/user/setUserKw"
		})
			.then( res => res )
			.catch( err => console.log( err )),

	exploreContent: skip =>
		axios({
			method: "post",
			data: { token: localStorage.getItem( "token" ) },
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
			.catch( err => console.log( err )),

	dislikePost: postId =>
		axios({
			method: "patch",
			data: { token: localStorage.getItem( "token" ), postId: postId },
			url: "/posts/dislike/"
		})
			.then( res => res )
			.catch( err => console.log( err )),

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
			.catch( err => console.log( err )),

	getPostComments: ( postId, skip ) =>
		axios({
			method: "post",
			data: { token: localStorage.getItem( "token" ), postId: postId },
			url: "/comments/postComments/" + skip
		})
			.then( res => res )
			.catch( err => console.log( err )),
};
