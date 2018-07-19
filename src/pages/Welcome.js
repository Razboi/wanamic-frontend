import React, { Component } from "react";
import api from "../services/api";
import Step2 from "../components/WelcomeStep2";
import Step3 from "../components/WelcomeStep3";
import Step4 from "../components/WelcomeStep4";
import styled from "styled-components";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import refreshToken from "../utils/refreshToken";

const
	Wrapper = styled.div`
		height: 100%;
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
			hobbies: [],
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

	handleDelete = i => {
		const filteredHobbies = this.state.hobbies.filter(
			( hobbie, index ) => index !== i );
		this.setState({ hobbies: filteredHobbies });
	}

	handleAddition = hobbie => {
		this.setState( state => ({
			hobbies: [ ...state.hobbies, hobbie ]
		}));
	}

	handleNext = () =>
		this.setState({ step: this.state.step + 1 })

	handlePrev = () =>
		this.setState({ step: this.state.step - 1 })

	handleCategoryClick = category => {
		var arrayOfChecked = this.state.checkedCategories;
		if ( arrayOfChecked.includes( category )) {
			const index = arrayOfChecked.indexOf( category );
			arrayOfChecked.splice( index, 1 );
			this.setState({ checkedCategories: arrayOfChecked });
		} else {
			this.setState({
				checkedCategories: [ ...arrayOfChecked, category ]
			});
		}
	}

	handleFollow = username => {
		this.setState({
			toFollow: [ ...this.state.toFollow, username ]
		});
	}

	handleUnfollow = username => {
		var usersToFollow = this.state.toFollow;
		const index = usersToFollow.indexOf( username );
		usersToFollow.splice( index, 1 );
		this.setState({ toFollow: usersToFollow });
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

	finish = async() => {
		var data = new FormData();
		data.append( "userImage", this.state.userImage );
		data.append( "description", this.state.description );
		data.append( "token", localStorage.getItem( "token" ));
		try {
			await Promise.all([
				api.setUserInfo( data ),
				api.updateInterests( this.state.checkedCategories ),
				api.setupFollow( this.state.toFollow ),
				api.setUserKw( this.state.hobbies )
			]);
			localStorage.removeItem( "NU" );
			this.props.history.push( "/" );
		} catch ( err ) {
			console.log( err );
			if ( err.response.data === "jwt expired" ) {
				await refreshToken();
				this.finish();
			}
		}
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
						hobbies={this.state.hobbies}
						handleDelete={this.handleDelete}
						handleAddition={this.handleAddition}
					/>
				}

				{ this.state.step === 2 &&
					<Step3
						categoriesNext={this.categoriesNext}
						handlePrev={this.handlePrev}
						handleChange={this.handleChange}
						categories={categories}
						toggle={this.toggle}
						handleCategoryClick={this.handleCategoryClick}
						checkedCategories={this.state.checkedCategories}
					/>
				}

				{ this.state.step === 3 &&
					<Step4
						handlePrev={this.handlePrev}
						handleChange={this.handleChange}
						matchedUsers={this.state.matchedUsers}
						handleFollow={this.handleFollow}
						handleUnfollow={this.handleUnfollow}
						finish={this.finish}
						toFollow={this.state.toFollow}
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
