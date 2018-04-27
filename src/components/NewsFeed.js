import React, { Component } from "react";
import Post from "../containers/Post";
import MediaPost from "../components/MediaPost";
import styled from "styled-components";

class NewsFeed extends Component {
	render() {
		return (
			<div>
				{this.props.posts.map(( post, index ) =>
					post.media ?
						<MediaPost
							key={index}
							index={index}
							id={post._id}
							author={post.author}
							content={post.content}
							mediaContent={post.mediaContent}
							linkContent={post.linkContent}
							date={post.createdAt}
							link={post.link}
							picture={post.picture}
						/>
						:
						<Post
							key={index}
							index={index}
							id={post._id}
							author={post.author}
							content={post.content}
							date={post.createdAt}
							getNewsFeed={this.props.getNewsFeed}
							updatePost={this.props.updatePost}
						/>
				)}
			</div>
		);
	}
}

export default NewsFeed;
