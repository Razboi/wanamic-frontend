import "babel-polyfill";
import React, { Component } from "react";
import "./App.css";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import UserRoute from "./utils/routes/UserRoute";
import NewUserRoute from "./utils/routes/NewUserRoute";
import GuestRoute from "./utils/routes/GuestRoute";
import PublicRoute from "./utils/routes/PublicRoute";
import Welcome from "./pages/Welcome";
import Notifications from "./pages/Notifications";
import Messages from "./pages/Messages";
import Explore from "./pages/Explore";
import Batcave from "./pages/Batcave";
import Club from "./pages/Club";
import Information from "./pages/Information";
import PasswordReset from "./pages/PasswordReset";
import Robots from "./pages/Robots";
import { Switch } from "react-router";
import io from "socket.io-client";
import {
	setNewNotifications, addNotification
} from "./services/actions/notifications";
import {
	addConversation, updateConversation, incrementChatNewMessages
} from "./services/actions/conversations";
import { setupLikesViews } from "./services/actions/user";
import { connect } from "react-redux";
import api from "./services/api";
import refreshToken from "./utils/refreshToken";
import { withRouter } from "react-router-dom";
import ReactGA from "react-ga";

ReactGA.initialize( "UA-72968417-3" );
let apiURL = process.env.REACT_APP_STAGE === "dev" ?
	"http://192.168.1.15:8081"
	:
	process.env.REACT_APP_STAGE === "testing" ?
		"http://testing.wanamic.com"
		:
		"https://api.wanamic.com";


class App extends Component {
	constructor( props ) {
		super( props );
		this.socket = io( apiURL );
		this.props.history.listen( location => {
			ReactGA.pageview( window.location.pathname );
		});
	}

	componentDidMount() {
		ReactGA.pageview( window.location.pathname );
		if ( this.props.authenticated ) {
			this.setupNotifications();
			this.setupSockets();
			this.getLikesAndViews();
		}
	}

	componentDidUpdate( prevProps ) {
		if ( !prevProps.authenticated && this.props.authenticated ) {
			this.socket = io( apiURL );
			this.setupNotifications();
			this.setupSockets();
			this.getLikesAndViews();
		}
	}

	displayNotification = ( title, body ) => {
		if ( navigator.serviceWorker.controller &&
			Notification.permission === "granted" ) {
			navigator.serviceWorker.getRegistration().then( reg => {
				let options = {
					body: body,
					icon: require( "./images/android-chrome-192x192.png" ),
					vibrate: [ 100, 50, 100 ],
					data: {
						dateOfArrival: Date.now(),
						primaryKey: 1
					}
				};
				reg.showNotification( title, options );
			});
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
		}
	}

	setupSockets = () => {
		const userData = {
			token: localStorage.getItem( "token" ),
			username: localStorage.getItem( "username" )
		};
		this.socket.emit( "register", userData );
		this.socket.on( "notifications", async notification => {
			this.props.addNotification( notification );
			this.displayNotification( "New notification",
				`${notification.author.fullname} ${notification.content}` );
		});
		this.socket.on( "message", async message => {
			const {
				conversations, addConversation,
				updateConversation, incrementChatNewMessages,
				selectedConversation, displayConversation
			} = this.props;

			for ( const [ i, conversation ] of conversations.entries()) {
				if ( conversation.target.username === message.author.username ) {
					updateConversation( message, i );
					incrementChatNewMessages( i );
					this.displayNotification( "New message",
						`${message.author.fullname}: ${message.content}` );

					if ( conversations[ selectedConversation ].target.username
						=== message.author.username && displayConversation ) {
						this.clearChatNotifications(
							conversations[ selectedConversation ]);
					}
					return;
				}
			}

			const newConversation = await api.getConversation(
				message.author.username );
			addConversation( newConversation.data );
			this.displayNotification( "New conversation.",
				`${message.author.fullname} started a new conversation.` );
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

	clearChatNotifications = async conversation => {
		const response = await api.clearChatNotifications(
			conversation.target.username
		);
		if ( response === "jwt expired" ) {
			try {
				await refreshToken();
			} catch ( err ) {
				console.log( err );
			}
			this.clearChatNotifications( conversation );
		}
	}

	render() {
		// Switch will render the first match. /:username must be last
		return (
			<Switch>
				<UserRoute exact path="/" component={Home} socket={this.socket}/>
				<GuestRoute path="/signup" component={Signup} />
				<GuestRoute path="/login" component={Login} />
				<UserRoute
					path="/notifications" component={Notifications} socket={this.socket}
				/>
				<UserRoute
					path="/messages" component={Messages} socket={this.socket}
				/>
				<UserRoute path="/settings" component={Settings} socket={this.socket}/>
				<NewUserRoute path="/welcome" component={Welcome} socket={this.socket} />
				<UserRoute
					path="/explore" component={Explore} socket={this.socket}
				/>
				<GuestRoute
					path="/reset_password/:token" component={PasswordReset}
				/>
				<UserRoute path="/batcave" component={Batcave} socket={this.socket} />
				<UserRoute path="/c/:club" component={Club} socket={this.socket} />
				<PublicRoute path="/information/:section" component={Information} />
				<PublicRoute
					path="/sitemap"
					component={() => window.location = `${apiURL}/admin/sitemap`}
				/>
				<PublicRoute path="/robots.txt" component={Robots} />
				<PublicRoute exact path="/:username/:post?" component={Profile} socket={this.socket} />
			</Switch>
		);
	}
}

const
	mapStateToProps = state => ({
		conversations: state.conversations.allConversations,
		authenticated: state.authenticated,
		selectedConversation: state.conversations.selectedConversation,
		displayConversation: state.conversations.displayConversation
	}),

	mapDispatchToProps = dispatch => ({
		setupLikesViews: ( likes, views ) =>
			dispatch( setupLikesViews( likes, views )),
		addConversation: conver => dispatch( addConversation( conver )),
		updateConversation: ( message, index ) =>
			dispatch( updateConversation( message, index )),
		incrementChatNewMessages: index =>
			dispatch( incrementChatNewMessages( index )),
		addNotification: notif => dispatch( addNotification( notif )),
		setNewNotifications: newNotifications =>
			dispatch( setNewNotifications( newNotifications ))
	});

export default withRouter( connect( mapStateToProps, mapDispatchToProps )( App ));
