import React, { Component } from "react";
import styled from "styled-components";
import { Image } from "semantic-ui-react";
import PropTypes from "prop-types";
import api from "../services/api";
import refreshToken from "../utils/refreshToken";
import { setPosts, switchPostDetails } from "../services/actions/posts";
import { connect } from "react-redux";

const
	Wrapper = styled.div`
		height: 100vh;
		width: 100%;
		margin-top: 1rem;
		@media (min-width: 420px) {
			margin-top: 2rem;
			width: 600px;
			padding: 0 5px;
		}
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
		:hover {
			cursor: pointer;
		}
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

	render() {
		return (
			<Wrapper>
				{this.props.posts.length > 0 ?
					<Album>
						{this.props.posts.map(( post, index ) =>
							<PictureWrapper
								key={index}
								onClick={() => this.props.switchPostDetails( index )}
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
		switchPostDetails: index => dispatch( switchPostDetails( index ))
	});

export default connect( mapStateToProps, mapDispatchToProps )( UserAlbum );
