import React, { Component } from "react";
import styled from "styled-components";
import { Button, Header } from "semantic-ui-react";
import PropTypes from "prop-types";

const
	Wrapper = styled.div`
		position: ${props => !props.explore && "absolute !important"};
		display: flex;
		z-index: 2;
		height: 100%;
		width: 100%;
		justify-content: center;
		padding: 10px;
	`,
	Warning = styled.div`
		align-self: center;
		display: flex;
		flex-direction: column;
		width: 100%;
		text-align: center;
		align-items: center;
		justify-content: center;
	`,
	StyledButton = styled( Button )`
		align-self: center;
		background: rgb(133, 217, 191) !important;
    border-radius: 2px !important;
    font-family: inherit !important;
		@media (max-width: 420px) {
			padding: 10px !important;
		}
	`,
	StyledHeader = styled( Header )`
		color: #fff !important;
		font-family: inherit !important;
		margin: 10px 0 !important;
		@media (max-width: 420px) {
			font-size: 1.1rem !important;
		}
	`,
	StyledSubHeader = styled( Header.Subheader )`
		color: #fff !important;
		font-family: inherit !important;
		word-break: break-word !important;
		margin-top: 5px !important;
		@media (max-width: 420px) {
			font-size: 0.9rem !important;
		}
	`,
	AlertImage = styled.span`
		height: ${window.innerWidth > 420 ? "64px" : "32px"};;
		width: ${window.innerWidth > 420 ? "64px" : "32px"};;
		display: block;
		background-image: url(${props => props.image});
		background-repeat: no-repeat;
		margin: 0;
	`;

class AlertsFilter extends Component {
	render() {
		if ( this.props.nsfw ) {
			return (
				<Wrapper explore={this.props.explore}>
					<Warning>
						<AlertImage
							image={window.innerWidth > 420 ?
								require( "../images/plus_18.png" )
								:
								require( "../images/plus_18_small.png" )}
						/>
						<StyledHeader>
							Mature content
							<StyledSubHeader>
								This post contains sensitive media.
							</StyledSubHeader>
						</StyledHeader>
						<StyledButton
							secondary
							content="View content"
							onClick={() => this.props.handleFilter( "nsfw" )}
						/>
					</Warning>
				</Wrapper>
			);
		}
		if ( this.props.spoiler ) {
			return (
				<Wrapper explore={this.props.explore}>
					<Warning>
						<AlertImage
							image={window.innerWidth > 420 ?
								require( "../images/warning.png" )
								:
								require( "../images/warning_small.png" )}
						/>
						<StyledHeader>
							Spoilers
							<StyledSubHeader>
								{this.props.spoilerDescription ?
									`This post contains spoilers related to
									"${this.props.spoilerDescription}".`
									:
									"This post contains spoilers."
								}
							</StyledSubHeader>
						</StyledHeader>
						<StyledButton
							secondary
							content="View content"
							onClick={() => this.props.handleFilter( "spoiler" )}
						/>
					</Warning>
				</Wrapper>
			);
		}
		return null;
	}
}

AlertsFilter.propTypes = {
	nsfw: PropTypes.bool.isRequired,
	spoiler: PropTypes.bool.isRequired,
	spoilerDescription: PropTypes.string,
	handleFilter: PropTypes.func.isRequired,
	explore: PropTypes.bool
};

export default AlertsFilter;
