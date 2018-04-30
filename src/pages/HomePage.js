import React, { Component } from "react";
import styled from "styled-components";
import { Button, Input, TextArea } from "semantic-ui-react";
import { logout } from "../services/actions/auth";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import ShareBox from "../components/ShareBox";
import NewsFeed from "../components/NewsFeed";
import api from "../services/api";
import InfiniteScroll from "react-infinite-scroller";
import Comments from "../containers/Comments";
import Share from "../containers/Share";

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
		filter: ${props => props.show ? "blur(10px)" : "none"};
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
	`,
	MediaOptionsWrapper = styled.div`
		display: ${props => props.show ? "grid" : "none"};
		position: fixed;
		height: 100vh;
		width: 100%;
		z-index: 2;
	`,
	MediaOptions = styled.div`
		justify-self: center;
		align-self: center;
	`,
	MediaButton = styled( Button )`
	`,
	LinkForm = styled.div`
		display: grid;
		justify-self: center;
		align-self: center;
		width: 100%;
	`,
	ShareLinkInput = styled( Input )`
		width: 80%;
		justify-self: center;
		align-self: center;
		margin-bottom: 10px;
	`,
	ShareLinkContent = styled( TextArea )`
		width: 90%;
		justify-self: center;
		align-self: center;
	`,
	PictureUploadWrapper = styled.span`
		position: relative;
	`,
	PictureUploadInput = styled.input`
		width: 0.1px;
		height: 0.1px;
		opacity: 0;
		overflow: hidden;
		position: absolute;
		z-index: -1;
	`;


class HomePage extends Component {
	constructor() {
		super();
		this.state = {
			sharebox: "",
			posts: [],
			skip: 1,
			isInfiniteLoading: false,
			hasMore: true,
			showMediaOptions: false,
			shareLink: false,
			linkInput: "",
			linkContent: "",
			picture: null,
			showComments: false,
			postDetails: ""
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
						this.setState({
							posts: [ ...this.state.posts, ...res.data ],
							hasMore: false,
							isInfiniteLoading: false
						});
						return;
					}
					this.setState({
						posts: [ ...this.state.posts, ...res.data ],
						isInfiniteLoading: false,
						skip: this.state.skip + 1
					});
				}).catch( err => console.log( err ));
		}
	}

	refreshNewsFeed = () => {
		api.getNewsFeed( 0 )
			.then( res => {
				this.setState({
					posts: res.data
				});
			}).catch( err => console.log( err ));
	}

	handleLogout = () =>
		this.props.logout();

	handleChange = e =>
		this.setState({ [ e.target.name ]: e.target.value });

	handleShare = () => {
		if ( this.state.sharebox !== "" ) {
			const post = this.state.sharebox;
			api.createPost( post )
				.then(() => this.refreshNewsFeed())
				.catch( err => console.log( err ));

			this.setState({ sharebox: "" });
		}
	};

	handleSearchMedia = media => {
		this.props.history.push( "/media/" + media );
	}

	swapMediaOptions = () => {
		this.setState({
			showMediaOptions: !this.state.showMediaOptions,
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
				.then(() => this.swapMediaOptions())
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

	switchComments = postId => {
		this.setState({
			showComments: !this.state.showComments,
			postDetails: postId
		});
	}

	switchShare = postIndex => {
		if ( postIndex === false ) {
			this.setState({ showShare: !this.state.showShare });
			return;
		}
		if ( this.state.posts[ postIndex ].sharedPost ) {
			this.setState({
				showShare: !this.state.showShare,
				postToShare: this.state.posts[ postIndex ].sharedPost
			});
		} else {
			this.setState({
				showShare: !this.state.showShare,
				postToShare: this.state.posts[ postIndex ]
			});
		}
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
						onClick={this.swapMediaOptions}
					/>
					<LogoutButton secondary content="Logout"
						onClick={this.handleLogout}
					/>
					{this.state.showShare &&
					<Share
						switchShare={this.switchShare}
						postToShare={this.state.postToShare}
					/>
					}
					{this.state.showComments &&
					<Comments
						switchComments={this.switchComments}
						comments={this.state.comments}
						id={this.state.postDetails}
					/>
					}

					<MediaOptionsWrapper show={this.state.showMediaOptions}>
						{this.state.shareLink ?
							<LinkForm>
								<ShareLinkInput
									name="linkInput"
									onKeyPress={this.handleLinkKeyPress}
									onChange={this.handleChange}
									placeholder="Share your link"
								/>
								<ShareLinkContent
									name="linkContent"
									onKeyPress={this.handleLinkKeyPress}
									onChange={this.handleChange}
									placeholder="Anything to say?"
								/>
							</LinkForm>
							:
							<MediaOptions>
								<MediaButton secondary circular icon="book" size="huge"
									onClick={() => this.handleSearchMedia( "book" )}
								/>
								<MediaButton secondary circular icon="music" size="huge"
									onClick={() => this.handleSearchMedia( "music" )}
								/>
								<MediaButton secondary circular icon="linkify" size="huge"
									onClick={this.handleLink}
								/>
								<PictureUploadWrapper>
									<MediaButton secondary circular icon="picture" size="huge"
										onClick={() => document.getElementById( "pictureInput" ).click()}
									/>
									<PictureUploadInput type="file" name="picture" id="pictureInput"
										onChange={this.handlePictureSelect}
									/>
								</PictureUploadWrapper>
								<MediaButton secondary circular icon="film" size="huge"
									onClick={() => this.handleSearchMedia( "movie" )}
								/>
								<MediaButton secondary circular icon="tv" size="huge"
									onClick={() => this.handleSearchMedia( "tv" )}
								/>
							</MediaOptions>
						}
					</MediaOptionsWrapper>
					<MediaDimmer show={this.state.showMediaOptions}>
						<StyledShareBox
							handleChange={this.handleChange}
							sharebox={this.state.sharebox}
							handleShare={this.handleShare}
						/>
						<StyledNewsFeed
							posts={this.state.posts}
							getNewsFeed={this.getNewsFeed}
							hasMore={this.state.hasMore}
							skip={this.state.skip}
							switchComments={this.switchComments}
							switchShare={this.switchShare}
						/>
					</MediaDimmer>
				</InfiniteScroll>
			</Wrapper>
		);
	}
}

HomePage.propTypes = {
	logout: PropTypes.func.isRequired,
};

export default connect( null, { logout })( HomePage );
