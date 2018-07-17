import React, { Component } from "react";
import styled from "styled-components";
import { Image, Icon } from "semantic-ui-react";
import PropTypes from "prop-types";
import api from "../services/api";
import refreshToken from "../utils/refreshToken";
import PostDetails from "../containers/PostDetails";
import { setPosts, switchPostDetails } from "../services/actions/posts";
import { connect } from "react-redux";

const
	Wrapper = styled.div`
		height: 100vh;
		width: 100%;
	`,
	HeaderWrapper = styled.div`
		height: 9%;
		display: flex;
		align-items: center;
		padding-left: 10px;
	`,
	BackArrow = styled( Icon )`
		font-size: 1.3rem !important;
		margin: 0 !important;
	`,
	HeaderTxt = styled.span`
		margin-left: 1rem;
		font-weight: bold;
		font-size: 1.25rem;
	`,
	Album = styled.div`
		display: flex;
		flex-wrap: wrap;
		justify-content: start;
    align-content: start;
	`,
	PictureWrapper = styled.div`
		position: relative;
		width: calc(calc(100% / 3) - 2px);
		height: 0;
		padding-bottom: calc(calc(100% / 3) - 2px);
		margin: ${props => props.rightImg ?
		"3px 0" : "3px 3px 3px 0"};
		overflow: hidden;
	`,
	UserPicture = styled( Image )`
		position: absolute !important;
  	width: 100% !important;
		height: 100% !important;
		top: 0 !important;
		left: 0 !important;
	`,
	EmptyPostsAlert = styled.div`
		display: flex;
		background: #fff;
		margin-top: 1rem;
		min-height: 100px;
		align-items: center;
		justify-content: center;
	`;

class UserAlbum extends Component {
	constructor() {
		super();
		this.state = {
			selectedPost: 0
		};
	}

	componentDidMount() {
		this.getAlbum();
	}

	getAlbum = async() => {
		try {
			const album = await api.getUserAlbum( this.props.username );
			if ( album === "jwt expired" ) {
				await refreshToken();
				this.getAlbum();
			} else if ( album.data ) {
				this.props.setPosts( album.data, false, true );
			}
		} catch ( err ) {
			console.log( err );
		}
	}

	displayPostDetails = index => {
		this.setState({
			selectedPost: index
		});
		this.props.switchPostDetails();
	}

	hidePostDetails = () => {
		this.setState({
			selectedPost: 0
		});
		this.props.switchPostDetails();
	}

	render() {
		if ( this.props.displayPostDetails ) {
			return (
				<PostDetails
					post={this.props.posts[ this.state.selectedPost ]}
					switchDetails={this.hidePostDetails}
					socket={this.props.socket}
				/>
			);
		}
		return (
			<Wrapper>
				<HeaderWrapper>
					<BackArrow
						name="arrow left"
						onClick={this.props.toggleTab}
					/>
					<HeaderTxt>@{this.props.username} album</HeaderTxt>
				</HeaderWrapper>
				{this.props.posts.length > 0 ?
					<Album>
						{this.props.posts.map(( post, index ) =>
							<PictureWrapper
								key={index}
								onClick={() => this.displayPostDetails( index )}
								rightImg={( index + 1 ) % 3 === 0}
							>
								<UserPicture
									src={require( "../images/" + post.mediaContent.image )}
								/>
							</PictureWrapper>
						)}
					</Album>
					:
					<EmptyPostsAlert>
						@{this.props.username} hasn't posted pictures yet.
					</EmptyPostsAlert>
				}
			</Wrapper>
		);
	}
}

UserAlbum.propTypes = {
	username: PropTypes.string.isRequired,
	toggleTab: PropTypes.func.isRequired,
	posts: PropTypes.array.isRequired,
	socket: PropTypes.object.isRequired
};

const
	mapStateToProps = state => ({
		posts: state.posts.album,
		displayPostDetails: state.posts.displayPostDetails
	}),

	mapDispatchToProps = dispatch => ({
		setPosts: ( posts, onExplore, onAlbum ) =>
			dispatch( setPosts( posts, onExplore, onAlbum )),
		switchPostDetails: () => dispatch( switchPostDetails())
	});

export default connect( mapStateToProps, mapDispatchToProps )( UserAlbum );
