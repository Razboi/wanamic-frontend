import React, { Component } from "react";
import Post from "../containers/Post";
import { Icon } from "semantic-ui-react";
import MediaPost from "../containers/MediaPost";
import styled from "styled-components";
import PropTypes from "prop-types";
import api from "../services/api";

const
	Wrapper = styled.div`
		height: 100vh;
		width: 100%;
		position: absolute;
		z-index: 4;
		background: #fff;
	`,
	HeaderWrapper = styled.div`
		height: 49.33px;
		display: flex;
		align-items: center;
		padding-left: 10px;
		border-bottom: 1px solid rgba(0, 0, 0, .5);
	`,
	HeaderTxt = styled.span`
		margin-left: 15px;
		font-weight: bold;
		font-size: 16px;
	`;

class PostDetails extends Component {
	constructor() {
		super();
		this.state = {
			post: undefined
		};
	}
	componentDidMount() {
		api.getPost( this.props.postId )
			.then( res => this.setState({ post: res.data }))
			.catch( err => console.log( err ));
	}
	render() {
		if ( !this.state.post ) {
			return null;
		}
		return (
			<Wrapper>
				<div>
					<HeaderWrapper>
						<Icon
							name="arrow left"
							onClick={this.props.switchDetails}
						/>
						<HeaderTxt>Post</HeaderTxt>
					</HeaderWrapper>
					{this.state.post.media ?
						<MediaPost
							post={this.state.post}
						/>
						:
						<Post
							post={this.state.post}
						/>
					}
				</div>
			</Wrapper>
		);
	}
}

PostDetails.propTypes = {
	postId: PropTypes.string.isRequired
};

export default PostDetails;
