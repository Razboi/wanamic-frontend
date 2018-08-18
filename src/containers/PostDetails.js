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
		position: absolute;
		z-index: 20;
		overflow-y: auto;
		@media (max-width: 760px) {
			background: #fff;
			height: 100%;
		}
		@media (min-width: 760px) {
			width: 600px;
			max-height: 90%;
			::-webkit-scrollbar {
				display: block !important;
				width: 10px !important;
				background: #fff;
			}
		}
	`,
	HeaderWrapper = styled.div`
		height: 59.33px;
		display: flex;
		align-items: center;
		padding: 0 10px;
		justify-content: space-between;
		@media (min-width: 600px) {
			box-shadow: 0 1px 2px #555;
			height: 49.33px;
			background: #efefef;
			border-top-left-radius: 2px;
			border-top-right-radius: 2px;
		}
	`,
	StyledIcon = styled( Icon )`
		font-size: 1.4rem !important;
		:hover {
			cursor: pointer;
		}
	`,
	ItunesImage = styled( Image )`
		height: 30px;
	`,
	NullPostWarning = styled.div`
		z-index: 20;
		position: absolute;
		background: #fff;
		width: 300px;
		height: 200px;
		border-radius: 2px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1rem;
		font-weight: 600;
	`;

var previousHref;

class PostDetails extends Component {
	constructor() {
		super();
		this.state = {
			post: {},
			displayComments: false
		};
	}

	componentDidMount() {
		document.body.style.overflowY = "hidden";
		previousHref = window.location.href;
		window.history.pushState( null, null, "/post" );
		window.onpopstate = () => this.handlePopstate();
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
		document.body.style.overflowY = "auto";
		window.history.pushState( null, null, previousHref );
		window.onpopstate = () => {};
	}

	handlePopstate = () => {
		if ( this.props.displayPostDetails ) {
			this.props.switchDetails();
		}
	}

	getPost = async() => {
		var post;
		try {
			post = await api.getPost( this.props.postId );
		} catch ( err ) {
			console.log( err );
		}
		this.setState({ post: post.data });
	}

	handleBack = () => {
		this.props.switchDetails();
	}

	goToProfile = async user => {
		if ( this.props.history ) {
			await this.handleBack();
			this.props.history.push( "/" + user.username );
		}
	}

	render() {
		const { post } = this.state;
		if ( this.props.displayComments ) {
			return <Comments
				onExplore={this.props.onExplore}
				socket={this.props.socket}
			/>;
		}
		if ( this.props.displayShare ) {
			return <Share socket={this.props.socket} />;
		}
		// empty obj
		if ( Object.keys( post ).length === 0 && post.constructor === Object ) {
			return null;
		}
		if ( !post ) {
			return (
				<NullPostWarning>
					<span>This post doesn't exist</span>
				</NullPostWarning>
			);
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
						goToProfile={() => this.goToProfile( post.author )}
						details
					/>
					:
					<Post
						socket={this.props.socket}
						post={post}
						index={this.props.index}
						goToProfile={() => this.goToProfile( post.author )}
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
	history: PropTypes.object.isRequired,
	displayComments: PropTypes.bool.isRequired,
	index: PropTypes.number
};

const
	mapStateToProps = state => ({
		displayComments: state.posts.displayComments,
		displayShare: state.posts.displayShare,
		displayPostDetails: state.posts.displayPostDetails
	});

export default connect( mapStateToProps )( PostDetails );
