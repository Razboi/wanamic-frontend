import React, { Component } from "react";
import Post from "../containers/Post";
import MediaPost from "../containers/MediaPost";
import styled from "styled-components";

const
	Wrapper = styled.div`
		transform: scale( 0.75 );
		border: 1px solid #808080;
	`;

class SharedPost extends Component {
	render() {
		return (
			<Wrapper>
				{this.props.post.media ?
					<MediaPost
						id={this.props.post._id}
						author={this.props.post.author}
						content={this.props.post.content}
						mediaContent={this.props.post.mediaContent}
						linkContent={this.props.post.linkContent}
						date={this.props.post.createdAt}
						link={this.props.post.link}
						picture={this.props.post.picture}
						likedBy={this.props.post.likedBy}
						comments={this.props.post.comments}
						sharedBy={this.props.post.sharedBy}
						switchComments={this.props.switchComments}
						switchShare={this.props.switchShare}
						fakeOptions={true}
					/>
					:
					<Post
						id={this.props.post._id}
						author={this.props.post.author}
						content={this.props.post.content}
						date={this.props.post.createdAt}
						likedBy={this.props.post.likedBy}
						comments={this.props.post.comments}
						sharedBy={this.props.post.sharedBy}
						switchComments={this.props.switchComments}
						switchShare={this.props.switchShare}
						fakeOptions={true}
					/>}
			</Wrapper>
		);
	}
}

export default SharedPost;
