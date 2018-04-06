import React, { Component } from "react";
import styled from "styled-components";
import { Button } from "semantic-ui-react";
import { logout } from "../services/actions/auth";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import ShareBox from "../components/ShareBox";
import NewsFeed from "../components/NewsFeed";
import axios from "axios";

const
	LogoutButton = styled( Button )`
		position: absolute;
		left: 10px;
		bottom: 10px;
	`;


class HomePage extends Component {
	constructor() {
		super();
		this.state = {
			sharebox: "",
			posts: [],
			updatedPost: ""
		};
	}

	componentWillMount() {
		this.getNewsfeed();
	}

	getNewsfeed = () => {
		axios({
			method: "get",
			url: "posts/test@gmail.com"
		})
			.then( res => this.setState({ posts: res.data }))
			.catch( err => console.log( err ));
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

			axios({
				method: "post",
				url: "/posts/create",
				data: post
			}).then( res => {
				this.getNewsfeed();
			}).catch( err => console.log( err ));

			this.setState({ sharebox: "" });
		}
	};

	handleDelete = postId => {
		axios({
			method: "delete",
			url: "/posts/delete",
			data: { post: { id: postId } }
		}).then( res => {
			this.getNewsfeed();
		}).catch( err => console.log( err ));
	};

	handleUpdate = () => {
		console.log( this.state.updatedPost );
		// axios({
		// 	method: "patch",
		// 	url: "/posts/update",
		// 	data: { post: { id: postId } }
		// }).then( res => {
		// 	this.getNewsfeed();
		// }).catch( err => console.log( err ));
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
					handleDelete={this.handleDelete}
					handleUpdate={this.handleUpdate}
					handleChange={this.handleChange}
				/>
			</div>
		);
	}
}

HomePage.propTypes = {
	logout: PropTypes.func.isRequired,
};

export default connect( null, { logout })( HomePage );
