import React, { Component } from "react";
import Auth from "./pages/Auth";
import Newsfeed from "./pages/Newsfeed";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import UserRoute from "./utils/routes/UserRoute";
import NewUserRoute from "./utils/routes/NewUserRoute";
import Welcome from "./pages/Welcome";
import Notifications from "./pages/Notifications";
import Messages from "./pages/Messages";
import Explore from "./pages/Explore";
import GuestRoute from "./utils/routes/GuestRoute";
import { Switch } from "react-router";
import io from "socket.io-client";
import {
	setNotifications, addNotification
} from "./services/actions/notifications";
import {
	setChatNotifications, addConversation, updateConversation,
	addChatNotification, incrementChatNewMessages
} from "./services/actions/conversations";
import { setupLikesViews } from "./services/actions/user";
import { connect } from "react-redux";
import api from "./services/api";
import refreshToken from "./utils/refreshToken";
import { withRouter } from "react-router-dom";

const
	socket = io( "http://localhost:8000" );


class App extends Component {
	componentDidMount() {
		if ( this.props.authenticated ) {
			this.setupNotifications();
			this.setupSockets();
			this.getLikesAndViews();
		}
	}

	async setupNotifications() {
		const notifications = await api.getNotifications();
		if ( notifications === "jwt expired" ) {
			try {
				await refreshToken();
			} catch ( err ) {
				console.log( err );
			}
			this.setupNotifications();
		} else if ( notifications.data ) {
			this.props.setNotifications(
				notifications.data.notifications,
				notifications.data.newNotifications
			);
			this.props.setChatNotifications(
				notifications.data.chatNotifications );
		}
	}

	setupSockets = () => {
		const userData = {
			token: localStorage.getItem( "token" ),
			username: localStorage.getItem( "username" )
		};
		socket.emit( "register", userData );
		socket.on( "notifications", notification => {
			this.props.addNotification( notification );
		});
		socket.on( "message", async message => {
			const {
				displayMessages, conversations, addConversation,
				addChatNotification, updateConversation, chatNotifications,
				incrementChatNewMessages
			} = this.props;
			if ( !chatNotifications.includes( message.author )) {
				addChatNotification( message.author );
			}
			if ( displayMessages ) {
				for ( const [ i, conversation ] of conversations.entries()) {
					if ( conversation.target.username === message.author ) {
						updateConversation( message, i );
						incrementChatNewMessages( i );
						return;
					}
				}
				const newConversation = await api.getConversation(
					message.author );
				addConversation( newConversation.data );
			}
		});
	}

	getLikesAndViews = async() => {
		const likesAndViews = await api.getLikesAndViews();
		if ( likesAndViews === "jwt expired" ) {
			try {
				await refreshToken();
			} catch ( err ) {
				console.log( err );
			}
			this.getLikesAndViews();
		} else if ( likesAndViews.data ) {
			const { totalLikes, totalViews } = likesAndViews.data;
			this.props.setupLikesViews( totalLikes, totalViews );
		}
	}
	render() {
		// Switch will render the first match. /:username must be last
		return (
			<div>
				<Switch>
					<UserRoute exact path="/" component={Newsfeed} socket={socket}/>
					<GuestRoute path="/login" component={Auth} />
					<UserRoute
						path="/notifications" component={Notifications} socket={socket}
					/>
					<UserRoute
						path="/messages" component={Messages} socket={socket}
					/>
					<UserRoute path="/settings" component={Settings}/>
					<NewUserRoute path="/welcome" component={Welcome} />
					<UserRoute
						path="/explore" component={Explore} socket={socket}
					/>

					<UserRoute path="/:username" component={Profile} socket={socket} />
				</Switch>
			</div>
		);
	}
}

const
	mapStateToProps = state => ({
		conversations: state.conversations.allConversations,
		chatNotifications: state.conversations.notifications,
		authenticated: state.authenticated
	}),

	mapDispatchToProps = dispatch => ({
		setupLikesViews: ( likes, views ) =>
			dispatch( setupLikesViews( likes, views )),
		setChatNotifications: authors =>
			dispatch( setChatNotifications( authors )),
		addConversation: conver => dispatch( addConversation( conver )),
		updateConversation: ( message, index ) =>
			dispatch( updateConversation( message, index )),
		incrementChatNewMessages: index =>
			dispatch( incrementChatNewMessages( index )),
		addNotification: notif => dispatch( addNotification( notif )),
		addChatNotification: notif => dispatch( addChatNotification( notif )),
		setNotifications: ( allNotifications, newNotifications ) => {
			dispatch( setNotifications( allNotifications, newNotifications ));
		}
	});

export default withRouter( connect( mapStateToProps, mapDispatchToProps )( App ));
