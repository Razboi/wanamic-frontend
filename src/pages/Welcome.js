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
	`;

class WelcomePage extends Component {
	constructor() {
		super();
		this.state = {
			description: "",
			hobbies: [],
			userImage: null,
			imagePreview: undefined,
			step: 1,
			checkedCategories: [],
			toFollow: [],
			matchedUsers: [],
			error: ""
		};
	}


	handleChange = e =>
		this.setState({ [ e.target.name ]: e.target.value })

	handleFileChange = e => {
		const
			file = e.target.files[ 0 ],
			fileExt = file && file.name.split( "." ).pop();

		if ( !file ) {
			return;
		}

		if (( file.type !== "image/jpeg" && file.type !== "image/png"
			&& file.type !== "image/jpg" && file.type !== "image/gif" )
			||
			( fileExt !== "jpeg" && fileExt !== "png"
			&& fileExt !== "jpg" && fileExt !== "gif" )) {
			this.setState({
				error: "Only .png/.jpg/.gif/.jpeg images are allowed"
			});
			return;
		}

		if ( file.size > 1010000 ) {
			this.setState({
				error: "The filesize limit is 1MB"
			});
			return;
		}

		this.setState({
			[ e.target.name ]: file,
			imagePreview: URL.createObjectURL( file ),
			error: ""
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

	finishStep2 = async() => {
		var data = new FormData();
		if ( this.state.userImage ) {
			data.append( "userImage", this.state.userImage );
		}
		data.append( "description", this.state.description );
		data.append( "token", localStorage.getItem( "token" ));

		this.handleNext();
		try {
			const res = await api.setUserInfo( data );
			await api.setUserKw( this.state.hobbies );
			if ( res.data.newImage ) {
				localStorage.setItem( "uimg", res.data.newImage );
			}
		} catch ( err ) {
			console.log( err );
			if ( err.response.data === "jwt expired" ) {
				await refreshToken();
				this.finishStep2();
			}
		}
	}

	categoriesNext = async() => {
		try {
			const res = await api.getInterestsMatches( this.state.checkedCategories );
			if ( res === "jwt expired" ) {
				await refreshToken();
				this.categoriesNext();
			} else {
				this.setState({ matchedUsers: res.data });
				this.handleNext();
			}
		} catch ( err ) {
			console.log( err );
		}
	}

	finish = async() => {
		try {
			await api.updateInterests( this.state.checkedCategories );
			const notifications = await api.setupFollow( this.state.toFollow );
			for ( const index in notifications ) {
				this.props.socket.emit( "sendNotification", notifications[ index ]);
			}
			localStorage.removeItem( "NU" );
			this.props.history.push( "/" );
		} catch ( err ) {
			console.log( err );
			if ( err.response && err.response.data === "jwt expired" ) {
				await refreshToken();
				this.finish();
				return;
			}
			this.setState({ error: err.response && err.response.data });
		}
	}

	render() {
		return (
			<Wrapper>
				{ this.state.step === 1 &&
					<Step2
						handleNext={this.finishStep2}
						handleChange={this.handleChange}
						handleFileChange={this.handleFileChange}
						description={this.state.description}
						hobbies={this.state.hobbies}
						handleDelete={this.handleDelete}
						handleAddition={this.handleAddition}
						error={this.state.error}
						imagePreview={this.state.imagePreview}
					/>
				}

				{ this.state.step === 2 &&
					<Step3
						categoriesNext={this.categoriesNext}
						handlePrev={this.handlePrev}
						handleChange={this.handleChange}
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
	}).isRequired,
	socket: PropTypes.object.isRequired
};

export default withRouter( WelcomePage );
