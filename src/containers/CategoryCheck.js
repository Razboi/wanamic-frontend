import React, { Component } from "react";
import { Button } from "semantic-ui-react";
import styled from "styled-components";
import PropTypes from "prop-types";

const Wrapper = styled.div`
	justify-self: center;
	margin: 10px 0px;
`;


class CategoryCheck extends Component {
	constructor() {
		super();
		this.state = {
			checked: false
		};
	}

	toggle = () => {
		this.props.checked( this.props.category, !this.state.checked );
		this.setState({ checked: !this.state.checked });
	}

	render() {
		return (
			<Wrapper>
				<Button
					onClick={this.toggle}
					content={this.props.category}
					primary={this.state.checked}
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
