import React, { Component } from "react";
import Post from "../containers/Post";
import MediaPost from "../containers/MediaPost";
import styled from "styled-components";
import PropTypes from "prop-types";

const
	Wrapper = styled.div`
		border: 1px solid rgba(0,0,0,0.266);
	`;

class SharedPost extends Component {
	render() {
		return (
			<Wrapper>
				{this.props.post.media ?
					<MediaPost
						post={this.props.post}
						fakeOptions={true}
						onShare
					/>
					:
					<Post
						post={this.props.post}
						fakeOptions={true}
					/>}
			</Wrapper>
		);
	}
}

SharedPost.propTypes = {
	post: PropTypes.object.isRequired
};

export default SharedPost;
