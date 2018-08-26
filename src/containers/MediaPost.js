import React, { Component } from "react";
import styled from "styled-components";
import { Header, Image } from "semantic-ui-react";
import moment from "moment";
import PostOptions from "./PostOptions";
import api from "../services/api";
import DropdownOptions from "../components/DropdownOptions";
import PropTypes from "prop-types";
import { switchPostDetails } from "../services/actions/posts";
import { connect } from "react-redux";
import AlertsFilter from "../components/AlertsFilter";
import LinkPreview from "../components/LinkPreview";
import refreshToken from "../utils/refreshToken";

const
	Wrapper = styled.div`
		overflow: hidden;
		display: grid;
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
		font-size: 1rem !important;
		color: rgba(0,0,0,0.45) !important;
	`,
	MediaTitle = styled.h4`
		font-family: inherit !important;
	`,
	MediaImage = styled( Image )`
		margin: 0 auto;
		max-height: 1100px !important;
		max-width: 100% !important;
	`,
	PostMediaContent = styled.div`
		display: grid;
		position: relative;
		overflow: hidden;
		text-align: center;
		width: 100%;
		height: 100%;
		color: #fff;
		:hover {
			cursor: pointer;
		}
	`,
	PostMediaBackground = styled.div`
		z-index: -1;
		width: 100%;
		height: 100%;
		position: absolute;
		background-size: cover;
		background-image: url(${props => props.background});
		filter: blur(17px) brightness(90%);
		transform: scale(1.066);
	`,
	PostUserContent = styled.div`
		padding: 1rem 1rem 2rem 1rem;
	`,
	UserContent = styled.p`
		color: #222;
		word-break: break-word;
		font-size: 1rem;
	`,
	Description = styled.span`
		font-weight: bold;
		font-size: 1rem;
		word-break: break-all;
	`,
	PostBody = styled.div`
		position: relative;
		overflow: hidden;
		min-height: ${props => props.alerts && "250px"};
		font-family: inherit !important;
	`,
	Dimmer = styled.div`
		min-height: ${props => props.blurFilter && "250px"};
		filter: ${props => props.blurFilter ?
		"blur(15px) brightness(50%)" : "blur(0px)"};
		transform: scale(${props => props.blurFilter ? "1.05" : "1"});
	`;

var
	mediaPicture,
	userPicture;

class MediaPost extends Component {
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

		api.dislikePost( post._id )
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

	hidePostDetails = () => {
		this.setState({
			selectedPost: 0
		});
		this.props.switchPostDetails();
	}

	render() {
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

			if ( post.picture ) {
				process.env.REACT_APP_STAGE === "dev" ?
					mediaPicture = require( "../images/" + post.mediaContent.image )
					:
					mediaPicture = s3Bucket + post.mediaContent.image;
			}
		} catch ( err ) {
			console.log( err );
		}

		return (
			<Wrapper
				onShare={this.props.onShare}
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
						{post.link ?
							<LinkPreview
								linkContent={post.linkContent}
								details={this.props.details}
							/>
							:
							<PostMediaContent onClick={this.displayPostDetails}>
								<PostMediaBackground background={
									post.picture ?
										mediaPicture : post.mediaContent.image
								}
								/>
								{post.picture ?
									<MediaImage src={mediaPicture} className="mediaPicture" />
									:
									<React.Fragment>
										<MediaTitle>{post.mediaContent.title}</MediaTitle>
										<MediaImage
											src={post.mediaContent.image}
											className="mediaArtwork"
										/>
									</React.Fragment>
								}
							</PostMediaContent>
						}

						{ !this.props.fakeOptions &&
							<PostOptions
								post={this.props.post}
								fakeOptions={this.props.fakeOptions}
								handleLike={this.handleLike}
								handleDislike={this.handleDislike}
								numComments={post.comments.length}
								numShared={post.sharedBy.length}
								id={post._id}
							/>
						}

						{post.content &&
							<PostUserContent>
								<UserContent className="postContent">
									<Description>@{post.author.username} </Description>
									{post.content}
								</UserContent>
							</PostUserContent>
						}
					</Dimmer>
				</PostBody>
			</Wrapper>
		);
	}
}

MediaPost.propTypes = {
	index: PropTypes.number,
	post: PropTypes.object.isRequired,
	socket: PropTypes.object,
	history: PropTypes.object,
	newsFeed: PropTypes.bool,
	details: PropTypes.bool
};

const
	mapStateToProps = state => ({
	}),

	mapDispatchToProps = dispatch => ({
		switchPostDetails: post => dispatch( switchPostDetails( post ))
	});

export default connect( mapStateToProps, mapDispatchToProps )( MediaPost );
