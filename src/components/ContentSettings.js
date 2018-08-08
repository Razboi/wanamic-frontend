import React, { Component } from "react";
import { Button, Icon } from "semantic-ui-react";
import styled from "styled-components";
import PropTypes from "prop-types";
import CategoriesButtons from "./CategoriesButtons";

const
	Wrapper = styled.div`
		height: 100vh;
		width: 100%;
		@media (max-width: 760px) {
			display: ${props => props.largeScreen && "none"} !important;
			grid-area: main;
			display: grid;
			grid-template-columns: 100%;
			grid-template-rows: 9% 91%;
			grid-template-areas:
				"hea"
				"opt";
		}
		@media (min-width: 760px) {
			grid-area: main;
			background: #fff;
		}
	`,
	HeaderWrapper = styled.div`
		grid-area: hea;
		display: flex;
		align-items: center;
		padding-left: 10px;
		border-bottom: 1px solid rgba(0, 0, 0, .5);
		@media (min-width: 760px) {
			display: none;
		}
	`,
	BackArrow = styled( Icon )`
		font-size: 1.3rem !important;
		margin: 0 !important;
	`,
	HeaderTxt = styled.span`
		margin-left: 1rem;
		font-weight: bold;
		font-size: 1.25rem;
	`,
	Options = styled.div`
		grid-area: opt;
		padding: 1rem !important;
		::-webkit-scrollbar {
			display: none !important;
		}
		overflow-y: scroll;
	`,
	SaveButton = styled( Button )`
		display: flex !important;
		margin: 1rem 0 0 auto !important;
	`;

class ContentSettings extends Component {
	render() {
		return (
			<Wrapper largeScreen={this.props.largeScreen}>
				<HeaderWrapper>
					<BackArrow
						name="arrow left"
						onClick={this.props.backToMain}
					/>
					<HeaderTxt>Content preferences</HeaderTxt>
				</HeaderWrapper>
				<Options>

					<CategoriesButtons
						checkedCategories={this.props.checkedCategories}
						handleCategoryClick={this.props.handleCategoryClick}
					/>

					<SaveButton
						primary
						disabled={
							this.props.checkedCategories.length === 0
							|| !this.props.categoriesChanged
						}
						content="Save"
						onClick={this.props.updatePreferences}
					/>
				</Options>
			</Wrapper>
		);
	}
}

ContentSettings.propTypes = {
	updatePreferences: PropTypes.func.isRequired,
	backToMain: PropTypes.func.isRequired,
	checkedCategories: PropTypes.array.isRequired,
	handleCategoryClick: PropTypes.func.isRequired,
	largeScreen: PropTypes.bool
};

export default ContentSettings;
