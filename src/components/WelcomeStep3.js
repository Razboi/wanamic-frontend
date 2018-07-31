import React, { Component } from "react";
import { Button } from "semantic-ui-react";
import styled from "styled-components";
import PropTypes from "prop-types";

const
	Wrapper = styled.div`
		padding: 1rem;
		@media (min-width: 420px) {
			max-width: 600px;
			margin: 0 auto;
		}
	`,
	Categories = styled.div`
		flex-wrap: wrap;
		display: flex;
		margin-bottom: 3rem;
		justify-content: space-between;
	`,
	HeaderWrapper = styled.header`
		display: flex;
		flex-direction: column;
		margin-bottom: 3rem;
		align-items: center;
	`,
	Step = styled.h2`
		font-family: inherit !important;
	`,
	Subheader = styled.span`
		font-size: 1rem;
		color: #444;
		font-family: inherit;
		text-align: center;
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
	`,
	Buttons = styled.div`
		display: flex;
		justify-content: space-between;
	`,
	NextButton = styled( Button )`
		background: rgb(133, 217, 191) !important;
		color: #fff !important;
		font-family: inherit !important;
		border-radius: 2px !important;
		margin: 0 !important;
	`,
	PrevButton = styled( Button )`
		font-family: inherit !important;
		border-radius: 2px !important;
		margin: 0 !important;
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
							active={this.props.checkedCategories.includes( category )}
						/>
					)}
				</Categories>
				<Buttons>
					<PrevButton
						secondary
						className="prevButton"
						content="Prev"
						onClick={this.props.handlePrev}
					/>
					<NextButton
						className="nextButton"
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
