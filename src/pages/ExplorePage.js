import React, { Component } from "react";
import styled from "styled-components";
import { Icon } from "semantic-ui-react";
import api from "../services/api";
import ExploreUsers from "../components/ExploreUsers";

const
	Wrapper = styled.div`
		@media (max-width: 420px) {
			height: 100vh;
			width: 100%;
			display: grid;
			grid-template-columns: 100%;
			grid-template-rows: 15% 85%;
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

		};
	}

	getSugestedUsers = () => {
		api.getSugested( localStorage.getItem( "token" ))
			.then( res => console.log( res.data ))
			.catch( err => console.log( err ));
	}

	render() {
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
					<ExploreUsers getSugested={this.getSugestedUsers} />
				</MainComponent>
			</Wrapper>
		);
	}
}

export default ExplorePage;
