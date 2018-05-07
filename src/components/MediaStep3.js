import React, { Component } from "react";
import { Button, Checkbox } from "semantic-ui-react";
import PropTypes from "prop-types";
import styled from "styled-components";

const
	ShareOptionsWrapper = styled.div`
		height: 100%;
		width: 100%;
		position: absolute;
		z-index: 2;
		display: grid;
		grid-template-columns: 100%;
		grid-template-rows: 40% 60%;
		grid-template-areas:
			"so"
			"al"
	`,
	ShareOptions = styled.div`
		grid-area: so;
		padding: 10px;
		color: #fff !important;
		display: flex;
		flex-direction: column;
	`,
	AlertsWrapper = styled.div`
		grid-area: al;
		color: #fff !important;
		justify-self: center;
	`,
	Alerts = styled.div`
		display: flex;
		flex-direction: column;
		text-align: center;
	`,
	AlertCheck = styled.span`
		display: flex;
		margin-top: 10px;
	`,
	AlertLabel = styled.b`
		margin-left: 10px;
		font-size: 16px;
	`,
	PrivacySlider = styled.div`
		background: ${props => props.range === 2 &&
			"linear-gradient(to right, #134f7c 50%, rgba(0,0,0,0.75) 50%) !important" };
		background: ${props => props.range === 3 && "#134f7c !important"};
		background: rgba(0,0,0,0.75);
		border-radius: 25px;
		width: 70%;
		align-self: center;
		display: flex;
		justify-content: space-between;
	`,
	PrivacyButton = styled( Button )`
		margin: 0px !important;
	`,
	SliderHeader = styled.h4`
		text-align: center;
		align-self: center;
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
	`,
	SelectedMediaBackground = styled.div`
		height: 100vh;
		background-image: url(${props => props.background});
		background-size: cover;
		filter: blur(20px) brightness(50%);
		transform: scale(1.2);
	`;


class MediaStep3 extends Component {
	render() {
		return (
			<div>
				<ShareOptionsWrapper>
					<ShareOptions>
						<h3>Share with</h3>
						<SliderHeader>
							{this.props.privacyRange === 1 && "Friends"}
							{this.props.privacyRange === 2 && "Friends and Followers"}
							{this.props.privacyRange === 3 &&
								"Everybody (will be included in the explore page)"}
						</SliderHeader>
						<PrivacySlider range={this.props.privacyRange}>
							<PrivacyButton
								primary
								circular
								icon="users"
								size="huge"
								onClick={() => this.props.setPrivacyRange( 1 )}
							/>
							<PrivacyButton
								primary={this.props.privacyRange >= 2 && true}
								circular
								icon="binoculars"
								size="huge"
								onClick={() => this.props.setPrivacyRange( 2 )}
							/>
							<PrivacyButton
								primary={this.props.privacyRange === 3 && true}
								circular
								icon="globe"
								size="huge"
								onClick={() => this.props.setPrivacyRange( 3 )}
							/>
						</PrivacySlider>
					</ShareOptions>
					<AlertsWrapper>
						<h4>Alerts</h4>
						<Alerts>
							<AlertCheck>
								<Checkbox name="checkNsfw" onChange={this.props.handleCheck}/>
								<AlertLabel>+18</AlertLabel>
							</AlertCheck>
							<AlertCheck>
								<Checkbox name="checkSpoiler" onChange={this.props.handleCheck}/>
								<AlertLabel>Spoiler</AlertLabel>
							</AlertCheck>
						</Alerts>
					</AlertsWrapper>
					<BackButton secondary content="Back" onClick={this.props.prevStep} />
					<ShareButton primary content="Done" onClick={this.props.handleSubmit} />
				</ShareOptionsWrapper>
				{this.props.mediaData && this.props.mediaData.image ?
					<SelectedMediaBackground background={this.props.mediaData.image} />
					:
					<SelectedMediaBackground
						background={this.props.DefaultCover}
					/>
				}
			</div>
		);
	}
}

MediaStep3.propTypes = {
	setPrivacyRange: PropTypes.func.isRequired,
	privacyRange: PropTypes.number.isRequired,
	prevStep: PropTypes.func.isRequired,
	handleSubmit: PropTypes.func.isRequired,
	mediaData: PropTypes.object.isRequired,
	DefaultCover: PropTypes.string.isRequired
};

export default MediaStep3;
