import React, { Component } from "react";
import styled from "styled-components";
import { Icon } from "semantic-ui-react";
import { signup } from "../services/actions/auth";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import SignupForm from "../components/SignupForm";
import validateEmail from "../utils/validateEmail";
import { SectionsContainer, Section } from "react-fullpage";
import Step1 from "../components/WelcomeStep1";

const
	Wrapper = styled.div`
		height: 100%;
		background: #222233;
		display: flex;
		flex-direction: column;
		.Navigation {
			left: 20px !important;
			right: auto !important;
			transform: translate(50%, -50%) !important;
			a.active {
				background: #fff !important;
			}
		}
	`,
	SectionOne = styled.div`
		height: 100%;
		position: relative;
	`,
	BackgroundImage = styled.div`
		height: 100%;
		width: 100%;
		position: absolute;
		filter: brightness(35%);
		background-image: url(${props => props.image});
		background-repeat: no-repeat;
		background-size: cover;
		background-position: ${props => props.lastPage ? "bottom" : "center" };
	`,
	Logo = styled.span`
		z-index: 2;
		height: 100px;
		width: 200px;
		display: block;
		background-image: url(${props => props.image});
		background-repeat: no-repeat;
		background-size: 100%;
		margin: 0;
		position: absolute;
		top: 1rem;
		left: 2rem;
		@media (max-width: 800px) {
			position: static;
		}
	`,
	Header = styled.div`
		height: 100vh;
		display: grid;
		grid-template-columns: 50% 50%;
		grid-template-areas: "Text Form";
		z-index: 2;
		@media (max-width: 1450px) {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
		}
		@media (max-height: 600px) {
			justify-content: flex-start;
		}
	`,
	HeaderText = styled.div`
		grid-area: Text;
		display: flex;
    align-items: flex-end;
    justify-content: center;
    flex-direction: column;
		z-index: 2;
		@media (max-width: 1450px) {
			margin-bottom: 5rem;
			text-align: center;
		}
		@media (max-height: 600px) {
			margin: 1rem 0;
		}
		@media (max-height: 500px) {
			display: none;
		}
	`,
	Intro = styled.span`
		font-size: 2.5rem;
		color: #fff;
		line-height: 1.2;
		width: 600px;
		display: flex;
		flex-direction: column;
		@media (max-width: 800px) {
			display: none;
		}
	`,
	SmallIntro = styled.span`
		font-size: 1.5rem;
		color: #fff;
		line-height: 1.2;
		@media (min-width: 800px), (max-height: 775px) {
			display: none;
		}
	`,
	Subheader = styled.span`
		font-size: 1.65rem;
		font-weight: 200;
	`,
	HeaderForm = styled.div`
		grid-area: Form;
		display: flex;
    align-items: center;
    justify-content: center;
		@media (max-width: 420px) {
			width: 100%;
		}
	`,
	CookiesPopup = styled.div`
		position: absolute;
		margin: 0 auto;
		right: 0;
		left: 0;
		width: 33%;
		background: rgba(0,0,0,0.4);
		opacity: 0.65;
		color: #ccc;
		padding: 1rem;
		text-align: center;
		z-index: 3;
		@media (max-width: 1450px) {
			width: 400px;
			left: auto;
		}
		@media (max-width: 800px) {
			width: 100%;
		}
		@media (max-height: 600px) {
			display: none;
		}
	`,
	ClosePopup = styled( Icon )`
		margin-left: 15px !important;
		color: #ccc !important;
		:hover {
			cursor: pointer;
		}
	`,
	BottomLine = styled.a`
		position: absolute;
		z-index: 2;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 50px;
		background: #8BAFD8;
		color: #fff;
		font-size: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: inset 0 3px 0 rgba(0,0,0,.1);
		:hover {
			cursor: pointer;
			color: #fff;
		}
		@media (max-height: 500px) {
			display: none;
		}
	`,
	SectionTwo = styled.div`
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background: #618CBC;
		position: relative;
	`,
	SectionThree = styled.div`
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background: rgb(108,192,166);
		position: relative;
	`,
	SectionFour = styled.div`
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background: #222233;
		position: relative;
	`,
	SectionFive = styled.div`
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background: #222233;
		position: relative;
		text-align: center;
		@media (max-width: 500px) {
			justify-content: space-evenly;
		}
	`,
	BulletText = styled.div`
		z-index: 2;
		width: 600px;
		display: flex;
		flex-direction: column;
		color: #fff;
		margin-bottom: ${props => props.sectionFive && "3rem"};
		@media (max-width: 800px) {
			width: 90%;
		}
		@media (max-width: 500px) {
			display: ${props => props.sectionFive && "none"};
		}
	`,
	BulletHeader = styled.h1`
		font-size: 2.5rem;
		line-height: 1.2;
	`,
	BulletDescription = styled.p`
		font-size: 1.65rem;
		font-weight: 200;
	`,
	SmallScrollTaunt = styled.a`
		position: absolute;
		bottom: 1rem;
		right: 1rem;
		color: #fff;
		font-size: 2.5rem !important;
		@media (min-width: 800px) {
			display: none !important;
		}
		:hover {
			color: #fff;
		}
	`;

