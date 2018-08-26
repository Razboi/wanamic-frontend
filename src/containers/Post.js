import React, { Component } from "react";
import styled from "styled-components";
import { Header, Image } from "semantic-ui-react";
import api from "../services/api";
import moment from "moment";
import PostOptions from "./PostOptions";
import SharedPost from "../containers/SharedPost";
import DropdownOptions from "../components/DropdownOptions";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import refreshToken from "../utils/refreshToken";
import AlertsFilter from "../components/AlertsFilter";

const
	Wrapper = styled.div`
		overflow: hidden;
		position: relative;
		@media (min-width: 420px) {
			border: 1px solid rgba(0, 0, 0, .1);
			margin-bottom: 1rem;
			background: #fff;
		}
		@media (max-width: 420px) {
			border-bottom: ${props => props.noBorder ?
		"0" : "1px solid rgba(0, 0, 0, .1)"};
		}
	`,
	PostHeader = styled( Header )`
		min-height: 60px;
		display: flex;
		flex-direction: row;
		padding: 1rem !important;
		margin: 0 !important;
		align-items: center !important;
		font-family: inherit !important;
	`,
	HeaderInfo = styled.div`
		display: flex;
		flex-direction: column;
		margin: 0 2rem 0 0.5rem;
		:hover {
			cursor: pointer;
		}
	`,
	AuthorImg = styled( Image )`
		overflow: visible !important;
		width: 40px !important;
		height: 40px !important;
		margin: 0 !important;
		:hover {
			cursor: pointer;
		}
	`,
	StyledOptions = {
		position: "absolute",
		right: "1rem",
		top: "1rem",
	},
	AuthorFullname = styled.span`
		font-size: 1.05rem !important;
		color: #111 !important;
		word-break: break-word !important;
		:hover {
			cursor: pointer;
		}
	`,
	AuthorUsername = styled.span`
		font-size: 1rem;
		color: rgba(0,0,0,0.65);
		font-weight: normal;
		margin-left: 0.25rem;
		word-break: break-word !important;
	`,
	DateTime = styled( Header.Subheader )`
		color: rgba(0,0,0,0.45) !important;
		font-size: 1rem !important;
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

	goToProfile = user => {
		if ( this.props.history ) {
			this.props.history.push( "/" + user.username );
		}
	}

	handleLike = retry => {
		if ( !retry ) {
			this.setState({
				likedBy: [
					...this.state.likedBy,
					localStorage.getItem( "username" )
				]
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
				<PostHeader>
					<AuthorImg
						circular
						src={userPicture}
						onClick={() => this.goToProfile( post.author )}
					/>
					<HeaderInfo onClick={() => this.goToProfile( post.author )}>
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
							postOrComment={post}
							socket={this.props.socket}
						/>
					}
				</PostHeader>

				<PostBody alerts={this.state.nsfw || this.state.spoiler}>
					<AlertsFilter
						handleFilter={this.handleFilter}
						nsfw={this.state.nsfw}
						spoiler={this.state.spoiler}
						spoilerDescription={this.state.spoilerDescription}
					/>
					<Dimmer blurFilter={this.state.nsfw || this.state.spoiler}>
						<ContentWrapper>
							<UserContent className="postContent">
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
								numLiked={this.state.likedBy.length}
								numComments={post.comments.length}
								numShared={post.sharedBy.length}
								id={post._id}
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
	socket: PropTypes.object,
	history: PropTypes.object,
};

const
	mapStateToProps = state => ({
	});

export default connect( mapStateToProps )( Post );
