import refreshToken from "./refreshToken";
import api from "../services/api";
import store from "../index";
import { deletePost as deleteAction, updatePost
} from "../services/actions/posts";
import extract from "../utils/extractMentionsHashtags";

export default {
	deletePost: async postId => {
		try {
			await api.deletePost( postId );
			store.dispatch( deleteAction( postId ));
		} catch ( err ) {
			if ( err.response.data === "jwt expired" ) {
				await refreshToken();
				this.deletePost( postId );
			} else {
				console.log( err );
			}
		}
	},
	updatePost: async( post, updatedContent, socket ) => {
		if (( !updatedContent && !post.content )
			|| post.content === updatedContent ) {
			return;
		}
		try {
			const
				{ mentions, hashtags } = await extract(
					updatedContent, { symbol: false, type: "all" }),
				res = await api.updatePost(
					post._id, updatedContent, mentions, hashtags );
			store.dispatch( updatePost( res.data.updatedPost ));
			for ( const notification of res.data.mentionsNotifications ) {
				socket.emit( "sendNotification", notification );
			}
		} catch ( err ) {
			if ( err.response.data === "jwt expired" ) {
				await refreshToken();
				this.updatePost( post, updatedContent );
			} else {
				console.log( err );
			}
		}
	},
	reportPost: async( reportContent, postId ) => {
		if ( !reportContent ) {
			return;
		}
		try {
			await api.reportPost( postId, reportContent );
		} catch ( err ) {
			console.log( err );
			if ( err.response.data === "jwt expired" ) {
				await refreshToken();
				this.reportPost();
			}
		}
	}
};
