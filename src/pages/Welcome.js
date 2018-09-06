import React, { Component } from "react";
import api from "../services/api";
import Step2 from "../components/WelcomeStep2";
import Step3 from "../components/WelcomeStep3";
import Step4 from "../components/WelcomeStep4";
import styled from "styled-components";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import refreshToken from "../utils/refreshToken";
import compressImage from "../utils/compressImage";

const
	Wrapper = styled.div`
		height: 100%;
	`;

class WelcomePage extends Component {
	constructor() {
		super();
		this.state = {
			hobbies: [],
			userImage: null,
			imagePreview: undefined,
			step: 1,
			checkedCategories: [],
			toFollow: [],
			matchedUsers: [],
			error: "",
			loader: false,
			tagInput: "",
			suggestions: []
		};
		this.hobbiesSuggestions = {
			Art: [ "Drawing", "Painting", "Design", "Architecture", "Sculpture" ],
			Gaming: [ "Fortnite", "PUB", "Grand Theft Auto V", "WOW", "Overwatch" ],
			Technology: [ "Programming", "Hardware", "Gadgets", "Smartphones", "Cryptocurrency", "Artificial intelligence" ],
			Science: [ "Physics", "Chemistry", "Astronomy", "Biology", "Medicine", "Computer Science", "Engineering" ],
			Music: [ "Rock", "Pop", "HipHop", "Jazz", "Electronic", "Blues", "Classical", "Country" ],
			Sports: [ "Football/Soccer", "Basketball", "Cricket", "Golf", "Tennis", "Hockey" ],
			Books: [ "Science Fiction", "Mystery", "Horror", "Romance", "Thriller" ],
			Cooking: [ "Gardening", "Asian food", "Indian food", "Mexican food" ],
			Travel: [ "Europe", "Africa", "Asia", "Japan", "Spain" ],
			Films: [ "Comedy", "Action films", "Drama", "Marvel", "DC" ],
			Health: [ "Detox", "Smoothies", "Keto diet", "Vegetarian", "Vegan" ],
			Fitness: [ "Gym", "Running", "Bodybuilding", "Calisthenics", "Crossfit" ],
			Beauty: [ "Makeup", "Nail art", "Hairstyles" ],
			Humor: [ "Memes", "Dark humor", "Improvisation", "Stand up comedy" ],
			Business: [ "Startups", "Investing", "Stocks", "Economy", "Politics" ],
			Photography: [ "Architectural photography", "Wildlife photography" ],
			TV: [ "Game of thrones", "Westworld", "The walking dead", "Stranger things", "Atlanta" ],
			Family: [ "Babies", "Weddings", "Parenting", "Religion", "Family travel" ],
			Motor: [ "Motorcycles", "Cars", "EV", "Tesla", "Racing", "Harley-Davidson" ],
			Pets: [ "Dogs", "Cats", "Pet training", "Birds", "Mice" ],
			Fashion: [ "Vintage", "Urban style", "Bohemian", "Rocker" ]
		};
	}

	componentDidMount() {
		document.title = "Welcome";
	}

	handleChange = e => {
		this.setState({ [ e.target.name ]: e.target.value });
	}

	handleFileChange = e => {
		const
			file = e.target.files[ 0 ],
			target = e.target.name,
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
			this.setState({ loader: true });
			compressImage( file, target === "headerImage" ).then( compressedImg => {
				this.setState({
					[ target ]: compressedImg,
					loader: false,
					imagePreview: URL.createObjectURL( compressedImg )
				});
			}).catch( err => {
				console.log( err );
				this.setState({ err });
			});
		} else {
			this.setState({
				[ e.target.name ]: file,
				imagePreview: URL.createObjectURL( file ),
				error: ""
			});
		}
	}

	handleDelete = i => {
		const filteredHobbies = this.state.hobbies.filter(
			( hobbie, index ) => index !== i );
		this.setState({ hobbies: filteredHobbies });
	}

	handleAddition = hobbie => {
		if ( !hobbie.id.trim( "" )) {
			return;
		}
		this.setState( state => ({
			hobbies: [ ...state.hobbies, hobbie ], tagInput: ""
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

	finishStep3 = async() => {
		var data = new FormData();
		if ( this.state.userImage ) {
			data.append( "userImage", this.state.userImage );
		}
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
				this.finishStep3();
			}
		}
	}

	categoriesNext = async() => {
		var finalSuggestions = [];
		try {
			for ( const category of this.state.checkedCategories ) {
				finalSuggestions.push( ...this.hobbiesSuggestions[ category ]);
			}
			const res = await api.getInterestsMatches( this.state.checkedCategories );
			this.setState({
				matchedUsers: res.data,
				suggestions: finalSuggestions
			});
			this.handleNext();
		} catch ( err ) {
			console.log( err );
			if ( err.response && err.response.data === "jwt expired" ) {
				await refreshToken();
				this.categoriesNext();
				return;
			}
			this.setState({ error: err.response && err.response.data });
		}
	}

	finish = async() => {
		try {
			await api.updateInterests( this.state.checkedCategories );
			const notifications = await api.setupFollow( this.state.toFollow );
			for ( const notification of notifications.data ) {
				this.props.socket.emit( "sendNotification", notification );
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
						categoriesNext={this.categoriesNext}
						handleChange={this.handleChange}
						toggle={this.toggle}
						handleCategoryClick={this.handleCategoryClick}
						checkedCategories={this.state.checkedCategories}
					/>
				}

				{ this.state.step === 2 &&
					<Step3
						handleNext={this.finishStep3}
						handlePrev={this.handlePrev}
						handleChange={this.handleChange}
						handleFileChange={this.handleFileChange}
						hobbies={this.state.hobbies}
						handleDelete={this.handleDelete}
						handleAddition={this.handleAddition}
						error={this.state.error}
						imagePreview={this.state.imagePreview}
						loader={this.state.loader}
						tagInput={this.state.tagInput}
						suggestions={this.state.suggestions}
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
