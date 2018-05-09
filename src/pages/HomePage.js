import React, { Component } from "react";
import styled from "styled-components";
import { Button } from "semantic-ui-react";
import { logout } from "../services/actions/auth";
import {
	setNewsfeed, addToNewsfeed, switchMediaOptions, addPost
} from "../services/actions/posts";
import { setNotifications } from "../services/actions/notifications";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import NewsFeed from "../components/NewsFeed";
import api from "../services/api";
import InfiniteScroll from "react-infinite-scroller";
import Comments from "../containers/Comments";
import Share from "../containers/Share";
import MediaOptions from "../containers/MediaOptions";
import NavBar from "../components/NavBar";
import io from "socket.io-client";

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
		margin-top: ${props => props.blur ? "0px" : "69.33px"};
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
			isInfiniteLoading: false,
			hasMore: true,
			picture: null
		};
	}

	componentDidMount() {
		this.refreshNewsFeed();
		this.setupNotifications();
	}

	setupNotifications() {
		const socket = io( "http://localhost:8000" );
		api.getNotifications()
			.then( res => {
				this.props.setNotifications( res.data.notifications, res.data.newNotifications );
			}).catch( err => console.log( err ));
		socket.emit( "register", localStorage.getItem( "token" ));
		socket.on( "notifications", data => {
			console.log( data );
			this.props.setNotifications( data.notifications, data.newNotifications );
		});
	}

	getNewsFeed = () => {
		if ( this.state.hasMore && !this.state.isInfiniteLoading ) {
			this.setState({ isInfiniteLoading: true });
			api.getNewsFeed( this.state.skip )
				.then( res => {
					if ( res.data.length < 10 ) {
						this.props.addToNewsfeed( res.data );
						this.setState({
							hasMore: false,
							isInfiniteLoading: false
						});
						return;
					}
					this.props.addToNewsfeed( res.data );
					this.setState({
						isInfiniteLoading: false,
						skip: this.state.skip + 1
					});
				}).catch( err => console.log( err ));
		}
	}

	refreshNewsFeed = () => {
		api.getNewsFeed( 0 )
			.then( res => this.props.setNewsfeed( res.data ))
			.catch( err => console.log( err ));
	}

	handleChange = e => {
		this.setState({ [ e.target.name ]: e.target.value });
	}

	switchMediaOptions = () => {
		this.props.switchMediaOptions();
	}

	handlePictureSelect = e => {
		this.props.history.push({
			pathname: "/mediaPicture",
			state: { file: e.target.files[ 0 ] }
		});
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
					<ShareMediaButton primary circular icon="plus" size="big"
						onClick={this.switchMediaOptions}
					/>
					{this.props.displayShare && <Share /> }
					{this.props.displayComments && <Comments />}

					{this.props.mediaOptions &&
						<MediaOptions handlePictureSelect={this.handlePictureSelect}
						/>}

					<MediaDimmer blur={this.props.mediaOptions}>
						<StyledNewsFeed posts={this.props.newsfeed} />
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
		displayShare: state.posts.displayShare
	}),

	mapDispatchToProps = dispatch => ({
		setNewsfeed: posts => dispatch( setNewsfeed( posts )),
		addToNewsfeed: posts => dispatch( addToNewsfeed( posts )),
		addPost: post => dispatch( addPost( post )),
		switchMediaOptions: () => dispatch( switchMediaOptions()),
		setNotifications: ( allNotifications, newNotifications ) => {
			dispatch( setNotifications( allNotifications, newNotifications ));
		},
		logout: () => dispatch( logout())
	});

export default connect( mapStateToProps, mapDispatchToProps )( HomePage );
