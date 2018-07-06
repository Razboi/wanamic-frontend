import React, { Component } from "react";
import { Icon } from "semantic-ui-react";
import api from "../services/api";
import refreshToken from "../utils/refreshToken";
import setUserKw from "../utils/setUserKWs";
import styled from "styled-components";
import AccountSettings from "../components/AccountSettings";

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
		font-size: 1.28rem;
	`,
	Options = styled.div`
		grid-area: opt;
		::-webkit-scrollbar {
			display: none !important;
		}
		overflow-y: scroll;
	`,
	Option = styled.div`
		display: flex;
		font-size: 1.03rem;
		padding: 1.5rem 1rem !important;
		border-bottom: 1px solid rgba(0, 0, 0, .2);
	`,
	RightArrow = styled( Icon )`
		font-size: 1.15rem !important;
		margin: 0 0 0 auto !important;
		color: rgba(0, 0, 0, .5);
	`;

class SettingsPage extends Component {
	constructor() {
		super();
		this.state = {
			tab: 0,
			userImage: null,
			headerImage: null,
			description: "",
			fullname: "",
			keywords: "",
			username: ""
		};
	}

	componentDidMount() {
		api.getUserInfo( localStorage.getItem( "username" ))
			.then( res => {
				var keywordsString = res.data.keywords.toString().replace( /,/g, " #" );
				this.setState({
					description: res.data.description,
					fullname: res.data.fullname,
					username: res.data.username,
					keywords: keywordsString
				});
			}).catch( err => console.log( err ));
	}

	handleFileChange = e => {
		this.setState({
			[ e.target.name ]: e.target.files[ 0 ]
		});
	}

	handleChange = e =>
		this.setState({ [ e.target.name ]: e.target.value })


	handleSubmit = () => {
		var data = new FormData();
		data.append( "userImage", this.state.userImage );
		data.append( "headerImage", this.state.headerImage );
		data.append( "description", this.state.description );
		data.append( "fullname", this.state.fullname );
		data.append( "username", this.state.username );
		data.append( "token", localStorage.getItem( "token" ));

		this.setInfo( data );
	}

	setInfo = data => {
		api.setUserInfo( data )
			.then( res => {
				if ( res === "jwt expired" ) {
					refreshToken()
						.then(() => {
							data.set( "token", localStorage.getItem( "token" ));
							this.setInfo( data );
						})
						.catch( err => console.log( err ));
				} else if ( res ) {
					setUserKw( this.state.keywords );
				}
			}).catch( err => console.log( err ));
	}

	backToMain = () => {
		this.setState({ tab: 0 });
	}

	changeTab = tabNumber => {
		this.setState({ tab: tabNumber });
	}

	render() {
		if ( this.state.tab === 1 ) {
			return (
				<AccountSettings
					handleSubmit={this.handleSubmit}
					handleFileChange={this.handleFileChange}
					handleChange={this.handleChange}
					backToMain={this.backToMain}
					keywords={this.state.keywords}
					description={this.state.description}
					username={this.state.username}
					fullname={this.state.fullname}
				/>
			);
		}
		return (
			<Wrapper>
				<HeaderWrapper>
					<BackArrow
						name="arrow left"
						onClick={() => this.props.history.push( "/" )}
					/>
					<HeaderTxt>Settings</HeaderTxt>
				</HeaderWrapper>
				<Options>
					<Option onClick={() => this.changeTab( 1 )}>
						Account
						<RightArrow name="angle right"/>
					</Option>
					<Option>
						Content preferences<RightArrow name="angle right"/>
					</Option>
					<Option>
						Password<RightArrow name="angle right"/>
					</Option>
					<Option>
						Email<RightArrow name="angle right"/>
					</Option>
					<Option>
						Delete account<RightArrow name="angle right"/>
					</Option>
				</Options>
			</Wrapper>
		);
	}
}

export default SettingsPage;
