import React, { Component } from "react";
import styled from "styled-components";
import { Button } from "semantic-ui-react";
import { logout } from "../services/actions/auth";
import {
	setNewsfeed, switchMediaOptions, addPost
} from "../services/actions/posts";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import ShareBox from "../components/ShareBox";
import NewsFeed from "../components/NewsFeed";
import api from "../services/api";
import InfiniteScroll from "react-infinite-scroller";
import Comments from "../containers/Comments";
import Share from "../containers/Share";
import MediaOptions from "../components/MediaOptions";

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
	LogoutButton = styled( Button )`
		position: fixed;
		left: 5px;
		bottom: 5px;
		z-index: 3;
	`,
	ShareMediaButton = styled( Button )`
		position: fixed;
		right: 5px;
		bottom: 5px;
		z-index: 3;
	`,
	MediaDimmer = styled.div`
		filter: ${props => props.blur ? "blur(15px)" : "none"};
		height: 100%;
		width: 100%;
		display: grid;
		grid-template-columns: 100%;
		grid-template-rows: 10% 90%;
		grid-template-areas:
			"sb"
			"nf"
	`,
	StyledShareBox = styled( ShareBox )`
		grid-area: sb;
	`,
	StyledNewsFeed = styled( NewsFeed )`
		grid-area: nf;
		height: 100%;
	`;


class HomePage extends Component {
	constructor() {
		super();
		this.state = {
			sharebox: "",
			skip: 1,
			isInfiniteLoading: false,
			hasMore: true,
			shareLink: false,
			linkInput: "",
			linkContent: "",
			picture: null,
		};
	}

	componentDidMount() {
		this.refreshNewsFeed();
	}

	getNewsFeed = () => {
		if ( this.state.hasMore && !this.state.isInfiniteLoading ) {
			this.setState({ isInfiniteLoading: true });
			api.getNewsFeed( this.state.skip )
				.then( res => {
					if ( res.data.length < 10 ) {
						this.props.setNewsfeed( res.data );
						this.setState({
							hasMore: false,
							isInfiniteLoading: false
						});
						return;
					}
					this.props.setNewsfeed( res.data );
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

	handleShare = () => {
		if ( this.state.sharebox !== "" ) {
			const post = this.state.sharebox;
			api.createPost( post )
				.then( newPost => this.props.addPost( newPost ))
				.catch( err => console.log( err ));

			this.setState({ sharebox: "" });
		}
	};

	handleSearchMedia = media => {
		this.props.history.push( "/media/" + media );
	}

	switchMediaOptions = () => {
		this.props.switchMediaOptions();
		this.setState({
			shareLink: false
		});
	}

	handleLink = () => {
		this.setState({ shareLink: true });
	}

	submitLink = () => {
		if ( this.state.linkInput ) {
			api.createMediaLink({
				link: this.state.linkInput, content: this.state.linkContent
			})
				.then( newPost => {
					this.setState({ posts: [ newPost, ...this.state.posts ] });
					this.swapMediaOptions();
				})
				.catch( err => console.log( err ));
		}
	}

	handleLinkKeyPress = e => {
		if ( e.key === "Enter" ) {
			this.submitLink();
		}
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
				<InfiniteScroll
					pageStart={this.state.skip}
					hasMore={this.state.hasMore}
					loadMore={this.getNewsFeed}
					initialLoad={false}
					useWindow={false}
				>
					<ShareMediaButton primary circular icon="plus" size="large"
						onClick={this.switchMediaOptions}
					/>
					<LogoutButton secondary content="Logout"
						onClick={() => this.props.logout()}
					/>
					{this.props.displayShare && <Share /> }
					{this.props.displayComments && <Comments />}

					{this.props.mediaOptions &&
						<MediaOptions
							shareLink={this.state.shareLink}
							handleLinkKeyPress={this.handleLinkKeyPress}
							handleChange={this.handleChange}
							handleSearchMedia={this.handleSearchMedia}
							handleLink={this.handleLink}
							handlePictureSelect={this.handlePictureSelect}
						/>}

					<MediaDimmer blur={this.props.mediaOptions}>
						<StyledShareBox
							handleChange={this.handleChange}
							sharebox={this.state.sharebox}
							handleShare={this.handleShare}
						/>
						<StyledNewsFeed posts={this.props.newsfeed} />
					</MediaDimmer>

				</InfiniteScroll>
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
		addPost: post => dispatch( addPost( post )),
		switchMediaOptions: () => dispatch( switchMediaOptions()),
		logout: () => dispatch( logout())
	});

export default connect( mapStateToProps, mapDispatchToProps )( HomePage );
