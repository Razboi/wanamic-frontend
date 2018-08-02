import React, { Component } from "react";
import ExplorePost from "../components/ExplorePost";
import styled from "styled-components";
import Masonry from "react-masonry-component";
import PropTypes from "prop-types";

const
	Wrapper = styled( Masonry )`
		height: 100%;
		width: 100%;
	`,
	PostWrapper = styled.div`
		padding: 8px;
		z-index: 1;
		:hover {
			cursor: pointer;
		}
		@media (min-width: 2615px) {
			width: calc(100% / 13);
		}
		@media (min-width: 2415px) and (max-width: 2615px) {
			width: calc(100% / 12);
		}
		@media (min-width: 2215px) and (max-width: 2415px) {
			width: calc(100% / 11);
		}
		@media (min-width: 2015px) and (max-width: 2215px) {
			width: calc(100% / 10);
		}
		@media (min-width: 1815px) and (max-width: 2015px) {
			width: calc(100% / 9);
		}
		@media (min-width: 1615px) and (max-width: 1815px) {
			width: calc(100% / 8);
		}
		@media (min-width: 1415px) and (max-width: 1615px) {
			width: calc(100% / 7);
		}
		@media (min-width: 1215px) and (max-width: 1415px) {
			width: calc(100% / 6);
		}
		@media (min-width: 1015px) and (max-width: 1215px) {
			width: calc(100% / 5);
		}
		@media (min-width: 815px) and (max-width: 1015px) {
			width: calc(100% / 4);
		}
		@media (min-width: 615px) and (max-width: 815px) {
			width: calc(100% / 3);
		}
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
					<PostWrapper key={index}>
						<ExplorePost
							post={post}
							handleClick={() => this.props.displayPostDetails( index )}
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
