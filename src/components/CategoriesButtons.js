import React, { Component } from "react";
import styled from "styled-components";
import { Icon } from "semantic-ui-react";
import PropTypes from "prop-types";


const
	Categories = styled.div`
		flex-wrap: wrap;
		display: flex;
		margin-bottom: 3rem;
		justify-content: center;
		@media (max-width: 350px) {
			justify-content: center;
		}
	`,
	Category = styled.div`
		margin: 0.5rem !important;
		border-radius: 2px !important;
		font-family: inherit !important;
		height: 250px;
		width: 250px;
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
		:hover {
			cursor: pointer;
		}
	`,
	CategoryBackground = styled.div`
		display: block;
		background-image: url(${props => props.image});
		background-repeat: no-repeat;
		background-size: cover;
		background-position: center;
		filter: brightness( 45% );
		position: absolute;
		height: 100%;
		width: 100%;
	`,
	CategoryTitle = styled.span`
		color: #fff;
		font-weight: bold;
		font-size: 1.55rem;
		z-index: 2;
	`,
	CategoryCheck = styled( Icon )`
		color: #fff;
		font-weight: bold;
		font-size: 2rem !important;
		z-index: 2;
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
					<Category
						key={index}
						onClick={() => this.props.handleCategoryClick( category )}
						content={category}
						active={this.props.checkedCategories.includes( category )}
					>
						<CategoryBackground image={require( `../images/${category}.jpg` )} />
						{this.props.checkedCategories.includes( category ) ?
							<CategoryCheck name="check" />
							:
							<CategoryTitle>
								{category}
							</CategoryTitle>
						}
					</Category>
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
