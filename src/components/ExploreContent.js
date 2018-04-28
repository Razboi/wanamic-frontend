import React, { Component } from "react";
import Post from "../containers/Post";
import MediaPost from "../components/MediaPost";
import styled from "styled-components";
import Masonry from "react-masonry-component";

const
	Wrapper = styled( Masonry )`
		@media (max-width: 420px) {
			height: 100%;
			width: 100%;
		}
	`,
	PostWrapper = styled.div`
		@media (max-width: 420px) {
			width: 48%;
			margin: 1%;
			background: #fff;
		}
	`;


class ExploreContent extends Component {
	render() {
		return (
			<Wrapper options={ { transitionDuration: "0.95s" } }>
				{this.props.posts.map(( post, index ) =>
					post.media ?
						<PostWrapper>
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
						</PostWrapper>
						:
						<PostWrapper>
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
						</PostWrapper>
				)}
			</Wrapper>
		);
	}
}

export default ExploreContent;
