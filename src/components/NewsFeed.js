import React, { Component } from "react";
import Post from "../containers/Post";
import MediaPost from "../containers/MediaPost";
import styled from "styled-components";
import PropTypes from "prop-types";

const
	PostWrapper = styled.div`
		margin-bottom: 20px;
	`;

class NewsFeed extends Component {
	render() {
		return (
			<div>
				{this.props.posts.map(( post, index ) =>
					post.media ?
						<PostWrapper key={index}>
							<MediaPost
								index={index}
								post={post}
							/>
						</PostWrapper>
						:
						<PostWrapper key={index}>
							<Post
								index={index}
								post={post}
							/>
						</PostWrapper>
				)}
			</div>
		);
	}
}

NewsFeed.propTypes = {
	posts: PropTypes.array.isRequired
};

export default NewsFeed;
