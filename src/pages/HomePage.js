import React, { Component } from "react";
import styled from "styled-components";
import { Button, Input } from "semantic-ui-react";
import { logout } from "../services/actions/auth";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import ShareBox from "../components/ShareBox";
import NewsFeed from "../components/NewsFeed";
import api from "../services/api";

const
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
		height: 100vh;
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
	ShareLinkInput = styled( Input )`
		width: 300px;
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
			linkInput: ""
		};
	}

	getNewsFeed = () => {
		if ( !this.state.empty && !this.state.isInfiniteLoading ) {
			this.setState({ isInfiniteLoading: true });
			api.getNewsFeed( this.state.skip, localStorage.getItem( "token" ))
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
		api.getNewsFeed( 0, localStorage.getItem( "token" ))
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
				post: {
					token: localStorage.getItem( "token" ), content: this.state.sharebox
				}
			};

			api.createPost( post )
				.then(() => this.refreshNewsFeed())
				.catch( err => console.log( err ));

			this.setState({ sharebox: "" });
		}
	};

	handleSearchMedia = media => {
		this.props.history.push( "/search/" + media );
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
		console.log( "Submited" );
	}

	handleLinkKeyPress = e => {
		if ( e.key === "Enter" ) {
			this.submitLink();
		}
	}

	render() {
		return (
			<div>
				<ShareMediaButton primary circular icon="plus" size="large"
					onClick={this.swapMediaOptions}
				/>
				<LogoutButton secondary content="Logout"
					onClick={this.handleLogout}
				/>
				<MediaOptionsWrapper show={this.state.showMediaOptions}>
					{this.state.shareLink ?
						<MediaOptions>
							<ShareLinkInput
								name="linkInput"
								onKeyPress={this.handleLinkKeyPress}
								onChange={this.handleChange}
								placeholder="Share your link"
							/>
						</MediaOptions>
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
					<ShareBox
						handleChange={this.handleChange}
						sharebox={this.state.sharebox}
						handleShare={this.handleShare}
					/>
					<NewsFeed
						posts={this.state.posts}
						getNewsFeed={this.getNewsFeed}
						updatePost={this.updatePost}
					/>
				</MediaDimmer>
			</div>
		);
	}
}

HomePage.propTypes = {
	logout: PropTypes.func.isRequired,
};

export default connect( null, { logout })( HomePage );
