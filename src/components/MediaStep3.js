import React, { Component } from "react";
import { Button, Checkbox, Icon, Input, Dropdown } from "semantic-ui-react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { connect } from "react-redux";

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
		align-items: center;
		height: 150px;
		@media (min-height: 420px) {
			height: 200px;
		}
	`,
	Tabs = styled.div`
		align-self: center;
		display: flex;
		width: 100%;
		justify-content: center;
		align-items: center;
	`,
	AlertsWrapper = styled.div`
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-top: 1rem;
	`,
	Title = styled.h4`
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
	`,
	Tab = styled( Button )`
		background-color: ${props => props.primary && "rgb(133,217,191)"} !important;
	`;


class MediaStep3 extends Component {
	constructor( props ) {
		super( props );
		this.state = {
			feed: props.feed,
			selectedClub: props.selectedClub
		};
	}

	switchFeed = feed => {
		this.setState({ feed: feed, selectedClub: undefined });
	}

	selectClub = club => {
		this.setState({ feed: "club", selectedClub: club.name });
	}

	renderClub = ( club, index ) => {
		return (
			<Dropdown.Item
				key={index}
				text={club.name}
				onClick={() => this.selectClub( club )}
			/>
		);
	}

	submit = () => {
		const { feed, selectedClub } = this.state;
		if ( feed !== "global" && feed !== "club" ) {
			return;
		}
		this.props.handleSubmit( feed, selectedClub );
	}

	render() {
		let { selectedClub } = this.state;
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
							onClick={this.submit}
						/>
					</HeaderWrapper>
					<ShareOptions>
						<Title>Share with</Title>
						<Tabs>
							<Tab
								content="Global"
								primary={this.state.feed === "global"}
								onClick={() => this.switchFeed( "global" )}
							/>
							<Tab
								primary={this.state.feed === "club"}
								content={
									<Dropdown text={selectedClub ? selectedClub : "Clubs"}>
										<Dropdown.Menu>
											{this.props.clubs.map( this.renderClub )}
										</Dropdown.Menu>
									</Dropdown>
								}
							/>
						</Tabs>
					</ShareOptions>
					<AlertsWrapper>
						<Title>Alerts</Title>
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
	prevStep: PropTypes.func.isRequired,
	handleSubmit: PropTypes.func.isRequired,
	mediaData: PropTypes.object.isRequired,
	spoilers: PropTypes.bool.isRequired,
	whiteTheme: PropTypes.bool,
	onShare: PropTypes.bool
};


const
	mapStateToProps = state => ({
		feed: state.posts.feed,
		selectedClub: state.posts.selectedClub,
		clubs: state.posts.clubs
	});

export default connect( mapStateToProps )( MediaStep3 );
