import React, { Component } from "react";
import styled from "styled-components";
import { Button } from "semantic-ui-react";
import { logout } from "../services/actions/auth";
import {
	setNewsfeed, addToNewsfeed, switchMediaOptions, addPost
} from "../services/actions/posts";
import { addMessage } from "../services/actions/messages";
import { setNotifications, addNotification } from "../services/actions/notifications";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import NewsFeed from "../components/NewsFeed";
import api from "../services/api";
import InfiniteScroll from "react-infinite-scroller";
import Comments from "../containers/Comments";
import Share from "../containers/Share";
import MediaOptions from "../containers/MediaOptions";
import NavBar from "../containers/NavBar";
import Notifications from "../containers/Notifications";
import Messages from "../containers/Messages";
import refreshToken from "../utils/refreshToken";

const
	Wrapper = styled.div`
		height: 100vh;
		width: 100%;
		overflow: auto;
		::-webkit-scrollbar {
			@media (max-width: 420px) {
				display: none !important;
			}
		}
	`,
	StyledInfiniteScroll = styled( InfiniteScroll )`
		height: 100%;
		width: 100%;
		display: grid;
		grid-template-rows: auto;
		grid-template-areas:
			"nf"
	`,
	ShareMediaButton = styled( Button )`
		position: fixed;
		left: 50%;
		transform: translateX(-50%);
		bottom: 5px;
		z-index: 3;
	`,
	MediaDimmer = styled.div`
		filter: ${props => props.blur ? "blur(15px)" : "none"};
		margin-top: ${props => props.blur ? "0px" : "49.33px"};
	`,
	StyledNewsFeed = styled( NewsFeed )`
		grid-area: nf;
		height: 100%;
	`;


class HomePage extends Component {
	constructor() {
		super();
		this.state = {
			skip: 1,
			hasMore: true,
			mediaButton: true
		};
	}

	componentDidMount() {
		this.refreshNewsFeed();
		this.setupNotifications();
		this.setupSockets();
	}

	setupNotifications() {
		api.getNotifications()
			.then( res => {
				if ( res === "jwt expired" ) {
					refreshToken()
						.then(() => this.setupNotifications())
						.catch( err => console.log( err ));
				} else {
					this.props.setNotifications(
						res.data.notifications,
						res.data.newNotifications
					);
				}
			}).catch( err => console.log( err ));
	}

	setupSockets = () => {
		const data = {
			token: localStorage.getItem( "token" ),
			username: localStorage.getItem( "username" )
		};
		this.props.socket.emit( "register", data );
		this.props.socket.on( "notifications", data => {
			this.props.addNotification( data );
		});
		this.props.socket.on( "message", data => {
			this.props.addMessage( data );
		});
	}

	getNewsFeed = () => {
		if ( this.state.hasMore ) {
			api.getNewsFeed( this.state.skip )
				.then( res => {
					if ( res === "jwt expired" ) {
						refreshToken()
							.then(() => this.getNewsFeed())
							.catch( err => console.log( err ));
					} else {
						this.props.addToNewsfeed( res.data );
						this.setState({
							hasMore: res.data.length > 10,
							skip: this.state.skip + 1
						});
					}
				}).catch( err => console.log( err ));
		}
	}

	refreshNewsFeed = () => {
		api.getNewsFeed( 0 )
			.then( res => {
				if ( res === "jwt expired" ) {
					refreshToken()
						.then(() => this.refreshNewsFeed())
						.catch( err => console.log( err ));
				} else if ( res.data ) {
					this.props.setNewsfeed( res.data );
				}
			})
			.catch( err => console.log( err ));
	}

	toggleMediaButton = () => {
		this.setState({ mediaButton: !this.state.mediaButton });
	}

	render() {
		return (
			<Wrapper>
				<StyledInfiniteScroll
					pageStart={this.state.skip}
					hasMore={this.state.hasMore}
					loadMore={this.getNewsFeed}
					initialLoad={false}
					useWindow={false}
				>
					<NavBar mediaOptions={this.props.mediaOptions} />
					{this.state.mediaButton &&
						<ShareMediaButton
							circular
							icon="plus"
							size="big"
							onClick={() => this.props.switchMediaOptions()}
						/>
					}

					{this.props.displayShare && <Share />}
					{this.props.displayComments && <Comments socket={this.props.socket} />}
					{this.props.displayNotifications && <Notifications />}
					{this.props.displayMessages && <Messages socket={this.props.socket} />}

					{this.props.mediaOptions &&
						<MediaOptions
							toggleMediaButton={this.toggleMediaButton}
							socket={this.props.socket}
						/>}

					<MediaDimmer blur={this.props.mediaOptions}>
						<StyledNewsFeed posts={this.props.newsfeed} socket={this.props.socket} />
					</MediaDimmer>

				</StyledInfiniteScroll>
			</Wrapper>
		);
	}
}

HomePage.propTypes = {
	logout: PropTypes.func.isRequired,
	setNewsfeed: PropTypes.func.isRequired,
	switchMediaOptions: PropTypes.func.isRequired,
	history: PropTypes.shape({
		push: PropTypes.func.isRequired
	}).isRequired,
};

const
	mapStateToProps = state => ({
		newsfeed: state.posts.newsfeed,
		mediaOptions: state.posts.mediaOptions,
		displayComments: state.posts.displayComments,
		displayShare: state.posts.displayShare,
		displayNotifications: state.notifications.displayNotifications,
		displayMessages: state.messages.displayMessages
	}),

	mapDispatchToProps = dispatch => ({
		setNewsfeed: posts => dispatch( setNewsfeed( posts )),
		addToNewsfeed: posts => dispatch( addToNewsfeed( posts )),
		addPost: post => dispatch( addPost( post )),
		addMessage: message => dispatch( addMessage( message )),
		switchMediaOptions: () => dispatch( switchMediaOptions()),
		addNotification: notification => dispatch( addNotification( notification )),
		setNotifications: ( allNotifications, newNotifications ) => {
			dispatch( setNotifications( allNotifications, newNotifications ));
		},
		logout: () => dispatch( logout())
	});

export default connect( mapStateToProps, mapDispatchToProps )( HomePage );
