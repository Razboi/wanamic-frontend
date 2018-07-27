import React, { Component } from "react";
import { Button, Checkbox, Icon } from "semantic-ui-react";
import PropTypes from "prop-types";
import styled from "styled-components";

const
	Wrapper = styled.div`
		overflow: hidden;
		position: absolute;
		height: 100vh;
		width: 100%;
		z-index: 3;
	`,
	Options = styled.div`
		height: 100vh;
		width: 100%;
		color: ${props => props.whiteTheme ? "#000" : "#fff" } !important;
		background: ${props => props.whiteTheme ? "#fff" : "none" };
		position: absolute;
		z-index: 4;
		display: grid;
		grid-template-columns: 100%;
		grid-template-rows: 7% 33% 60%;
		grid-template-areas:
			"he"
			"so"
			"al"
	`,
	HeaderWrapper = styled.div`
		grid-area: he;
		display: flex;
		z-index: 2;
		align-items: center;
		justify-content: space-between;
		padding: 0px 10px;
		box-shadow: 0 1px 2px #111;
	`,
	HeaderTxt = styled.span`
		font-weight: bold;
		font-size: 1rem;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		max-width: 65%;
	`,
	ShareOptions = styled.div`
		grid-area: so;
		align-self: center;
		padding: 10px;
		display: flex;
		flex-direction: column;
	`,
	AlertsWrapper = styled.div`
		grid-area: al;
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
		align-self: center;
		display: flex;
		justify-content: space-between;
		@media (max-width: 420px) {
			width: 70%;
		};
		@media (min-width: 420px) {
			width: 300px;
		}
	`,
	PrivacyButton = styled( Button )`
		margin: 0px !important;
	`,
	SliderHeader = styled.h4`
		text-align: center;
		align-self: center;
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
			<Wrapper>
				<Options whiteTheme={this.props.whiteTheme}>
					<HeaderWrapper>
						<Icon
							className="backIcon"
							name="arrow left"
							onClick={this.props.prevStep}
						/>
						<HeaderTxt>Share with</HeaderTxt>
						<Icon
							className="nextIcon"
							name="check"
							onClick={this.props.handleSubmit}
						/>
					</HeaderWrapper>
					<ShareOptions>
						<SliderHeader>
							{this.props.privacyRange === 1 && "Friends"}
							{this.props.privacyRange === 2 && "Friends and Followers"}
							{this.props.privacyRange === 3 &&
								"Everybody (will be included in the explore page unless it has alerts)"}
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
								className="privacyButton2"
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

				</Options>
				{this.props.mediaData && this.props.mediaData.image &&
					<SelectedMediaBackground background={this.props.mediaData.image} />
				}
			</Wrapper>
		);
	}
}

MediaStep3.propTypes = {
	handleCheck: PropTypes.func.isRequired,
	setPrivacyRange: PropTypes.func.isRequired,
	privacyRange: PropTypes.number.isRequired,
	prevStep: PropTypes.func.isRequired,
	handleSubmit: PropTypes.func.isRequired,
	mediaData: PropTypes.object.isRequired,
	whiteTheme: PropTypes.bool
};

export default MediaStep3;
