import React, { Component } from "react";
import styled from "styled-components";
import { Image, Icon } from "semantic-ui-react";
import PropTypes from "prop-types";
import api from "../services/api";
import refreshToken from "../utils/refreshToken";

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
		border-bottom: 1px solid rgba(0, 0, 0, .5);
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
		justify-content: space-evenly;
    align-content: start;
		padding: 0.1rem;
	`,
	PictureWrapper = styled.div`
		flex-basis: calc(calc(100% / 3) - 0.2rem);;
		margin: 0.1rem;
	`,
	UserPicture = styled( Image )`
  	width: 100%;
		height: 100%;
	`;

class UserAlbum extends Component {
	constructor() {
		super();
		this.state = {
			album: []
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
				this.setState({ album: album.data });
			}
		} catch ( err ) {
			console.log( err );
		}
	}
	render() {
		return (
			<Wrapper>
				<HeaderWrapper>
					<BackArrow
						name="arrow left"
						onClick={this.props.toggleTab}
					/>
					<HeaderTxt>@{this.props.username} album</HeaderTxt>
				</HeaderWrapper>
				<Album>
					{this.state.album.map(( pic, index ) =>
						<PictureWrapper key={index}>
							<UserPicture src={require( "../images/" + pic )} />
						</PictureWrapper>
					)}
				</Album>
			</Wrapper>
		);
	}
}

UserAlbum.propTypes = {
	username: PropTypes.string.isRequired,
	toggleTab: PropTypes.func.isRequired
};

export default UserAlbum;
