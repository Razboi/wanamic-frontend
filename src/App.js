import React, { Component } from "react";
import "./App.css";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
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
	setNewNotifications, addNotification
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

var socket = {};


class App extends Component {
	componentDidMount() {
		if ( this.props.authenticated ) {
			socket = io( "http://localhost:8000" );
			this.setupNotifications();
			this.setupSockets();
			this.getLikesAndViews();
		}
	}

	componentDidUpdate( prevProps ) {
		if ( !prevProps.authenticated && this.props.authenticated ) {
			socket = io( "http://localhost:8000" );
			this.setupNotifications();
			this.setupSockets();
			this.getLikesAndViews();
		}
	}

	async setupNotifications() {
		const notifications = await api.getNotifications( 0 );
		if ( notifications === "jwt expired" ) {
			try {
				await refreshToken();
			} catch ( err ) {
				console.log( err );
			}
			this.setupNotifications();
		} else if ( notifications.data ) {
			this.props.setNewNotifications(
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
		socket.on( "notifications", async notification => {
			this.props.addNotification( notification );
		});
		socket.on( "message", async message => {
			const {
				conversations, addConversation,
				addChatNotification, updateConversation, chatNotifications,
				incrementChatNewMessages, selectedConversation,
				displayConversation
			} = this.props;

			if ( !chatNotifications.includes( message.author.username )
			&& ( conversations[ selectedConversation ].target.username
				!== message.author.username || !displayConversation )) {
				addChatNotification( message.author.username );
			}

			if ( this.props.location.pathname === "/messages"
			|| window.innerWidth > 420 ) {
				for ( const [ i, conversation ] of conversations.entries()) {
					if ( conversation.target.username === message.author.username ) {
						updateConversation( message, i );
						incrementChatNewMessages( i );
						return;
					}
				}
				const newConversation = await api.getConversation(
					message.author.username );
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
					<UserRoute exact path="/" component={Home} socket={socket}/>
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
		authenticated: state.authenticated,
		selectedConversation: state.conversations.selectedConversation,
		displayConversation: state.conversations.displayConversation
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
		setNewNotifications: newNotifications =>
			dispatch( setNewNotifications( newNotifications ))
	});

export default withRouter( connect( mapStateToProps, mapDispatchToProps )( App ));
