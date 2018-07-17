import React, { Component } from "react";
import Post from "../containers/Post";
import { Icon } from "semantic-ui-react";
import MediaPost from "../containers/MediaPost";
import styled from "styled-components";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import api from "../services/api";
import Comments from "./Comments";

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
			post: undefined,
			displayComments: false
		};
	}
	componentDidMount() {
		if ( !this.props.post ) {
			this.getPost();
		} else {
			this.setState({ post: this.props.post });
		}
	}

	componentDidUpdate( prevProps ) {
		if ( prevProps.post !== this.props.post ) {
			this.setState({ post: this.props.post });
		}
	}

	getPost = async() => {
		var posts;
		try {
			posts = await api.getPost( this.props.postId );
		} catch ( err ) {
			console.log( err );
		}
		this.setState({ post: posts.data });
	}
	render() {
		if ( !this.state.post ) {
			return null;
		}
		if ( this.props.displayComments ) {
			return <Comments
				onExplore={this.props.onExplore}
				socket={this.props.socket}
			/>;
		}
		return (
			<Wrapper>
				<div>
					<HeaderWrapper>
						<Icon
							name="arrow left"
							onClick={this.props.switchDetails}
						/>
						<HeaderTxt>Post details</HeaderTxt>
					</HeaderWrapper>
					{this.state.post.media ?
						<MediaPost
							socket={this.props.socket}
							post={this.state.post}
						/>
						:
						<Post
							socket={this.props.socket}
							post={this.state.post}
						/>
					}
				</div>
			</Wrapper>
		);
	}
}

PostDetails.propTypes = {
	postId: PropTypes.string,
	post: PropTypes.object,
	socket: PropTypes.object.isRequired,
	displayComments: PropTypes.bool.isRequired
};

const
	mapStateToProps = state => ({
		displayComments: state.posts.displayComments
	});

export default connect( mapStateToProps )( PostDetails );
