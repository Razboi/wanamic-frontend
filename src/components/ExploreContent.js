import React, { Component } from "react";
import ExplorePost from "../components/ExplorePost";
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
			width: calc(100% / 2);
			padding: 0.3rem;
		}
	`;


class ExploreContent extends Component {
	render() {
		return (
			<Wrapper options={ { transitionDuration: "0.95s" } }>
				{this.props.posts.map(( post, index ) =>
					<PostWrapper
						key={index}
						onClick={() => this.props.displayPostDetails( index )}
					>
						<ExplorePost
							post={post}
						/>
					</PostWrapper>
				)}
			</Wrapper>
		);
	}
}

ExploreContent.propTypes = {
	posts: PropTypes.array.isRequired,
	displayPostDetails: PropTypes.func.isRequired
};

export default ExploreContent;
