import React, { Component } from "react";
import styled from "styled-components";
import { Input, Image, Divider, Button } from "semantic-ui-react";
import axios from "axios";
import api from "../services/api";

const
	SelectedWrapper = styled.div`
		overflow: hidden;
	`,
	ShareWrapper = styled.div`
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
		api.createMediaPicture( data );
		this.props.history.push( "/" );
	}

	handleBack = () => {
		this.props.history.push( "/" );
	}

	render() {
		return (
			<SelectedWrapper>
				<ShareWrapper>
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
				</ShareWrapper>
				<SelectedMediaBackground
					background={this.state.imagePreviewUrl}
				/>
				<BackButton secondary content="Back" onClick={this.handleBack} />
				<ShareButton primary content="Done" onClick={this.handleSubmit} />
			</SelectedWrapper>
		);
	}
}

export default MediaPicture;
