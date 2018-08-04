import React, { Component } from "react";
import { Icon } from "semantic-ui-react";
import api from "../services/api";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { logout } from "../services/actions/auth";
import { switchNotifications } from "../services/actions/notifications";
import refreshToken from "../utils/refreshToken";
import validateEmail from "../utils/validateEmail";
import styled from "styled-components";
import NavBar from "../containers/NavBar";
import AccountSettings from "../components/AccountSettings";
import PasswordSettings from "../components/PasswordSettings";
import EmailSettings from "../components/EmailSettings";
import DeleteAccount from "../components/DeleteAccount";
import ContentSettings from "../components/ContentSettings";

const
	Wrapper = styled.div`
		height: 100%;
		min-height: 100vh;
		width: 100%;
		display: flex;
		justify-content: center;
		background: rgb(230, 240, 236);
	`,
	OutsideClickHandler = styled.div`
		width: 100%;
		height: 100%;
	`,
	Page = styled.div`
		height: 100vh;
		display: grid;
		margin-top: 69.33px !important;
		@media (max-width: 760px) {
			position: absolute;
			width: 100%;
			grid-template-columns: 100%;
			grid-template-rows: 100%;
			grid-template-areas:
				"opt";
		}
		@media (min-width: 760px) {
			width: 90%;
			max-width: 1000px;
			margin: 0 auto;
			grid-template-columns: 20% 80%;
			grid-template-rows: 100%;
			grid-template-areas:
				"sidebar main";
		}
`,
	Options = styled.div`
		grid-area: opt;
		background: #fff;
		::-webkit-scrollbar {
			display: none !important;
		}
		overflow-y: scroll;
		@media (min-width: 760px) {
			grid-area: sidebar;
			border-right: 1px solid rgba(0,0,0,0.1);
			z-index: 2;
		}
	`,
	Option = styled.div`
		display: flex;
		color: #111;
		font-size: 1.03rem;
		padding: 1.5rem 1rem !important;
		border-bottom: 1px solid rgba(0, 0, 0, .2);
		:hover {
			cursor: pointer;
		}
		@media (min-width: 760px) {
			border: none;
			font-weight: ${props => props.active && "600"};
		}
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
			tab: 0, userImage: { name: "test" }, headerImage: null, description: "",
			fullname: "", hobbies: [], username: "", currentPassword: "",
			newPassword: "", confirmPassword: "", currentEmail: "",
			newEmail: "", deletePassword: "", deleteFeedback: "",
			checkedCategories: [], error: "", categoriesChanged: false
		};
	}

	componentDidMount() {
		this.getUserInfo();
		if ( window.innerWidth > 760 ) {
			this.setState({ tab: 1 });
		}
	}

	getUserInfo = async() => {
		const res = await api.getUserInfo( localStorage.getItem( "username" ));
		var tagCompatibleHobbies = [];
		for ( const hobbie of res.data.hobbies ) {
			tagCompatibleHobbies.push({ text: hobbie, id: hobbie });
		}

		this.setState({
			description: res.data.description,
			fullname: res.data.fullname,
			username: res.data.username,
			hobbies: tagCompatibleHobbies,
			checkedCategories: res.data.interests
		});
	}

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
			this.resetError();
			return;
		}

		if ( file.size > 1010000 ) {
			this.setState({
				error: "The filesize limit is 1MB"
			});
			this.resetError();
			return;
		}

		this.setState({
			[ e.target.name ]: file
		});
	}

	handleChange = e =>
		this.setState({ [ e.target.name ]: e.target.value })


	updateUserInfo = async() => {
		var data = new FormData();
		const { username, fullname } = this.state;

		if ( fullname && !/[a-z\s]+$/i.test( fullname )) {
			this.setState({
				error: "Invalid fullname format. Letters and spaces only."
			});
			return;
		}
		if (( username && !/[\w]+$/.test( username )) || /[\s.]/.test( username )) {
			this.setState({
				error: "Invalid username format. Alphanumeric and underscores only."
			});
			return;
		}

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
			this.resetError();
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
		if ( !/^(?=.*\d)(?=.*[a-zA-Z]).{8,}$/.test( newPassword )) {
			this.setState({
				error: "The password must be at least 8 characters " +
				"containing letters and numbers."
			});
			return;
		}
		if ( newPassword !== confirmPassword ) {
			this.setState({ error: "Passwords don't match" });
			this.resetError();
			return;
		}
		if ( newPassword === currentPassword ) {
			this.setState({
				error: "Current password and new password can't be the same"
			});
			this.resetError();
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
			this.resetError();
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
			this.resetError();
			return;
		}
		if ( !validateEmail( newEmail )) {
			this.setState({ error: "Invalid email format" });
			this.resetError();
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
			this.resetError();
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
			this.resetError();
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

	hideNotifications = () => {
		if ( this.props.displayNotifications ) {
			this.props.switchNotifications();
		}
	}

	resetError = () => {
		setTimeout(() => {
			this.setState({ error: "" });
		}, 3000 );
	}

	render() {
		if ( this.state.tab === 1 && window.innerWidth < 760 ) {
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
		if ( this.state.tab === 2 && window.innerWidth < 760 ) {
			return (
				<ContentSettings
					updatePreferences={this.updatePreferences}
					checkedCategories={this.state.checkedCategories}
					backToMain={this.backToMain}
					handleCategoryClick={this.handleCategoryClick}
					categoriesChanged={this.state.categoriesChanged}
				/>
			);
		}
		if ( this.state.tab === 3 && window.innerWidth < 760 ) {
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
		if ( this.state.tab === 4 && window.innerWidth < 760 ) {
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
		if ( this.state.tab === 5 && window.innerWidth < 760 ) {
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
				<NavBar socket={this.props.socket} />
				<OutsideClickHandler onClick={this.hideNotifications}>
					<Page onClick={this.hidePopups}>
						<Options>
							<Option
								active={this.state.tab === 1}
								onClick={() => this.changeTab( 1 )}
							>
								Account
								<RightArrow name="angle right"/>
							</Option>
							<Option
								active={this.state.tab === 2}
								onClick={() => this.changeTab( 2 )}
							>
								Content preferences<RightArrow name="angle right"/>
							</Option>
							<Option
								active={this.state.tab === 3}
								onClick={() => this.changeTab( 3 )}
							>
								Password<RightArrow name="angle right"/>
							</Option>
							<Option
								active={this.state.tab === 4}
								onClick={() => this.changeTab( 4 )}
							>
								Email<RightArrow name="angle right"/>
							</Option>
							<Option
								active={this.state.tab === 5}
								onClick={() => this.changeTab( 5 )}
							>
								Delete account<RightArrow name="angle right"/>
							</Option>
						</Options>

						{this.state.tab === 1 && window.innerWidth > 760 &&
							<AccountSettings
								largeScreen
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
							/>}
						{this.state.tab === 2 && window.innerWidth > 760 &&
							<ContentSettings
								largeScreen
								updatePreferences={this.updatePreferences}
								checkedCategories={this.state.checkedCategories}
								backToMain={this.backToMain}
								handleCategoryClick={this.handleCategoryClick}
								categoriesChanged={this.state.categoriesChanged}
							/>
						}
						{this.state.tab === 3 && window.innerWidth > 760 &&
							<PasswordSettings
								largeScreen
								updatePassword={this.updatePassword}
								handleChange={this.handleChange}
								backToMain={this.backToMain}
								currentPassword={this.state.currentPassword}
								newPassword={this.state.newPassword}
								confirmPassword={this.state.confirmPassword}
								error={this.state.error}
							/>
						}
						{this.state.tab === 4 && window.innerWidth > 760 &&
							<EmailSettings
								largeScreen
								updateEmail={this.updateEmail}
								handleChange={this.handleChange}
								backToMain={this.backToMain}
								currentEmail={this.state.currentEmail}
								newEmail={this.state.newEmail}
								error={this.state.error}
							/>
						}
						{this.state.tab === 5 && window.innerWidth > 760 &&
							<DeleteAccount
								largeScreen
								deleteAccount={this.deleteAccount}
								handleChange={this.handleChange}
								backToMain={this.backToMain}
								deletePassword={this.state.deletePassword}
								deleteFeedback={this.state.deleteFeedback}
								error={this.state.error}
							/>
						}
					</Page>
				</OutsideClickHandler>
			</Wrapper>
		);
	}
}


SettingsPage.propTypes = {
	logout: PropTypes.func.isRequired
};

const
	mapStateToProps = state => ({
		displayNotifications: state.notifications.displayNotifications
	}),

	mapDispatchToProps = dispatch => ({
		logout: () => dispatch( logout()),
		switchNotifications: () => dispatch( switchNotifications())
	});


export default connect( mapStateToProps, mapDispatchToProps )( SettingsPage );
