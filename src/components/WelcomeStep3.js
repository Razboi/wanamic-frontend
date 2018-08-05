import React, { Component } from "react";
import { Button } from "semantic-ui-react";
import styled from "styled-components";
import PropTypes from "prop-types";
import CategoriesButtons from "./CategoriesButtons";

const
	Wrapper = styled.div`
		padding: 1rem;
		@media (min-width: 420px) {
			max-width: 600px;
			margin: 0 auto;
		}
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

				<CategoriesButtons
					checkedCategories={this.props.checkedCategories}
					handleCategoryClick={this.props.handleCategoryClick}
				/>

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
	handleCategoryClick: PropTypes.func.isRequired
};

export default Step3;
