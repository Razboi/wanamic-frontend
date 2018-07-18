import React, { Component } from "react";
import Post from "../containers/Post";
import { Icon, Image } from "semantic-ui-react";
import MediaPost from "../containers/MediaPost";
import styled from "styled-components";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import api from "../services/api";
import Comments from "../containers/Comments";

const
	Wrapper = styled.div`
		height: 100vh;
		width: 100%;
		position: absolute;
		z-index: 4;
		background: #fff;
	`,
	HeaderWrapper = styled.div`
		height: 59.33px;
		display: flex;
		align-items: center;
		padding: 0 10px;
		justify-content: space-between;
	`,
	StyledIcon = styled( Icon )`
		font-size: 1.4rem !important;
	`,
	ItunesImage = styled( Image )`
		height: 30px;
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
				<HeaderWrapper>
					<StyledIcon
						name="arrow left"
						onClick={this.props.switchDetails}
					/>
					{this.state.post.mediaContent.url &&
						<a href={this.state.post.mediaContent.url} target="_blank">
							<ItunesImage src={require( "../images/itunes.svg" )} />
						</a>
					}
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
