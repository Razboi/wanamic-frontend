import React, { Component } from "react";
import styled from "styled-components";
import { Header, Image } from "semantic-ui-react";
import api from "../services/api";
import moment from "moment";
import PostOptions from "./PostOptions";
import SharedPost from "../containers/SharedPost";
import DropdownOptions from "../components/DropdownOptions";
import PropTypes from "prop-types";
import { deletePost, updatePost } from "../services/actions/posts";
import { connect } from "react-redux";
import refreshToken from "../utils/refreshToken";
import AlertsFilter from "../components/AlertsFilter";

const
	Wrapper = styled.div`
		position: relative;
		border-bottom: 1px solid rgba(0, 0, 0, .1);
	`,
	PostHeader = styled( Header )`
		height: 60px;
		display: flex;
		flex-direction: row;
		padding: 0 1rem !important;
		margin: 0 !important;
		align-items: center !important;
	`,
	HeaderInfo = styled.div`
		display: flex;
		flex-direction: column;
		margin-left: 0.5rem;
	`,
	AuthorImg = styled( Image )`
		width: 30px !important;
		height: 30px !important;
	`,
	StyledOptions = {
		position: "absolute",
		right: "1rem",
		top: "1rem",
	},
	AuthorFullname = styled.span`
		font-size: 1.2rem !important;
		color: hsl(0,0%,13%) !important;
	`,
	AuthorUsername = styled.span`
		font-size: 1rem;
		color: rgba(0,0,0,0.65);
		font-weight: normal;
		margin-left: 0.25rem;
	`,
	DateTime = styled( Header.Subheader )`
		color: rgba(0,0,0,0.45) !important;
		font-size: 1rem !important;
	`,
	ContentWrapper = styled.div`
		display: flex;
		padding: 0px 1rem;
		min-height: 25px;
	`,
	UserContent = styled.p`
		align-self: center;
		word-break: break-all;
	`,
	PostBody = styled.div`
		position: relative;
		overflow: hidden;
	`,
	Dimmer = styled.div`
		background: ${props => props.blurFilter && "rgba( 0, 0, 0, 0.8 )"};
		filter: ${props => props.blurFilter ?
		"blur(25px)" : "blur(0px)"};
		transform: scale(${props => props.blurFilter ? "1.3" : "1"});
	`;

var userPicture;

class Post extends Component {
	constructor() {
		super();
		this.state = {
			likedBy: [],
			nsfw: false,
			spoiler: false,
			updatedContent: "",
			id: ""
		};
	}

	static getDerivedStateFromProps( props, state ) {
		const { post } = props;
		if ( post._id === state.id ) {
			return null;
		}
		if ( post.sharedPost ) {
			return {
				likedBy: post.likedBy,
				nsfw: post.sharedPost.alerts.nsfw,
				spoiler: post.sharedPost.alerts.spoiler,
				updatedContent: post.content,
				id: post._id
			};
		} else {
			return {
				likedBy: post.likedBy,
				nsfw: post.alerts.nsfw,
				spoiler: post.alerts.spoiler,
				updatedContent: post.content,
				id: post._id
			};
		}
	}

	handleChange = e => {
		this.setState({ [ e.target.name ]: e.target.value });
	}

	handleDelete = () => {
		api.deletePost( this.props.post._id )
			.then( res => {
				if ( res.data.updatedOriginalPost ) {
					this.props.updatePost( res.data.updatedOriginalPost );
				}
				this.props.deletePost( this.props.index );
			}).catch( err => console.log( err ));
	};

	handleUpdate = () => {
		if ( this.state.content !== this.state.updatedContent
			&& this.state.updatedContent !== "" ) {
			api.updatePost( this.props.post._id, this.state.updatedContent )
				.then( res => this.props.updatePost( res.data ))
				.catch( err => console.log( err ));
		}
	};

	handleLike = retry => {
		if ( !retry ) {
			this.setState({
				likedBy: [ ...this.state.likedBy, localStorage.getItem( "username" ) ]
			});
		}

		api.likePost( this.props.post._id )
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
		var	newLikedBy;
		if ( !retry ) {
			newLikedBy = this.state.likedBy;
			const index = this.state.likedBy.indexOf( localStorage.getItem( "username" ));
			newLikedBy.splice( index, 1 );
			this.setState({ likedBy: newLikedBy });
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

	render() {
		const { post } = this.props;
		try {
			if ( post.author.profileImage ) {
				userPicture = require( "../images/" + post.author.profileImage );
			} else {
				userPicture = require( "../images/defaultUser.png" );
			}
		} catch ( err ) {
			console.log( err );
		}
		return (
			<Wrapper>
				<PostHeader>
					<AuthorImg
						circular
						src={userPicture}
						onClick={this.props.goToProfile}
					/>
					<HeaderInfo onClick={this.props.goToProfile}>
						<AuthorFullname className="postAuthor">
							{post.author.fullname}
							<AuthorUsername>
								@{post.author.username}
							</AuthorUsername>
						</AuthorFullname>
						<DateTime className="postDate">
							{moment( post.createdAt ).fromNow()}
						</DateTime>
					</HeaderInfo>

					{ !this.props.fakeOptions &&
						<DropdownOptions
							style={StyledOptions}
							author={post.author.username}
							updatedContent={this.state.updatedContent}
							handleUpdate={this.handleUpdate}
							handleDelete={this.handleDelete}
							handleChange={this.handleChange}
						/>
					}
				</PostHeader>

				<PostBody>
					<AlertsFilter
						handleFilter={this.handleFilter}
						nsfw={this.state.nsfw}
						spoiler={this.state.spoiler}
					/>
					<Dimmer blurFilter={this.state.nsfw || this.state.spoiler}>
						<ContentWrapper>
							<UserContent className="postContent">
								{post.content}
							</UserContent>
							{post.sharedPost &&
								<SharedPost post={post.sharedPost} />}
						</ContentWrapper>

						{ !this.props.fakeOptions &&
							<PostOptions
								fakeOptions={this.props.fakeOptions}
								handleLike={this.handleLike}
								handleDislike={this.handleDislike}
								numLiked={this.state.likedBy.length}
								numComments={post.comments.length}
								numShared={post.sharedBy.length}
								id={post._id}
								index={this.props.index}
								liked={
									this.state.likedBy.includes( localStorage.getItem( "username" ))
								}
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
	socket: PropTypes.object.isRequired,
	goToProfile: PropTypes.func.isRequired
};

const
	mapStateToProps = state => ({
	}),

	mapDispatchToProps = dispatch => ({
		deletePost: postIndex => dispatch( deletePost( postIndex )),
		updatePost: post => dispatch( updatePost( post ))
	});

export default connect( mapStateToProps, mapDispatchToProps )( Post );
