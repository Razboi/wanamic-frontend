import React, { Component } from "react";
import styled from "styled-components";
import { Button, Header } from "semantic-ui-react";
import PropTypes from "prop-types";

const
	Wrapper = styled.div`
		position: absolute;
		display: flex;
		z-index: 2;
		height: 100%;
		width: 100%;
		justify-content: center;
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
	`,
	StyledHeader = styled( Header )`
		color: #fff !important;
	`,
	StyledSubHeader = styled( Header.Subheader )`
		color: #fff !important;
	`,
	AlertImage = styled.span`
		height: 64px;
		width: 64px;
		display: block;
		background-image: url(${props => props.image});
		background-repeat: no-repeat;
		margin: 0;
	`;

class AlertsFilter extends Component {
	render() {
		if ( this.props.nsfw ) {
			return (
				<Wrapper>
					<Warning>
						<AlertImage
							image={require( "../images/plus_18.png" )}
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
				<Wrapper>
					<Warning>
						<AlertImage
							image={require( "../images/warning.png" )}
						/>
						<StyledHeader>
							Spoilers
							<StyledSubHeader>
								This post contains spoilers.
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
	handleFilter: PropTypes.func.isRequired
};

export default AlertsFilter;
