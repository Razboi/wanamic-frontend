import React, { Component } from "react";
import Post from "../containers/Post";
import MediaPost from "../containers/MediaPost";
import styled from "styled-components";
import Masonry from "react-masonry-component";
import PropTypes from "prop-types";

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
		}
	`;


class ExploreContent extends Component {
	render() {
		return (
			<Wrapper options={ { transitionDuration: "0.95s" } }>
				{this.props.posts.map(( post, index ) =>
					post.media ?
						<PostWrapper key={index}>
							<MediaPost
								index={index}
								post={post}
							/>
						</PostWrapper>
						:
						<PostWrapper key={index}>
							<Post
								index={index}
								post={post}
							/>
						</PostWrapper>
				)}
			</Wrapper>
		);
	}
}

ExploreContent.propTypes = {
	posts: PropTypes.array.isRequired
};

export default ExploreContent;