class Signup extends Component {
	constructor() {
		super();
		this.state = {
			email: "",
			password: "",
			username: "",
			fullname: "",
			signupStep: 1,
			error: undefined,
			showPopup: true,
			activeSection: null
		};
	}

	componentDidMount() {
		this.props.history.push( "#1" );
		this.setState({ activeSection: 0 });
	}

	handleChange = e =>
		this.setState({ [ e.target.name ]: e.target.value })

	handleSignup = () => {
		const credentials = {
			email: this.state.email.trim(), password: this.state.password,
			username: this.state.username.trim(),
			fullname: this.state.fullname.trim()
		};
		if ( !validateEmail( credentials.email )) {
			this.setState({ error: "Invalid email format" });
			return;
		}
		if ( !/^[a-zA-Z\s]+$/.test( credentials.fullname ) ||
			/[._]/.test( credentials.fullname )) {
			this.setState({
				error: "Invalid fullname format. Letters and spaces only."
			});
			return;
		}

		if ( !/[\w]+$/.test( credentials.username )
		|| /[\s.]/.test( credentials.username )) {
			this.setState({
				error: "Invalid username format. Alphanumeric and underscores only."
			});
			return;
		}
		if ( credentials.email !== "" && credentials.password !== "" &&
				credentials.username !== "" && credentials.fullname !== "" ) {
			this.props.signup( credentials )
				.then(() => this.props.history.push( "/welcome" ))
				.catch( err => {
					if ( err.response.data === "Email already registered" ) {
						this.setState({ error: err.response.data, signupStep: 1 });
						return;
					}
					if ( err.response.data === "Invalid email format" ) {
						this.setState({ error: err.response.data, signupStep: 1 });
						return;
					}
					if ( err.response.data === "Invalid password format" ) {
						this.setState({ error: err.response.data, signupStep: 1 });
						return;
					}
					this.setState({ error: err.response.data });
				});
		}
	};

	handleSignupNext = () => {
		if ( !this.state.email || !this.state.password ) {
			return;
		}
		if ( !validateEmail( this.state.email )) {
			this.setState({ error: "Invalid email format" });
			return;
		}
		if ( !/^(?=.*\d)(?=.*[a-zA-Z]).{8,}$/.test(
			this.state.password )) {
			this.setState({
				error: "The password must be at least 8 characters " +
				"containing letters and numbers."
			});
			return;
		}
		this.setState({ signupStep: 2, error: undefined });
	}

	closePopup = () => {
		this.setState({ showPopup: false });
	}

	swapForm = () => {
		this.props.history.push( "/login" );
	}

	onScroll = e => {
		if ( this.state.activeSection !== e.activeSection ) {
			this.setState({ activeSection: e.activeSection });
		}
	}

