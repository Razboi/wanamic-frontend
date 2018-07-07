import React, { Component } from "react";
import api from "../services/api";
import Step2 from "../components/WelcomeStep2";
import Step3 from "../components/WelcomeStep3";
import Step4 from "../components/WelcomeStep4";
import styled from "styled-components";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import refreshToken from "../utils/refreshToken";
import setUserKw from "../utils/setUserKWs";

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
			description: "",
			keywords: "",
			userImage: null,
			step: 1,
			checkedCategories: [],
			toFollow: [],
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

	handleFollow = ( username, checked ) => {
		var arrayOfToFollow;
		if ( checked ) {
			this.setState({
				toFollow: [ ...this.state.toFollow, username ]
			});
		} else {
			arrayOfToFollow = this.state.toFollow;
			const index = arrayOfToFollow.indexOf( username );
			arrayOfToFollow.splice( index, 1 );
			this.setState({ toFollow: arrayOfToFollow });
		}
	}

	categoriesNext = () => {
		api.getInterestsMatches( this.state.checkedCategories )
			.then( res => {
				if ( res === "jwt expired" ) {
					refreshToken()
						.then(() => this.categoriesNext())
						.catch( err => console.log( err ));
				} else {
					this.setState({ matchedUsers: res.data });
					this.handleNext();
				}
			}).catch( err => console.log( err ));
	}

	finish = () => {
		var data = new FormData();
		data.append( "userImage", this.state.userImage );
		data.append( "description", this.state.description );
		data.append( "token", localStorage.getItem( "token" ));
		Promise.all([
			api.setUserInfo( data ),
			api.updateInterests( this.state.checkedCategories ),
			api.setupFollow( this.state.toFollow )
		])
			.then( res => {
				if ( res === "jwt expired" ) {
					refreshToken()
						.then(() => this.finish())
						.catch( err => console.log( err ));
				} else {
					setUserKw( this.state.keywords );
					localStorage.removeItem( "NU" );
					this.props.history.push( "/" );
				}
			}).catch( err => console.log( err ));
	}

	render() {
		return (
			<Wrapper>
				{ this.state.step === 1 &&
					<Step2
						handleNext={this.handleNext}
						handleChange={this.handleChange}
						handleFileChange={this.handleFileChange}
						description={this.state.description}
						keywords={this.state.keywords}
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
						handleFollow={this.handleFollow}
						finish={this.finish}
					/>
				}

			</Wrapper>
		);
	}
}

WelcomePage.propTypes = {
	history: PropTypes.shape({
		push: PropTypes.func.isRequired
	}).isRequired
};

export default withRouter( WelcomePage );
