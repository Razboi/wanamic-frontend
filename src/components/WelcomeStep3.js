import React, { Component } from "react";
import { Button } from "semantic-ui-react";
import CategoryCheck from "../containers/CategoryCheck";
import styled from "styled-components";

const ChecksWrapper = styled.div`
	display: grid;
	grid-template-columns: auto auto auto;
	margin: 40px 0px;
`;

class Step3 extends Component {
	render() {
		return (
			<div>
				<h2>Step 3</h2>
				<h4>What are you interested in?</h4>
				<ChecksWrapper>
					{this.props.categories.map(( category, index ) =>
						<CategoryCheck
							key={index}
							category={category}
							checked={this.props.checked}
						/>
					)}
				</ChecksWrapper>

				<Button
					primary
					floated="right"
					content="Next"
					disabled={this.props.checkedCategories.length === 0}
					onClick={this.props.categoriesNext}
				/>
				<Button
					secondary floated="left" content="Prev" onClick={this.props.handlePrev}
				/>
			</div>
		);
	}
}

export default Step3;
