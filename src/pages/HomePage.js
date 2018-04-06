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
		position: absolute;
		left: 10px;
		bottom: 10px;
	`;


class HomePage extends Component {
	constructor() {
		super();
		this.state = {
			sharebox: "",
			posts: []
		};
	}

	componentWillMount() {
		this.getNewsFeed();
	}

	getNewsFeed = () => {
		api.getNewsFeed()
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

			api.createPost( post )
				.then(() => this.getNewsFeed())
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
				/>
			</div>
		);
	}
}

HomePage.propTypes = {
	logout: PropTypes.func.isRequired,
};

export default connect( null, { logout })( HomePage );
