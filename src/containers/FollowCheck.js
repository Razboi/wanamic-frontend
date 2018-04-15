import React, { Component } from "react";
import { Button } from "semantic-ui-react";
import styled from "styled-components";

const Wrapper = styled.div`
`;


class FollowCheck extends Component {
	constructor() {
		super();
		this.state = {
			checked: false
		};
	}

	toggle = () => {
		this.setState({ checked: !this.state.checked });
	}

	render() {
		return (
			<Wrapper>
				<Button
					size="tiny"
					onClick={this.toggle}
					content="Follow"
					primary={this.state.checked}
				/>
			</Wrapper>
		);
	}
}


export default FollowCheck;
