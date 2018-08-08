import React, { Component } from "react";
import styled from "styled-components";
import {
	setPosts, addToPosts, switchMediaOptions, addPost, switchPostDetails,
	switchComments, switchShare
} from "../services/actions/posts";
import { switchNotifications } from "../services/actions/notifications";
import { switchMessages } from "../services/actions/conversations";
import PostDetails from "../containers/PostDetails";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import NewsFeed from "../components/NewsFeed";
import api from "../services/api";
import InfiniteScroll from "react-infinite-scroller";
import Comments from "../containers/Comments";
import Share from "../containers/Share";
import MediaOptions from "../containers/MediaOptions";
import NavBar from "../containers/NavBar";
import refreshToken from "../utils/refreshToken";

const
	Wrapper = styled.div`
		overflow-y: auto;
		height: 100%;
		min-height: 100vh;
		width: 100%;
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
	`,
	MediaDimmer = styled.div`
		filter: ${props => props.blur ? "blur(15px)" : "none"};
		padding-top: 49.33px;
	`,
	PostDetailsDimmer = styled.div`
		position: fixed;
		height: 100vh;
		width: 100vw;
		z-index: 5;
		background: rgba(0,0,0,0.6);
		display: flex;
		align-items: center;
		justify-content: center;
	`,
	OutsideClickHandler = styled.div`
		width: 100%;
		height: 100%;
	`,
	HomeContent = styled.section`
		max-width: 1140px;
		display: flex;
		justify-content: center;
		margin: 0 auto;
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
		if ( this.props.displayComments ) {
			this.props.switchComments();
		}
		if ( this.props.displayShare ) {
			this.props.switchShare();
		}
	}

	toggleChat = () => {
		this.setState( state => ({ chat: !state.chat }));
	}

	render() {
		var plusImage;
		const {
			newsfeed, postDetailsIndex, displayPostDetails, displayComments,
			displayShare
		} = this.props;

		try {
			plusImage = require( "../images/plus.png" );
		} catch ( err ) {
			console.log( err );
		}

		return (
			<Wrapper>
				{( displayPostDetails || displayComments || displayShare ) &&
					<PostDetailsDimmer>
						<OutsideClickHandler onClick={this.hidePopups} />
						{displayPostDetails &&
							<PostDetails
								post={newsfeed[ postDetailsIndex ]}
								switchDetails={this.hidePostDetails}
								socket={this.props.socket}
								index={postDetailsIndex}
								history={this.props.history}
							/>}
						{displayComments &&
							<Comments
								socket={this.props.socket}
							/>}
						{displayShare && <Share />}
					</PostDetailsDimmer>
				}
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
								<NewsFeed
									posts={newsfeed}
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
		displayComments: state.posts.displayComments,
		displayShare: state.posts.displayShare,
		displayPostDetails: state.posts.displayPostDetails,
		postDetailsIndex: state.posts.postDetailsIndex,
		displayNotifications: state.notifications.displayNotifications,
		displayMessages: state.conversations.displayMessages
	}),

	mapDispatchToProps = dispatch => ({
		setPosts: posts => dispatch( setPosts( posts )),
		addToPosts: posts => dispatch( addToPosts( posts )),
		addPost: post => dispatch( addPost( post )),
		switchMediaOptions: () => dispatch( switchMediaOptions()),
		switchPostDetails: () => dispatch( switchPostDetails()),
		switchNotifications: () => dispatch( switchNotifications()),
		switchMessages: () => dispatch( switchMessages()),
		switchComments: () => dispatch( switchComments()),
		switchShare: () => dispatch( switchShare())
	});

export default connect( mapStateToProps, mapDispatchToProps )( Home );
