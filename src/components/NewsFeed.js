import React, { Component } from "react";
import Post from "./Post";
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
						handleDelete={this.props.handleDelete}
						handleUpdate={this.props.handleUpdate}
						handleChange={this.props.handleChange}
					/>
				)}
			</Wrapper>
		);
	}
}

export default NewsFeed;
