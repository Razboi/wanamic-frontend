import React, { Component } from "react";
import { Icon } from "semantic-ui-react";
import api from "../services/api";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { logout } from "../services/actions/auth";
import refreshToken from "../utils/refreshToken";
import setUserKw from "../utils/setUserKWs";
import styled from "styled-components";
import AccountSettings from "../components/AccountSettings";
import PasswordSettings from "../components/PasswordSettings";
import EmailSettings from "../components/EmailSettings";
import DeleteAccount from "../components/DeleteAccount";
import ContentSettings from "../components/ContentSettings";

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
	`,
	categories = [
		"Art", "Technology", "Cooking", "Science", "Travel", "Films", "Health",
		"Fitness", "Beauty", "Humor", "Business", "Music", "Photography", "TV",
		"Family", "Sports", "Gaming", "Motor", "Books", "Pets", "Fashion"
	];

class SettingsPage extends Component {
	constructor() {
		super();
		this.state = {
			tab: 0, userImage: null, headerImage: null, description: "",
			fullname: "", keywords: "", username: "", currentPassword: "",
			newPassword: "", confirmPassword: "", currentEmail: "",
			newEmail: "", deletePassword: "", deleteFeedback: "",
			checkedCategories: []
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
					keywords: keywordsString,
					checkedCategories: res.data.interests
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

	updatePassword = async() => {
		const
			{ currentPassword, newPassword, confirmPassword } = this.state;
		if ( !currentPassword || !newPassword || !confirmPassword ) {
			console.log( "Empty data" );
			return;
		}
		if ( newPassword !== confirmPassword ) {
			console.log( "Passwords don't match" );
			return;
		}
		if ( newPassword === currentPassword ) {
			console.log( "Current password and new password can't be the same" );
			return;
		}
		const response = await api.updatePassword(
			currentPassword, newPassword
		);
		if ( response === "jwt expired" ) {
			try {
				await refreshToken();
			} catch ( err ) {
				console.log( err );
			}
			this.updatePassword();
		} else {
			this.setState({
				currentPassword: "",
				newPassword: "",
				confirmPassword: ""
			});
		}
	}

	updateEmail = async() => {
		const { currentEmail, newEmail } = this.state;
		if ( !currentEmail || !newEmail ) {
			console.log( "Empty data" );
			return;
		}
		if ( currentEmail === newEmail ) {
			console.log( "Current email and new email can't be the same" );
			return;
		}
		const response = await api.updateEmail(
			currentEmail, newEmail
		);
		if ( response === "jwt expired" ) {
			try {
				await refreshToken();
			} catch ( err ) {
				console.log( err );
			}
			this.updateEmail();
		} else {
			this.setState({ currentEmail: "", newEmail: "" });
		}
	}

	deleteAccount = async() => {
		const { deletePassword, deleteFeedback } = this.state;
		if ( !deletePassword ) {
			console.log( "Empty data" );
			return;
		}
		const response = await api.deleteAccount(
			deletePassword, deleteFeedback );
		if ( response === "jwt expired" ) {
			try {
				await refreshToken();
			} catch ( err ) {
				console.log( err );
			}
			this.deleteAccount();
		} else {
			this.props.logout();
		}
	}

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

	updatePreferences = async() => {
		const { checkedCategories } = this.state;
		if ( checkedCategories.length <= 0 ) {
			console.log( "Empty data" );
			return;
		}
		const response = await api.updateInterests( checkedCategories );
		if ( response === "jwt expired" ) {
			try {
				await refreshToken();
			} catch ( err ) {
				console.log( err );
			}
			this.updatePreferences();
		} else {
			this.setState({ tab: 0 });
		}
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
		if ( this.state.tab === 2 ) {
			return (
				<ContentSettings
					updatePreferences={this.updatePreferences}
					checkedCategories={this.state.checkedCategories}
					backToMain={this.backToMain}
					categories={categories}
					handleCategoryClick={this.handleCategoryClick}
				/>
			);
		}
		if ( this.state.tab === 3 ) {
			return (
				<PasswordSettings
					updatePassword={this.updatePassword}
					handleChange={this.handleChange}
					backToMain={this.backToMain}
					currentPassword={this.state.currentPassword}
					newPassword={this.state.newPassword}
					confirmPassword={this.state.confirmPassword}
				/>
			);
		}
		if ( this.state.tab === 4 ) {
			return (
				<EmailSettings
					updateEmail={this.updateEmail}
					handleChange={this.handleChange}
					backToMain={this.backToMain}
					currentEmail={this.state.currentEmail}
					newEmail={this.state.newEmail}
				/>
			);
		}
		if ( this.state.tab === 5 ) {
			return (
				<DeleteAccount
					deleteAccount={this.deleteAccount}
					handleChange={this.handleChange}
					backToMain={this.backToMain}
					deletePassword={this.state.deletePassword}
					deleteFeedback={this.state.deleteFeedback}
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
					<Option onClick={() => this.changeTab( 2 )}>
						Content preferences<RightArrow name="angle right"/>
					</Option>
					<Option onClick={() => this.changeTab( 3 )}>
						Password<RightArrow name="angle right"/>
					</Option>
					<Option onClick={() => this.changeTab( 4 )}>
						Email<RightArrow name="angle right"/>
					</Option>
					<Option onClick={() => this.changeTab( 5 )}>
						Delete account<RightArrow name="angle right"/>
					</Option>
				</Options>
			</Wrapper>
		);
	}
}


SettingsPage.propTypes = {
	logout: PropTypes.func.isRequired
};

const
	mapStateToProps = state => ({
	}),

	mapDispatchToProps = dispatch => ({
		logout: () => dispatch( logout())
	});


export default connect( mapStateToProps, mapDispatchToProps )( SettingsPage );
