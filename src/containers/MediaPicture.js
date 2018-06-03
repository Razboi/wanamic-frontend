import React, { Component } from "react";
import styled from "styled-components";
import { Input, Image, Button } from "semantic-ui-react";
import api from "../services/api";
import PropTypes from "prop-types";
import refreshToken from "../utils/refreshToken";

const
	SelectedWrapper = styled.div`
		overflow: hidden;
	`,
	SharePictureForm = styled.div`
		position: absolute;
		height: 100vh;
		width: 100%;
		display: grid;
		grid-template-columns: 100%;
		grid-template-rows: 35% 65%;
		grid-template-areas:
			"inp"
			"img"
	`,
	ContentInputWrapper = styled.div`
		grid-area: inp;
		display: grid;
		padding-bottom: 40px;
	`,
	UserContentInput = styled( Input )`
		width: 80%;
		justify-self: center;
		align-self: end;
		z-index: 2;
	`,
	SelectedMediaImgWrapper = styled.div`
		grid-area: img;
		display: grid;
	`,
	SelectedMediaBackground = styled.div`
		height: 100vh;
		background-image: url(${props => props.background});
		background-size: cover;
		filter: blur(20px) brightness(50%);
		transform: scale(1.2);
	`,
	SelectedMediaImg = styled( Image )`
		width: 128px;
		height: 194px;
		justify-self: center;
		align-self: start;
		z-index: 2;
	`,
	BackButton = styled( Button )`
		position: absolute;
		bottom: 5px;
		left: 5px;
	`,
	ShareButton = styled( Button )`
		position: absolute;
		bottom: 5px;
		right: 5px;
	`;


class MediaPicture extends Component {
	constructor() {
		super();
		this.state = {
			userInput: "",
			imageFile: null,
			imagePreviewUrl: ""
		};
	}

	static getDerivedStateFromProps( nextProps, prevState ) {
		if ( nextProps.location.state.file ) {
			return {
				imageFile: nextProps.location.state.file,
				imagePreviewUrl: URL.createObjectURL( nextProps.location.state.file )
			};
		}
	}

	handleChange = e => {
		this.setState({ [ e.target.name ]: e.target.value });
	}

	handleSubmit = () => {
		var data = new FormData();
		data.append( "picture", this.state.imageFile );
		data.append( "content", this.state.userInput );
		data.append( "token", localStorage.getItem( "token" ));
		api.createMediaPicture( data )
			.then( res => {
				if ( res === "jwt expired" ) {
					refreshToken()
						.then(() => this.handleSubmit())
						.catch( err => console.log( err ));
				} else {
					this.props.history.push( "/" );
				}
			}).catch( err => console.log( err ));
	}

	handleBack = () => {
		this.props.history.push( "/" );
	}

	render() {
		return (
			<SelectedWrapper>
				<SharePictureForm className="sharePictureForm">
					<ContentInputWrapper>
						<UserContentInput
							name="userInput"
							value={this.state.userInput}
							placeholder="Say something..."
							onChange={this.handleChange}
						/>
					</ContentInputWrapper>
					<SelectedMediaImgWrapper>
						<SelectedMediaImg src={this.state.imagePreviewUrl} />
					</SelectedMediaImgWrapper>
				</SharePictureForm>

				<SelectedMediaBackground
					background={this.state.imagePreviewUrl}
				/>
				<BackButton secondary content="Back" onClick={this.handleBack} />
				<ShareButton primary content="Done" onClick={this.handleSubmit} />
			</SelectedWrapper>
		);
	}
}

MediaPicture.propTypes = {
	location: PropTypes.shape({
		state: PropTypes.shape({
			file: PropTypes.object.isRequired
		}).isRequired
	}).isRequired,
	history: PropTypes.shape({
		push: PropTypes.func.isRequired
	}).isRequired,
};

export default MediaPicture;
