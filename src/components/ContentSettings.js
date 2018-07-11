import React, { Component } from "react";
import { Button, Icon } from "semantic-ui-react";
import styled from "styled-components";
import PropTypes from "prop-types";

const
	Wrapper = styled.div`
		position: absolute;
		height: 100vh;
		width: 100%;
		display: grid;
		grid-template-columns: 100%;
		grid-template-rows: 9% 91%;
		grid-template-areas:
			"hea"
			"opt"
	`,
	HeaderWrapper = styled.div`
		grid-area: hea;
		display: flex;
		align-items: center;
		padding-left: 10px;
		border-bottom: 1px solid rgba(0, 0, 0, .5);
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
	Categories = styled.div`
		flex-wrap: wrap;
		display: flex;
	`,
	CategoryButton = styled( Button )`
		margin: 0.5rem !important;
		flex: 1 0 0%;
	`,
	SaveButton = styled( Button )`
		display: flex !important;
		margin: 1rem 0 0 auto !important;
	`;

class ContentSettings extends Component {
	render() {
		return (
			<Wrapper>
				<HeaderWrapper>
					<BackArrow
						name="arrow left"
						onClick={this.props.backToMain}
					/>
					<HeaderTxt>Content preferences</HeaderTxt>
				</HeaderWrapper>
				<Options>
					<Categories>
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
	categories: PropTypes.array.isRequired,
	handleCategoryClick: PropTypes.func.isRequired
};

export default ContentSettings;
