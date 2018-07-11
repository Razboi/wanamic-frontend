import React, { Component } from "react";
import { Button } from "semantic-ui-react";
import styled from "styled-components";
import PropTypes from "prop-types";

const
	Wrapper = styled.div`
		padding: 1rem;
	`,
	Categories = styled.div`
		flex-wrap: wrap;
		display: flex;
		margin-bottom: 3rem;
	`,
	HeaderWrapper = styled.header`
		display: flex;
		flex-direction: column;
		margin-bottom: 3rem;
		align-items: center;
	`,
	Step = styled.h2`
	`,
	Subheader = styled.span`
		font-size: 1rem;
		color: rgba( 0,0,0,0.4);
		text-align: center;
	`,
	CategoryButton = styled( Button )`
		margin: 0.5rem !important;
		flex: 1 0 0%;
	`,
	Buttons = styled.div`
		display: flex;
		justify-content: space-between;
	`;

class Step3 extends Component {
	render() {
		return (
			<Wrapper>
				<HeaderWrapper>
					<Step>General interests</Step>
					<Subheader>
						This will allow us to show you relevant content and users
					</Subheader>
				</HeaderWrapper>
				<Categories className="categoriesWrapper">
					{this.props.categories.map(( category, index ) =>
						<CategoryButton
							key={index}
							onClick={() =>
								this.props.handleCategoryClick( category )
							}
							content={category}
							secondary={
								this.props.checkedCategories.includes( category )
							}
						/>
					)}
				</Categories>
				<Buttons>
					<Button
						className="prevButton"
						secondary
						content="Prev"
						onClick={this.props.handlePrev}
					/>
					<Button
						className="nextButton"
						primary
						content="Next"
						disabled={this.props.checkedCategories.length === 0}
						onClick={this.props.categoriesNext}
					/>
				</Buttons>
			</Wrapper>
		);
	}
}

Step3.propTypes = {
	handlePrev: PropTypes.func.isRequired,
	categoriesNext: PropTypes.func.isRequired,
	checkedCategories: PropTypes.array.isRequired,
	categories: PropTypes.array.isRequired,
	handleCategoryClick: PropTypes.func.isRequired
};

export default Step3;
