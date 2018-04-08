import React, { Component } from "react";
import Post from "../containers/Post";
import styled from "styled-components";
import Infinite from "react-infinite";

const
	Wrapper = styled( Infinite )`
	padding: 6px;
`;

class NewsFeed extends Component {

	render() {
		console.log( this.props.posts );
		return (
			<Wrapper
				useWindowAsScrollContainer
				infiniteLoadBeginEdgeOffset={150}
				elementHeight={119.42}
				onInfiniteLoad={this.props.getNewsFeed}
			>

				{this.props.posts.map(( post, index ) =>
					<Post
						key={index}
						id={post._id}
						author={post.author}
						content={post.content}
						date={post.createdAt}
						getNewsFeed={this.props.getNewsFeed}
					/>
				)}
			</Wrapper>
		);
	}
}

export default NewsFeed;
