import React, { Component } from "react";
import Post from "../containers/Post";
import MediaPost from "../containers/MediaPost";
import styled from "styled-components";
import PropTypes from "prop-types";
import api from "../services/api";

const
	Wrapper = styled.div`
		border: 1px solid rgba(0,0,0,0.1);
	`;

class SharedPost extends Component {
	constructor() {
		super();
		this.state = {
			post: { alerts: {}, author: {} }
		};
	}

	static getDerivedStateFromProps( props, state ) {
		const { post } = props;
		if ( !post ) {
			return null;
		}
		return {
			post: post
		};
	}

	componentDidMount() {
		!this.props.post && this.getPost();
	}

	getPost = async() => {
		var post;
		try {
			post = await api.getPost( this.props.postId );
		} catch ( err ) {
			console.log( err );
		}
		this.setState({ post: post.data });
	}

	render() {
		return (
			<Wrapper>
				{this.state.post.media ?
					<MediaPost
						post={this.state.post}
						fakeOptions={true}
						onShare
						history={this.props.history}
					/>
					:
					<Post
						post={this.state.post}
						fakeOptions={true}
						history={this.props.history}
					/>
				}
			</Wrapper>
		);
	}
}

SharedPost.propTypes = {
	post: PropTypes.object.isRequired,
	history: PropTypes.object.isRequired
};

export default SharedPost;
