import React, { Component } from "react";
import styled from "styled-components";
import { Icon } from "semantic-ui-react";
import api from "../services/api";
import ExploreUsers from "../components/ExploreUsers";
import ExploreProfile from "../components/ExploreProfile";

const
	Wrapper = styled.div`
		@media (max-width: 420px) {
			height: 100vh;
			width: 100%;
			display: grid;
			grid-template-columns: 100%;
			grid-template-rows: 14% 86%;
			grid-template-areas:
				"h"
				"c"
		}
	`,
	Header = styled.div`
		@media (max-width: 420px) {
			grid-area: h;
			border-bottom: 1px solid #D8D8D8;
			display: grid;
			grid-template-columns: 50% 50%;
			grid-template-rows: 100%;
			grid-template-areas:
				"shu shc"
		}
	`,
	UserSubheader = styled.div`
		@media (max-width: 420px) {
			grid-area: shu;
			justify-self: center;
			align-self: center;
		}
	`,
	ContentSubheader = styled.div`
		@media (max-width: 420px) {
			grid-area: shc;
			justify-self: center;
			align-self: center;
		}
	`,
	MainComponent = styled.div`
		@media (max-width: 420px) {
			grid-area: c;
		}
	`;

class ExplorePage extends Component {
	constructor() {
		super();
		this.state = {
			keywords: "",
			usernameSearch: "",
			renderProfile: false,
			typeOfSearch: "",
			skip: 0
		};
	}

	getSugestedUser = () => {
		api.getSugested( this.state.skip )
			.then( res => this.setState({
				user: res.data, renderProfile: true, typeOfSearch: "sugested",
				skip: this.state.skip + 1
			}))
			.catch( err => console.log( err ));
	}

	getRandomUser = () => {
		api.getRandom()
			.then( res => this.setState({
				user: res.data, renderProfile: true, typeOfSearch: "random"
			}))
			.catch( err => console.log( err ));
	}

	getKeywordUser = () => {
		var keywordsArray = ( this.state.keywords ).split( /\s*#/ );
		keywordsArray.shift();
		api.matchKwUsers( keywordsArray, this.state.skip )
			.then( res => {
				if ( res.data ) {
					this.setState({
						user: res.data, renderProfile: true, typeOfSearch: "keyword",
						skip: this.state.skip + 1
					});
				}
			})
			.catch( err => console.log( err ));
	}

	getUsername = () => {
		api.getUserInfo( this.state.usernameSearch )
			.then( res => this.setState({ user: res.data, renderProfile: true }))
			.catch( err => console.log( err ));
	}

	handleChange = e => {
		this.setState({ [ e.target.name ]: e.target.value });
	}

	backToMenu = () => {
		this.setState({ renderProfile: false, skip: 0 });
	}

	nextUser = () => {
		switch ( this.state.typeOfSearch ) {
		case "sugested":
			this.getSugestedUser();
			break;
		case "random":
			this.getRandomUser();
			break;
		case "keyword":
			this.getKeywordUser();
			break;
		default:
			this.getSugestedUser();
		}
	}


	render() {
		if ( this.state.renderProfile ) {
			return (
				<ExploreProfile
					user={this.state.user}
					backToMenu={this.backToMenu}
					next={this.nextUser}
				/>
			);
		} else {
			return (
				<Wrapper>
					<Header>
						<UserSubheader>
							<Icon name="user" size="large" />
						</UserSubheader>
						<ContentSubheader>
							<Icon name="content" size="large" />
						</ContentSubheader>
					</Header>
					<MainComponent>
						<ExploreUsers
							getSugested={this.getSugestedUser}
							getRandom={this.getRandomUser}
							getKeywordUser={this.getKeywordUser}
							getUsername={this.getUsername}
							handleChange={this.handleChange}
						/>
					</MainComponent>
				</Wrapper>
			);
		}
	}
}

export default ExplorePage;
