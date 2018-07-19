import React, { Component } from "react";
import { Icon } from "semantic-ui-react";
import api from "../services/api";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { logout } from "../services/actions/auth";
import refreshToken from "../utils/refreshToken";
import validateEmail from "../utils/validateEmail";
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
			fullname: "", hobbies: [], username: "", currentPassword: "",
			newPassword: "", confirmPassword: "", currentEmail: "",
			newEmail: "", deletePassword: "", deleteFeedback: "",
			checkedCategories: [], error: "", categoriesChanged: false
		};
	}

	async componentDidMount() {
		const res = await api.getUserInfo( localStorage.getItem( "username" ));
		this.setState({
			description: res.data.description,
			fullname: res.data.fullname,
			username: res.data.username,
			hobbies: res.data.hobbies,
			checkedCategories: res.data.interests
		});
	}

	handleFileChange = e => {
		this.setState({
			[ e.target.name ]: e.target.files[ 0 ]
		});
	}

	handleChange = e =>
		this.setState({ [ e.target.name ]: e.target.value })


	updateUserInfo = async() => {
		var data = new FormData();
		data.append( "userImage", this.state.userImage );
		data.append( "headerImage", this.state.headerImage );
		data.append( "description", this.state.description );
		data.append( "fullname", this.state.fullname );
		data.append( "username", this.state.username );
		data.append( "token", localStorage.getItem( "token" ));

		try {
			await api.setUserKw( this.state.hobbies );
			const res = await api.setUserInfo( data );
			if ( res.data.newImage ) {
				localStorage.setItem( "uimg", res.data.newImage );
			}
			if ( res.data.newUsername ) {
				localStorage.setItem( "username", res.data.newUsername );
			}
			this.backToMain();
		} catch ( err ) {
			console.log( err );
			if ( err.response.data === "jwt expired" ) {
				await refreshToken();
				this.updateUserInfo();
				return;
			}
			this.setState({ error: err.response.data });
		}
	}

	backToMain = () => {
		this.setState({ tab: 0, error: "" });
	}

	changeTab = tabNumber => {
		this.setState({ tab: tabNumber });
	}

	updatePassword = async() => {
		const
			{ currentPassword, newPassword, confirmPassword } = this.state;
		if ( !currentPassword || !newPassword || !confirmPassword ) {
			return;
		}
		if ( newPassword !== confirmPassword ) {
			this.setState({ error: "Passwords don't match" });
			return;
		}
		if ( newPassword === currentPassword ) {
			this.setState({
				error: "Current password and new password can't be the same"
			});
			return;
		}
		try {
			await api.updatePassword(
				currentPassword, newPassword );
			this.setState({
				currentPassword: "",
				newPassword: "",
				confirmPassword: "",
				tab: 0,
				error: ""
			});
		} catch ( err ) {
			if ( err.response.data === "jwt expired" ) {
				await refreshToken();
				this.updatePassword();
				return;
			}
			this.setState({ error: err.response.data });
		}
	}

	updateEmail = async() => {
		const { currentEmail, newEmail } = this.state;
		if ( !currentEmail || !newEmail ) {
			return;
		}
		if ( currentEmail === newEmail ) {
			this.setState({
				error: "Current email and new email can't be the same"
			});
			return;
		}
		if ( !validateEmail( newEmail )) {
			this.setState({ error: "Invalid email format" });
			return;
		}
		try {
			await api.updateEmail(
				currentEmail, newEmail );
			this.setState({
				currentEmail: "", newEmail: "", tab: 0, error: ""
			});
		} catch ( err ) {
			if ( err.response.data === "jwt expired" ) {
				await refreshToken();
				this.updateEmail();
				return;
			}
			this.setState({ error: err.response.data });
		}
	}

	deleteAccount = async() => {
		const { deletePassword, deleteFeedback } = this.state;
		if ( !deletePassword ) {
			return;
		}
		try {
			await api.deleteAccount(
				deletePassword, deleteFeedback );
			this.props.logout();
		} catch ( err ) {
			if ( err.response.data === "jwt expired" ) {
				await refreshToken();
				this.deleteAccount();
				return;
			}
			this.setState({ error: err.response.data });
		}
	}

	handleCategoryClick = category => {
		var arrayOfChecked = this.state.checkedCategories;
		if ( arrayOfChecked.includes( category )) {
			const index = arrayOfChecked.indexOf( category );
			arrayOfChecked.splice( index, 1 );
			this.setState({
				checkedCategories: arrayOfChecked,
				categoriesChanged: true
			});
		} else {
			this.setState({
				checkedCategories: [ ...arrayOfChecked, category ],
				categoriesChanged: true
			});
		}
	}

	updatePreferences = async() => {
		const { checkedCategories, categoriesChanged } = this.state;
		if ( checkedCategories.length <= 0 || !categoriesChanged ) {
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

	render() {
		if ( this.state.tab === 1 ) {
			return (
				<AccountSettings
					updateUserInfo={this.updateUserInfo}
					handleFileChange={this.handleFileChange}
					handleChange={this.handleChange}
					backToMain={this.backToMain}
					hobbies={this.state.hobbies}
					handleDelete={this.handleDelete}
					handleAddition={this.handleAddition}
					description={this.state.description}
					username={this.state.username}
					fullname={this.state.fullname}
					error={this.state.error}
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
					categoriesChanged={this.state.categoriesChanged}
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
					error={this.state.error}
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
					error={this.state.error}
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
					error={this.state.error}
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
