import React, { Component } from "react";
import styled from "styled-components";
import { Button } from "semantic-ui-react";
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
	`,
	StyledButton = styled( Button )`
		align-self: center;
	`,
	Header = styled.h2`
		color: #fff;
	`;

class AlertsFilter extends Component {
	render() {
		if ( this.props.nsfw ) {
			return (
				<Wrapper>
					<Warning>
						<Header>This content is NSFW</Header>
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
						<Header>This post contains SPOILERS</Header>
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
