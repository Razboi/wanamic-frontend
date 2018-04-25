import React, { Component } from "react";
import styled from "styled-components";
import { Button, Input, TextArea } from "semantic-ui-react";
import { logout } from "../services/actions/auth";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import ShareBox from "../components/ShareBox";
import NewsFeed from "../components/NewsFeed";
import api from "../services/api";

var LSToken = localStorage.getItem( "token" );

const
	Wrapper = styled.div`
		height: 100vh;
		width: 100%;
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
	`,
	PictureUploadLabel = styled.input`
		width: 100%;
		height: 100%;
		z-index: 2;
	`;


class HomePage extends Component {
	constructor() {
		super();
		this.state = {
			sharebox: "",
			posts: [],
			skip: 0,
			isInfiniteLoading: false,
			empty: false,
			showMediaOptions: false,
			shareLink: false,
			linkInput: "",
			linkContent: "",
			picture: null
		};
	}

	getNewsFeed = () => {
		if ( !this.state.empty && !this.state.isInfiniteLoading ) {
			this.setState({ isInfiniteLoading: true });
			api.getNewsFeed( this.state.skip, LSToken )
				.then( res => {
					if ( res.data.length > 0 ) {
						this.setState({
							posts: [ ...this.state.posts, ...res.data ],
							skip: this.state.skip + 1,
							isInfiniteLoading: false
						});
					} else {
						this.setState({ empty: true, isInfiniteLoading: false });
					}
				})
				.catch( err => console.log( err ));
		}
	}

	refreshNewsFeed = () => {
		api.getNewsFeed( 0, LSToken )
			.then( res => {
				this.setState({
					posts: res.data
				});
			})
			.catch( err => console.log( err ));
	}

	updatePost = ( postIndex, updatedContent ) => {
		var posts = this.state.posts;
		posts[ postIndex ].content = updatedContent;
		this.setState({ posts: posts });
	}

	handleLogout = () =>
		this.props.logout();

	handleChange = e =>
		this.setState({ [ e.target.name ]: e.target.value });

	handleShare = () => {
		if ( this.state.sharebox !== "" ) {
			const post = {
				post: { token: LSToken, content: this.state.sharebox }
			};

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
			api.createMediaLink( LSToken, {
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

	render() {
		return (
			<Wrapper>
				<ShareMediaButton primary circular icon="plus" size="large"
					onClick={this.swapMediaOptions}
				/>
				<LogoutButton secondary content="Logout"
					onClick={this.handleLogout}
				/>
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
						updatePost={this.updatePost}
					/>
				</MediaDimmer>
			</Wrapper>
		);
	}
}

HomePage.propTypes = {
	logout: PropTypes.func.isRequired,
};

export default connect( null, { logout })( HomePage );
