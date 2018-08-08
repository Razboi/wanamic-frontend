import React, { Component } from "react";
import Post from "../containers/Post";
import MediaPost from "../containers/MediaPost";
import styled from "styled-components";
import PropTypes from "prop-types";
import api from "../services/api";

const
	Wrapper = styled.div`
		border: 1px solid rgba(0,0,0,0.266);
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
					/>
					:
					<Post
						post={this.state.post}
						fakeOptions={true}
					/>}
			</Wrapper>
		);
	}
}

SharedPost.propTypes = {
	postId: PropTypes.object.isRequired
};

export default SharedPost;
