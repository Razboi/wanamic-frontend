import React, { Component } from "react";
import styled from "styled-components";
import { Button } from "semantic-ui-react";
import { logout } from "../services/actions/auth";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import ShareBox from "../components/ShareBox";
import NewsFeed from "../components/NewsFeed";
import api from "../services/api";

const
	LogoutButton = styled( Button )`
		position: fixed;
		right: 10px;
		bottom: 10px;
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
			empty: false
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
				post: { token: localStorage.getItem( "token" ), content: this.state.sharebox }
			};

			api.createPost( post )
				.then(() => this.refreshNewsFeed())
				.catch( err => console.log( err ));

			this.setState({ sharebox: "" });
		}
	};

	render() {
		return (
			<div>
				<LogoutButton secondary content="Logout" onClick={this.handleLogout} />
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
			</div>
		);
	}
}

HomePage.propTypes = {
	logout: PropTypes.func.isRequired,
};

export default connect( null, { logout })( HomePage );
