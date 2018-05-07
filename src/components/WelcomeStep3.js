import React, { Component } from "react";
import { Button } from "semantic-ui-react";
import CategoryCheck from "./CategoryCheck";
import styled from "styled-components";
import PropTypes from "prop-types";

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
				<ChecksWrapper className="checksWrapper">
					{this.props.categories.map(( category, index ) =>
						<CategoryCheck
							key={index}
							category={category}
							checked={this.props.checked}
						/>
					)}
				</ChecksWrapper>

				<Button
					className="nextButton"
					primary
					floated="right"
					content="Next"
					disabled={this.props.checkedCategories.length === 0}
					onClick={this.props.categoriesNext}
				/>
				<Button
					className="prevButton"
					secondary
					floated="left"
					content="Prev"
					onClick={this.props.handlePrev}
				/>
			</div>
		);
	}
}

Step3.propTypes = {
	handlePrev: PropTypes.func.isRequired,
	categoriesNext: PropTypes.func.isRequired,
	checkedCategories: PropTypes.array.isRequired,
	categories: PropTypes.array.isRequired,
	checked: PropTypes.bool.isRequired
};

export default Step3;
