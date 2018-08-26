import React, { Component } from "react";
import Post from "../containers/Post";
import MediaPost from "../containers/MediaPost";
import styled from "styled-components";
import PropTypes from "prop-types";

const
	Wrapper = styled.div`
		height: 100%;
		@media (max-width: 600px) {
			width: 100%;
		}
		@media (min-width: 600px) {
			width: 600px;
			padding-top: 1rem;
		}
	`;

class NewsFeed extends Component {
	render() {
		return (
			<Wrapper>
				{this.props.posts.map(( post, index ) =>
					post.media ?
						<MediaPost
							newsFeed
							key={index}
							index={index}
							post={post}
							socket={this.props.socket}
							history={this.props.history}
						/>
						:
						<Post
							key={index}
							index={index}
							post={post}
							socket={this.props.socket}
							history={this.props.history}
						/>
				)}
			</Wrapper>
		);
	}
}

NewsFeed.propTypes = {
	posts: PropTypes.array.isRequired,
	socket: PropTypes.object.isRequired,
	history: PropTypes.object.isRequired,
};

export default NewsFeed;
