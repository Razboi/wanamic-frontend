import React, { Component } from "react";
import Post from "../containers/Post";
import styled from "styled-components";

const
	Wrapper = styled.div`
	padding: 6px;
`;

class NewsFeed extends Component {

	render() {
		return (
			<Wrapper>
				{this.props.posts.map(( post, index ) =>
					<Post
						key={index}
						id={post._id}
						author={post.authorUsername}
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
