import React, { Component } from "react";
import Post from "../containers/Post";
import MediaPost from "../containers/MediaPost";
import styled from "styled-components";
import PropTypes from "prop-types";

const
	Wrapper = styled.div`
		height: 100%;
	`,
	PostWrapper = styled.div`
		margin-bottom: 20px;
	`;

class NewsFeed extends Component {
	render() {
		return (
			<Wrapper>
				{this.props.posts.map(( post, index ) =>
					post.media ?
						<PostWrapper key={index}>
							<MediaPost
								index={index}
								post={post}
								socket={this.props.socket}
							/>
						</PostWrapper>
						:
						<PostWrapper key={index}>
							<Post
								index={index}
								post={post}
								socket={this.props.socket}
							/>
						</PostWrapper>
				)}
			</Wrapper>
		);
	}
}

NewsFeed.propTypes = {
	posts: PropTypes.array.isRequired
};

export default NewsFeed;
