import React, { Component } from "react";
import Post from "../containers/Post";
import MediaPost from "../components/MediaPost";
import styled from "styled-components";

const
	Wrapper = styled.div`
		@media (max-width: 420px) {
			height: 100%;
			width: 100%;
			columns: 2;
			column-gap: 1em;
			padding: 5px;
		}
	`,
	StyledMediaPost = styled( MediaPost )`
		@media (max-width: 420px) {
			margin-bottom: 1em;
			display: inline-block;
		}
	`,
	StyledPost = styled( Post )`
		@media (max-width: 420px) {
			margin-bottom: 1em;
			display: inline-block;
		}
	`;


class ExploreContent extends Component {
	render() {
		return (
			<Wrapper>
				{this.props.posts.map(( post, index ) =>
					post.media ?
						<StyledMediaPost
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
						<StyledPost
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
			</Wrapper>
		);
	}
}

export default ExploreContent;