	render() {
		let options = {
			sectionClassName: "section",
			anchors: [ "1", "2", "3", "4", "5" ],
			scrollBar: false,
			navigation: window.innerWidth > 800,
			verticalAlign: false,
			arrowNavigation: true,
			lockAnchors: true
		};

		if ( this.state.signupStep === 2 ) {
			return (
				<Step1
					error={this.state.error}
					handleChange={this.handleChange}
					handleSignup={this.handleSignup}
				/>
			);
		}
		return (
			<Wrapper>
				<SectionsContainer
					className="section"
					scrollCallback={this.onScroll}
					activeSection={this.state.activeSection}
					{...options}
				>
					<Section>
						<SectionOne>
							{this.state.showPopup &&
								<CookiesPopup>
									We use cookies to provide the best possible experience. By navigating Wanamic, you agree to our use of cookies. <a href="/information/cookies">Cookies Policy</a>
									<ClosePopup name="close" onClick={this.closePopup} />
								</CookiesPopup>
							}
							<BackgroundImage
								image={require( "../images/background.jpg" )}
							/>
							<Header>
								<HeaderText>
									<Logo image={require( "../images/wanamic-logo-name.svg" )} />
									<Intro>
										Find like-minded people.
										<Subheader>
											Wanamic allows you to connect with others that share your interests and hobbies.
										</Subheader>
									</Intro>
									<SmallIntro>
										Connect with people that share your interests and hobbies.
									</SmallIntro>
								</HeaderText>
								<HeaderForm>
									<SignupForm
										error={this.state.error}
										handleChange={this.handleChange}
										swapForm={this.swapForm}
										handleSignup={this.handleSignup}
										handleSignupNext={this.handleSignupNext}
										step={this.state.signupStep}
										email={this.state.email}
										password={this.state.password}
									/>
								</HeaderForm>
							</Header>
							<BottomLine href="#2">
								Show me what it does
							</BottomLine>
						</SectionOne>
					</Section>
					<Section>
						<SectionTwo>
							<BulletText>
								<BulletHeader>
									In Wanamic connecting with users matters, not only content.
								</BulletHeader>
								<BulletDescription>
									Tired of social networks where users are just a number and there isn't real interaction?
									We created Wanamic focusing on connecting our users.
								</BulletDescription>
							</BulletText>
							<SmallScrollTaunt href="#3">
								<Icon name="arrow alternate circle down outline" />
							</SmallScrollTaunt>
						</SectionTwo>
					</Section>
					<Section>
						<SectionThree>
							<BulletText>
								<BulletHeader>
									Don't worry, content still matters.
								</BulletHeader>
								<BulletDescription>
									Watching a movie? Reading a book? Maybe listening to a great song? Share it!
									Express yourself through our 7 types of post: text, image, url, music, books, movies and shows.
								</BulletDescription>
							</BulletText>
							<SmallScrollTaunt href="#4">
								<Icon name="arrow alternate circle down outline" />
							</SmallScrollTaunt>
						</SectionThree>
					</Section>
					<Section>
						<SectionFour>
							<BulletText>
								<BulletHeader>
									Flexible social circles.
								</BulletHeader>
								<BulletDescription>
									In wanamic you have two social circles: Friends and Followers.
									You will be able to choose who sees what.
								</BulletDescription>
							</BulletText>
							<SmallScrollTaunt href="#5">
								<Icon name="arrow alternate circle down outline" />
							</SmallScrollTaunt>
						</SectionFour>
					</Section>
					<Section>
						<SectionFive>
							<BackgroundImage
								lastPage
								image={require( "../images/background2.jpg" )}
							/>
							<Logo image={require( "../images/wanamic-logo-name.svg" )} />
							<BulletText sectionFive>
								<BulletHeader>
									There is much much more.
								</BulletHeader>
								<BulletDescription>
									Why don't you see it yourself? We are waiting for you.
								</BulletDescription>
							</BulletText>
							<SignupForm
								error={this.state.error}
								handleChange={this.handleChange}
								swapForm={this.swapForm}
								handleSignup={this.handleSignup}
								handleSignupNext={this.handleSignupNext}
								step={this.state.signupStep}
								email={this.state.email}
								password={this.state.password}
							/>
						</SectionFive>
					</Section>
				</SectionsContainer>
			</Wrapper>
		);
	}
}

Signup.propTypes = {
	history: PropTypes.object.isRequired
};

export default connect( null, { signup })( Signup );
