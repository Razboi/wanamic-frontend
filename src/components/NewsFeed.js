import React, { Component } from "react";
import Post from "../containers/Post";
import MediaPost from "../containers/MediaPost";
import styled from "styled-components";

const
	PostWrapper = styled.div`
		border-bottom: 1px solid rgba(0, 0, 0, .5);
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
								id={post._id}
								author={post.author}
								content={post.content}
								mediaContent={post.mediaContent}
								linkContent={post.linkContent}
								date={post.createdAt}
								link={post.link}
								picture={post.picture}
								likedBy={post.likedBy}
								comments={post.comments}
								switchComments={this.props.switchComments}
							/>
						</PostWrapper>
						:
						<PostWrapper key={index}>
							<Post
								index={index}
								id={post._id}
								author={post.author}
								content={post.content}
								date={post.createdAt}
								getNewsFeed={this.props.getNewsFeed}
								updatePost={this.props.updatePost}
								likedBy={post.likedBy}
								comments={post.comments}
								switchComments={this.props.switchComments}
							/>
						</PostWrapper>
				)}
			</div>
		);
	}
}

export default NewsFeed;
