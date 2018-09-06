import React, { Component } from "react";
import styled from "styled-components";
import {
	setPosts, addToPosts, switchMediaOptions, addPost, switchPostDetails,
	switchShare
} from "../services/actions/posts";
import { switchNotifications } from "../services/actions/notifications";
import { switchMessages } from "../services/actions/conversations";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import NewsFeed from "../components/NewsFeed";
import api from "../services/api";
import InfiniteScroll from "react-infinite-scroller";
import MediaOptions from "../containers/MediaOptions";
import NavBar from "../containers/NavBar";
import refreshToken from "../utils/refreshToken";

const
	Wrapper = styled.div`
		overflow-y: auto;
		height: 100%;
		min-height: 100vh;
		width: 100%;
		padding-bottom: 300px;
		@media (max-width: 420px) {
			::-webkit-scrollbar {
				display: none !important;
			}
		};
		@media (min-width: 420px) {
			background: rgb(230, 240, 236);
		}
	`,
	ShareMediaButton = styled.div`
		position: fixed;
		left: 50%;
		transform: translateX(-50%);
		bottom: 5px;
		z-index: 3;
		border-radius: 100%;
		padding: 1rem;
		background: rgba(133, 217, 191, 0.9) !important;
		display: flex;
		align-items: center;
		justify-content: center;
		:hover {
			cursor: pointer;
		}
	`,
	PlusImage = styled.span`
		height: 24px;
		width: 24px;
		display: block;
		background-image: url(${props => props.image});
		background-repeat: no-repeat;
		margin: 0;
		position: relative;
		transform: ${props => props.active ? "rotate(45deg)" : "none"};
		transition: transform 0.5s;
		background-size: 100%;
	`,
	MediaDimmer = styled.div`
		filter: ${props => props.blur ? "blur(15px)" : "none"};
		padding-top: 49.33px;
	`,
	OutsideClickHandler = styled.div`
		width: 100%;
		height: 100%;
		min-height: 100vh;
	`,
	HomeContent = styled.section`
		max-width: 1220px;
		display: flex;
		justify-content: center;
		margin: 0 auto;
	`,
	Information = styled.div`
		color: rgba(0,0,0,0.17);
		width: 170px;
		font-size: 12px;
		position: absolute;
		left: 0;
		text-align: center;
		@media (max-width: 1200px) {
			display: none;
		}
	`,
	InfoLinks = styled.ul`
		display: flex;
		padding: 0;
    list-style: none;
    justify-content: space-evenly;
		a {
			color: inherit;
		}
	`,
	Copyright = styled.h4`
		font-size: 12px;
		font-family: inherit;
		margin: 0;
		font-weight: normal;
	`;


class Home extends Component {
	constructor() {
		super();
		this.state = {
			skip: 1,
			hasMore: true,
			mediaButton: true,
			chat: true
		};
	}

	componentDidMount() {
		window.scrollTo( 0, 0 );
		this.refreshNewsFeed();
		document.title = "Wanamic";
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
						this.props.addToPosts( res.data );
						this.setState({
							hasMore: res.data.length === 10,
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
					this.props.setPosts( res.data );
				}
			})
			.catch( err => console.log( err ));
	}

	toggleMediaButton = () => {
		this.setState({ mediaButton: !this.state.mediaButton });
	}

	hidePostDetails = () => {
		this.props.switchPostDetails();
	}

	hidePopups = () => {
		if ( this.props.displayNotifications ) {
			this.props.switchNotifications();
		}
		if ( this.props.displayMessages ) {
			this.props.switchMessages();
		}
		if ( this.props.displayPostDetails ) {
			this.props.switchPostDetails();
		}
		if ( this.props.displayShare ) {
			this.props.switchShare();
		}
	}

	toggleChat = () => {
		this.setState( state => ({ chat: !state.chat }));
	}

	render() {
		let plusImage;

		try {
			plusImage = require( "../images/plus.svg" );
		} catch ( err ) {
			console.log( err );
		}

		return (
			<Wrapper>
				<InfiniteScroll
					pageStart={this.state.skip}
					hasMore={this.state.hasMore}
					loadMore={this.getNewsFeed}
					initialLoad={false}
					useWindow={true}
				>

					{this.state.mediaButton &&
						<ShareMediaButton
							onClick={() => this.props.switchMediaOptions()}
						>
							<PlusImage
								image={plusImage}
								active={this.props.mediaOptions}
							/>
						</ShareMediaButton>
					}

					{this.props.mediaOptions &&
						<MediaOptions
							toggleMediaButton={this.toggleMediaButton}
							socket={this.props.socket}
						/>}

					<MediaDimmer blur={this.props.mediaOptions} >
						<NavBar socket={this.props.socket}/>

						<OutsideClickHandler onClick={this.hidePopups}>
							<HomeContent>
								<Information>
									<InfoLinks>
										<li><a href="/information/privacy">Privacy</a></li>
										<li><a href="/information/terms">Terms</a></li>
										<li><a href="/information/contact">Contact</a></li>
									</InfoLinks>
									<Copyright>© 2018 WANAMIC</Copyright>
								</Information>
								<NewsFeed
									posts={this.props.newsfeed}
									socket={this.props.socket}
									history={this.props.history}
								/>
							</HomeContent>
						</OutsideClickHandler>
					</MediaDimmer>

				</InfiniteScroll>
			</Wrapper>
		);
	}
}

Home.propTypes = {
	history: PropTypes.object.isRequired,
	socket: PropTypes.object.isRequired
};

const
	mapStateToProps = state => ({
		newsfeed: state.posts.newsfeed,
		mediaOptions: state.posts.mediaOptions,
		displayMessages: state.conversations.displayMessages,
		displayNotifications: state.notifications.displayNotifications,
	}),

	mapDispatchToProps = dispatch => ({
		setPosts: posts => dispatch( setPosts( posts )),
		addToPosts: posts => dispatch( addToPosts( posts )),
		addPost: post => dispatch( addPost( post )),
		switchMediaOptions: () => dispatch( switchMediaOptions()),
		switchPostDetails: post => dispatch( switchPostDetails( post )),
		switchNotifications: () => dispatch( switchNotifications()),
		switchMessages: () => dispatch( switchMessages()),
		switchShare: () => dispatch( switchShare())
	});

export default connect( mapStateToProps, mapDispatchToProps )( Home );
