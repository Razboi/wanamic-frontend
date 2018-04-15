import React, { Component } from "react";
import api from "../services/api";
import Step2 from "../components/WelcomeStep2";
import Step3 from "../components/WelcomeStep3";
import Step4 from "../components/WelcomeStep4";
import styled from "styled-components";
import { withRouter } from "react-router-dom";

const
	Wrapper = styled.div`
		padding: 10px;
	`,
	categories = [
		"Art", "Technology", "Cooking", "Science", "Travel", "Films", "Health",
		"Fitness", "Beauty", "Humor", "Business", "Music", "Photography", "TV",
		"Family", "Sports", "Gaming", "Motor", "Books", "Pets", "Fashion"
	];

class WelcomePage extends Component {
	constructor() {
		super();
		this.state = {
			username: "",
			description: "",
			userImage: null,
			step: 1,
			checkedCategories: [],
			matchedUsers: []
		};
	}


	handleChange = e =>
		this.setState({ [ e.target.name ]: e.target.value })

	handleFileChange = e => {
		this.setState({
			[ e.target.name ]: e.target.files[ 0 ]
		});
	}

	handleNext = () =>
		this.setState({ step: this.state.step + 1 })

	handlePrev = () =>
		this.setState({ step: this.state.step - 1 })

	checked = ( category, checked ) => {
		var arrayOfChecked;
		if ( checked ) {
			this.setState({
				checkedCategories: [ ...this.state.checkedCategories, category ]
			});
		} else {
			arrayOfChecked = this.state.checkedCategories;
			const index = arrayOfChecked.indexOf( category );
			arrayOfChecked.splice( index, 1 );
			this.setState({ checkedCategories: arrayOfChecked });
		}
	}

	categoriesNext = () => {
		api.getInterestsMatches( this.state.checkedCategories )
			.then( res => this.setState({ matchedUsers: res.data }))
			.catch( err => console.log( err ));
		this.setState({ checkedCategories: [] });
		this.handleNext();
	}

	finish = () => {
		this.props.history.push( "/" );
	}

	render() {
		return (
			<Wrapper>
				{ this.state.step === 1 &&
					<Step2
						handleNext={this.handleNext}
						handleChange={this.handleChange}
						handleFileChange={this.handleFileChange}
					/>
				}

				{ this.state.step === 2 &&
					<Step3
						categoriesNext={this.categoriesNext}
						handlePrev={this.handlePrev}
						handleChange={this.handleChange}
						categories={categories}
						toggle={this.toggle}
						checked={this.checked}
						checkedCategories={this.state.checkedCategories}
					/>
				}

				{ this.state.step === 3 &&
					<Step4
						handlePrev={this.handlePrev}
						handleChange={this.handleChange}
						matchedUsers={this.state.matchedUsers}
						finish={this.finish}
					/>
				}

			</Wrapper>
		);
	}
}


export default withRouter( WelcomePage );
