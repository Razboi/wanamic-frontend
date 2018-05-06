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
								sharedBy={post.sharedBy}
								fakeOptions={post.fakeOptions}
								alerts={post.alerts}
								privacyRange={post.privacyRange}
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
								likedBy={post.likedBy}
								comments={post.comments}
								sharedBy={post.sharedBy}
								sharedPost={post.sharedPost}
								fakeOptions={post.fakeOptions}
								alerts={post.alerts}
								privacyRange={post.privacyRange}
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
