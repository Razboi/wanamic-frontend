import refreshToken from "./refreshToken";
import api from "../services/api";
import store from "../index";
import { deleteComment, updatePost, updateComment
} from "../services/actions/posts";
import extract from "../utils/extractMentionsHashtags";


const
	remove = async comment => {
		try {
			const updatedPost = await api.deleteComment( comment._id, comment.post );
			store.dispatch( deleteComment( comment._id ));
			store.dispatch( updatePost( updatedPost.data ));
		} catch ( err ) {
			if ( err.response.data === "jwt expired" ) {
				await refreshToken();
				remove( comment );
			} else {
				console.log( err );
			}
		}
	},

	update = async( comment, updatedContent, socket ) => {
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
				update( comment, updatedContent, socket );
			} else {
				console.log( err );
			}
		}
	},

	report = async( reportContent, commentId ) => {
		if ( !reportContent ) {
			return;
		}
		try {
			await api.reportComment( commentId, reportContent );
		} catch ( err ) {
			if ( err.response.data === "jwt expired" ) {
				await refreshToken();
				report( reportContent, commentId );
			} else {
				console.log( err );
			}
		}
	};

export default { remove, update, report };
