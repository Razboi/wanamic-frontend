import React, { Component } from "react";
import styled from "styled-components";
import api from "../services/api";
import PostOptions from "./PostOptions";
import SharedPost from "../containers/SharedPost";
import { switchPostDetails, updatePost } from "../services/actions/posts";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import refreshToken from "../utils/refreshToken";
import AlertsFilter from "../components/AlertsFilter";
import PostHeader from "../components/PostHeader";

const
	Wrapper = styled.div`
		overflow: hidden;
		position: relative;
		border-bottom: ${props => props.noBorder ?
		"0" : "1px solid rgba(0, 0, 0, .1)"};
		@media (min-width: 420px) {
			margin-bottom: ${props => !props.noBorder && "1rem"};
			background: #fff;
			border-bottom-left-radius: 2px;
			border-bottom-right-radius: 2px;
		}
	`,
	ContentWrapper = styled.div`
		display: flex;
		flex-direction: column;
		padding: 1.33rem 1rem;
		min-height: 25px;
		font-family: inherit !important;
	`,
	UserContent = styled.p`
		color: #222;
		word-break: break-word;
		font-size: 1rem;
		:hover {
			cursor: pointer;
		}
	`,
	PostBody = styled.div`
		position: relative;
		overflow: hidden;
		min-height: ${props => props.alerts && "215px"};
	`,
	Dimmer = styled.div`
		background: ${props => props.blurFilter && "rgba( 0, 0, 0, 0.8 )"};
		min-height: ${props => props.blurFilter && "215px"};
		filter: ${props => props.blurFilter ?
		"blur(25px)" : "blur(0px)"};
		transform: scale(${props => props.blurFilter ? "1.3" : "1"});
	`;


class Post extends Component {
	constructor() {
		super();
		this.state = {
			likedBy: [],
			nsfw: false,
			spoiler: false,
			spoilerDescription: "",
			id: ""
		};
	}

	static getDerivedStateFromProps( props, state ) {
		const { post } = props;
		if ( post._id === state.id ) {
			return null;
		}
		return {
			likedBy: post.likedBy,
			nsfw: post.alerts.nsfw,
			spoiler: post.alerts.spoiler,
			spoilerDescription: post.alerts.spoilerDescription,
			updatedContent: post.content,
			id: post._id
		};
	}

	handleChange = e => {
		this.setState({ [ e.target.name ]: e.target.value });
	}

	handleLike = retry => {
		const { post } = this.props;
		if ( !retry ) {
			let updatedPost = post;
			updatedPost.likedBy = [
				localStorage.getItem( "username" ), ...updatedPost.likedBy ];
			this.props.updatePost( updatedPost );
		}

		api.likePost( post._id )
			.then( res => {
				if ( res === "jwt expired" ) {
					refreshToken()
						.then(() => this.handleLike( true ))
						.catch( err => console.log( err ));
				} else {
					this.props.socket.emit( "sendNotification", res.data );
				}
			}).catch( err => 	console.log( err ));
	}

	handleDislike = retry => {
		const { post } = this.props;
		if ( !retry ) {
			let updatedPost = post;
			const index = post.likedBy.indexOf( localStorage.getItem( "username" ));
			updatedPost.likedBy.splice( index, 1 );
			this.props.updatePost( updatedPost );
		}

		api.dislikePost( this.props.post._id )
			.then( res => {
				if ( res === "jwt expired" ) {
					refreshToken()
						.then(() => this.handleDislike( true ))
						.catch( err => console.log( err ));
				}
			}).catch( err => console.log( err ));
	}

	handleFilter = type => {
		this.setState({ [ type ]: false });
	}

	displayPostDetails = () => {
		this.props.switchPostDetails( this.props.post );
	}

	render() {
		let userPicture;
		const
			s3Bucket = "https://d3dlhr4nnvikjb.cloudfront.net/",
			{ post } = this.props;
		try {
			if ( post.author.profileImage ) {
				process.env.REACT_APP_STAGE === "dev" ?
					userPicture = require( "../images/" + post.author.profileImage )
					:
					userPicture = s3Bucket + post.author.profileImage;
			} else {
				userPicture = require( "../images/defaultUser.png" );
			}
		} catch ( err ) {
			console.log( err );
		}
		return (
			<Wrapper
				noBorder={this.props.fakeOptions || this.props.details
					? 1 : 0}
			>
				<PostHeader
					post={post}
					userPicture={userPicture}
					fakeOptions={this.props.fakeOptions}
					socket={this.props.socket}
				/>

				<PostBody alerts={this.state.nsfw || this.state.spoiler}>
					<AlertsFilter
						handleFilter={this.handleFilter}
						nsfw={this.state.nsfw}
						spoiler={this.state.spoiler}
						spoilerDescription={this.state.spoilerDescription}
					/>
					<Dimmer blurFilter={this.state.nsfw || this.state.spoiler}>
						<ContentWrapper>
							<UserContent onClick={this.displayPostDetails}>
								{post.content}
							</UserContent>
							{post.sharedPost &&
								<SharedPost
									post={post.sharedPost}
									history={this.props.history}
								/>}
						</ContentWrapper>

						{ !this.props.fakeOptions &&
							<PostOptions
								post={this.props.post}
								fakeOptions={this.props.fakeOptions}
								handleLike={this.handleLike}
								handleDislike={this.handleDislike}
								id={post._id}
							/>
						}
					</Dimmer>
				</PostBody>
			</Wrapper>
		);
	}
}

Post.propTypes = {
	index: PropTypes.number,
	post: PropTypes.object.isRequired,
	socket: PropTypes.object,
	history: PropTypes.object
};

const
	mapStateToProps = state => ({
	}),

	mapDispatchToProps = dispatch => ({
		switchPostDetails: post => dispatch( switchPostDetails( post )),
		updatePost: post => dispatch( updatePost( post ))
	});

export default connect( mapStateToProps, mapDispatchToProps )( Post );
