import React, { Component } from "react";
import { Button } from "semantic-ui-react";
import styled from "styled-components";
import PropTypes from "prop-types";

const Wrapper = styled.div`
	justify-self: center;
	margin: 10px 0px;
`;


class CategoryCheck extends Component {
	toggle = () => {
		this.props.checked( this.props.category, !this.props.checked );
	}

	render() {
		return (
			<Wrapper>
				<Button
					onClick={this.toggle}
					content={this.props.category}
					primary={this.props.checked}
				/>
			</Wrapper>
		);
	}
}

CategoryCheck.propTypes = {
	category: PropTypes.string.isRequired,
	checked: PropTypes.func.isRequired
};


export default CategoryCheck;
