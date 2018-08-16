import React, { Component } from "react";
import { Button, Checkbox, Icon, Input } from "semantic-ui-react";
import PropTypes from "prop-types";
import styled from "styled-components";

const
	Wrapper = styled.div`
		overflow-y: auto;
		position: ${props => props.onShare ? "absolute" : "fixed"};
		height: 100%;
		min-height: 100vh;
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
		display: flex;
		flex-direction: column;
	`,
	HeaderWrapper = styled.div`
		display: flex;
		z-index: 2;
		align-items: center;
		justify-content: space-between;
		box-shadow: 0 1px 2px #111;
		i {
			font-size: 1.5rem !important;
		}
		@media (max-width: 420px) {
			height: 55px;
			padding: 0px 20px;
		}
		@media (min-width: 420px) {
			height: 80px;
			padding: 0px 40px;
			i {
				:hover {
					cursor: pointer !important;
				}
			}
		}
	`,
	HeaderTxt = styled.span`
		font-weight: bold;
		font-size: 1rem;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		max-width: 65%;
		font-size: 1.2rem !important;
		@media (min-width: 420px) {
			font-size: 1.3rem;
		}
	`,
	ShareOptions = styled.div`
		align-self: center;
		display: flex;
		flex-direction: column;
		width: 100%;
		justify-content: center;
		height: 150px;
		@media (min-height: 420px) {
			height: 200px;
		}
	`,
	AlertsWrapper = styled.div`
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-top: 1rem;
	`,
	AlertsTitle = styled.h4`
		font-size: 1.2rem !important;
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
			"linear-gradient(to right, rgb(73,157,131) 50%, rgba(0,0,0,0.75) 50%) !important" };
		background: ${props => props.range === 3 && "rgb(73,157,131) !important"};
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
		background: rgb(133, 217, 191) !important
		color: ${props => props.active ? "#fff" : "#000"} !important;
	`,
	SliderHeader = styled.h4`
		text-align: center;
		align-self: center;
		font-size: 1.2rem !important;
	`,
	SelectedMediaBackground = styled.div`
		height: 100vh;
		background-image: url(${props => props.background});
		background-size: cover;
		filter: blur(20px) brightness(50%);
		transform: scale(1.05);
	`,
	SpoilerDescription = styled.div`
		margin-top: 3rem;
		display: flex;
		flex-direction: column;
		text-align: center;
		font-size: 1rem;
	`,
	StyledInput = styled( Input )`
		margin-top: 5px;
		width: 300px;
		input {
			font-size: 1rem;
			color: #111 !important;
			border-radius: 2px !important;
			text-align: center !important;
			::placeholder {
				color: #444 !important;
			}
		}
	`;


class MediaStep3 extends Component {
	render() {
		return (
			<Wrapper onShare={this.props.onShare}>
				<Options whiteTheme={this.props.whiteTheme}>
					<HeaderWrapper>
						<Icon
							className="backIcon"
							name="arrow left"
							onClick={this.props.prevStep}
						/>
						<HeaderTxt>Privacy options</HeaderTxt>
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
								"Everybody (will be included in the explore page)"}
						</SliderHeader>
						<PrivacySlider range={this.props.privacyRange}>
							<PrivacyButton
								active={this.props.privacyRange >= 1}
								circular
								icon="users"
								size="huge"
								onClick={() => this.props.setPrivacyRange( 1 )}
							/>
							<PrivacyButton
								active={this.props.privacyRange >= 2}
								className="privacyButton2"
								circular
								icon="binoculars"
								size="huge"
								onClick={() => this.props.setPrivacyRange( 2 )}
							/>
							<PrivacyButton
								active={this.props.privacyRange === 3}
								circular
								icon="globe"
								size="huge"
								onClick={() => this.props.setPrivacyRange( 3 )}
							/>
						</PrivacySlider>
					</ShareOptions>
					<AlertsWrapper>
						<AlertsTitle>Alerts</AlertsTitle>
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
						{this.props.spoilers &&
							<SpoilerDescription>
								<span>What is the spoiler about?</span>
								<StyledInput
									name="spoilerDescription"
									placeholder="GoT episode 4 season 2"
									onChange={this.props.handleChange}
									maxLength="70"
								/>
							</SpoilerDescription>
						}
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
	handleChange: PropTypes.func.isRequired,
	setPrivacyRange: PropTypes.func.isRequired,
	privacyRange: PropTypes.number.isRequired,
	prevStep: PropTypes.func.isRequired,
	handleSubmit: PropTypes.func.isRequired,
	mediaData: PropTypes.object.isRequired,
	spoilers: PropTypes.bool.isRequired,
	whiteTheme: PropTypes.bool,
	onShare: PropTypes.bool
};

export default MediaStep3;
