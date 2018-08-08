import React, { Component } from "react";
import styled from "styled-components";
import { Button } from "semantic-ui-react";
import PropTypes from "prop-types";


const
	Categories = styled.div`
		flex-wrap: wrap;
		display: flex;
		margin-bottom: 3rem;
		justify-content: space-between;
		@media (max-width: 350px) {
			justify-content: center;
		}
	`,
	CategoryButton = styled( Button )`
		margin: 0.5rem !important;
		flex: 0 0 0%;
		border-radius: 2px !important;
		font-family: inherit !important;
		border: ${props => props.active &&
			"1px solid rgb(133, 217, 191)"} !important;
		background: ${props => props.active && "#fff"} !important;
		color: ${props => props.active && "rgb(133, 217, 191)"} !important;
	`;


class CategoriesButtons extends Component {
	constructor() {
		super();
		this.categories = [
			"Art", "Technology", "Cooking", "Science", "Travel", "Films", "Health",
			"Fitness", "Beauty", "Humor", "Business", "Music", "Photography", "TV",
			"Family", "Sports", "Gaming", "Motor", "Books", "Pets", "Fashion"
		];
	}

	render() {
		return (
			<Categories className="categoriesWrapper">
				{this.categories.map(( category, index ) =>
					<CategoryButton
						key={index}
						onClick={() => this.props.handleCategoryClick( category )}
						content={category}
						active={this.props.checkedCategories.includes( category )}
					/>
				)}
			</Categories>
		);
	}
}

CategoriesButtons.propTypes = {
	handleCategoryClick: PropTypes.func.isRequired,
	checkedCategories: PropTypes.array.isRequired,
};

export default CategoriesButtons;
