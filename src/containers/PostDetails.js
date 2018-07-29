import React, { Component } from "react";
import Post from "../containers/Post";
import { Icon, Image } from "semantic-ui-react";
import MediaPost from "../containers/MediaPost";
import styled from "styled-components";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import api from "../services/api";
import Comments from "../containers/Comments";
import Share from "../containers/Share";

const
	Wrapper = styled.div`
		width: 100%;
		position: fixed;
		z-index: 20;
		@media (max-width: 420px) {
			background: #fff;
			height: 100vh;
		}
		@media (min-width: 420px) {
			width: 600px;
			max-height: 90%;
			overflow-y: scroll;
		}
	`,
	HeaderWrapper = styled.div`
		height: 59.33px;
		display: flex;
		align-items: center;
		padding: 0 10px;
		justify-content: space-between;
		@media (min-width: 420px) {
			box-shadow: 0 1px 2px #555;
			height: 49.33px;
			background: #efefef;
		}
	`,
	StyledIcon = styled( Icon )`
		font-size: 1.4rem !important;
	`,
	ItunesImage = styled( Image )`
		height: 30px;
	`;

var previousHref;

class PostDetails extends Component {
	constructor() {
		super();
		this.state = {
			post: undefined,
			displayComments: false
		};
	}

	componentDidMount() {
		previousHref = window.location.href;
		window.history.pushState( null, null, "/post" );
		window.onpopstate = () => this.props.switchDetails();
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

	componentWillUnmount() {
		window.history.pushState( null, null, previousHref );
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

	handleBack = () => {
		this.props.switchDetails();
	}

	render() {
		const { post } = this.state;
		if ( !post ) {
			return null;
		}
		if ( this.props.displayComments ) {
			return <Comments
				onExplore={this.props.onExplore}
				socket={this.props.socket}
			/>;
		}
		if ( this.props.displayShare ) {
			return <Share />;
		}
		return (
			<Wrapper>
				<HeaderWrapper>
					<StyledIcon
						name="arrow left"
						onClick={this.handleBack}
					/>
					{post.mediaContent && post.mediaContent.url &&
						<a href={post.mediaContent.url} target="_blank">
							<ItunesImage src={require( "../images/itunes.svg" )} />
						</a>
					}
				</HeaderWrapper>
				{post.media ?
					<MediaPost
						socket={this.props.socket}
						post={post}
						index={this.props.index}
						details
					/>
					:
					<Post
						socket={this.props.socket}
						post={post}
						index={this.props.index}
						details
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
	displayComments: PropTypes.bool.isRequired,
	index: PropTypes.number.isRequired
};

const
	mapStateToProps = state => ({
		displayComments: state.posts.displayComments,
		displayShare: state.posts.displayShare
	});

export default connect( mapStateToProps )( PostDetails );
