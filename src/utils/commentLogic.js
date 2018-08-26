import refreshToken from "./refreshToken";
import api from "../services/api";
import store from "../index";
import { deleteComment, updatePost, updateComment
} from "../services/actions/posts";
import extract from "../utils/extractMentionsHashtags";

export default {
	deleteComment: async comment => {
		try {
			const updatedPost = await api.deleteComment( comment._id, comment.post );
			store.dispatch( deleteComment( comment._id ));
			store.dispatch( updatePost( updatedPost.data ));
		} catch ( err ) {
			if ( err.response.data === "jwt expired" ) {
				await refreshToken();
				this.deleteComment( comment );
			} else {
				console.log( err );
			}
		}
	},
	updateComment: async( comment, updatedContent, socket ) => {
		if (( !updatedContent && !comment.content )
			|| comment.content === updatedContent ) {
			return;
		}
		try {
			const
				mentions = await extract(
					updatedContent, { symbol: false }),
				res = await api.updateComment(
					comment._id, updatedContent, mentions );
			store.dispatch( updateComment( res.data.updatedComment ));
			for ( const notification of res.data.mentionsNotifications ) {
				socket.emit( "sendNotification", notification );
			}
		} catch ( err ) {
			if ( err.response.data === "jwt expired" ) {
				await refreshToken();
				this.updateComment( comment, updatedContent, socket );
			} else {
				console.log( err );
			}
		}
	},
	reportComment: async( reportContent, commentId ) => {
		if ( !reportContent ) {
			return;
		}
		try {
			await api.reportComment( commentId, reportContent );
		} catch ( err ) {
			if ( err.response.data === "jwt expired" ) {
				await refreshToken();
				this.reportPost();
			} else {
				console.log( err );
			}
		}
	}
};
