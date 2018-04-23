import React, { Component } from "react";
import Post from "../containers/Post";
import MediaPost from "../components/MediaPost";
import styled from "styled-components";
import Infinite from "react-infinite";

const
	Wrapper = styled( Infinite )`
	padding: 6px;
`;

class NewsFeed extends Component {

	render() {
		return (
			<Wrapper
				useWindowAsScrollContainer
				infiniteLoadBeginEdgeOffset={150}
				elementHeight={119.42}
				onInfiniteLoad={this.props.getNewsFeed}
			>

				{this.props.posts.map(( post, index ) =>
					post.media ?
						<MediaPost
							key={index}
							index={index}
							id={post._id}
							author={post.author}
							content={post.content}
							mediaContent={post.mediaContent}
							date={post.createdAt}
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
			</Wrapper>
		);
	}
}

export default NewsFeed;
