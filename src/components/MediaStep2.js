import React, { Component } from "react";
import { Button, Input, Image } from "semantic-ui-react";
import PropTypes from "prop-types";
import styled from "styled-components";

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


class MediaStep2 extends Component {
	handleKeyPress = e => {
		if ( e.key === "Enter" ) {
			this.props.prevStep();
		}
	}

	render() {
		return (
			<SelectedWrapper>
				<ShareWrapper>
					<ContentInputWrapper>
						<UserContentInput
							name="userInput"
							value={this.props.userInput}
							placeholder="Share your opinion..."
							onChange={this.props.handleChange}
							onKeyPress={this.handleKeyPress}
						/>
					</ContentInputWrapper>
					<SelectedMediaImgWrapper>
						{this.props.mediaData && this.props.mediaData.image ?
							<SelectedMediaImg src={this.props.mediaData.image} />
							:
							<SelectedMediaImg
								src={this.props.DefaultCover}
							/>
						}
					</SelectedMediaImgWrapper>
				</ShareWrapper>
				{this.props.mediaData && this.props.mediaData.image ?
					<SelectedMediaBackground background={this.props.mediaData.image} />
					:
					<SelectedMediaBackground
						background={this.props.DefaultCover}
					/>
				}
				<BackButton secondary content="Back" onClick={this.props.prevStep} />
				<ShareButton primary content="Next" onClick={this.props.nextStep} />
			</SelectedWrapper>
		);
	}
}

MediaStep2.propTypes = {
	handleChange: PropTypes.func.isRequired,
	prevStep: PropTypes.func.isRequired,
	nextStep: PropTypes.func.isRequired,
	mediaData: PropTypes.object.isRequired,
	userInput: PropTypes.string.isRequired,
	DefaultCover: PropTypes.string.isRequired
};

export default MediaStep2;
