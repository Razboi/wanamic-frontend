import React, { Component } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import { Icon } from "semantic-ui-react";
import { signup } from "../services/actions/auth";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import SignupForm from "../components/SignupForm";
import validateEmail from "../utils/validateEmail";
import Step1 from "../components/WelcomeStep1";

const
	Wrapper = styled.div`
		height: 100%;
		background: #222233;
		display: flex;
		flex-direction: column;
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
		margin: auto;
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
	Intro = styled.h1`
		font-family: inherit;
		font-size: 2.5rem;
		font-weight: 400;
		color: #fff;
		line-height: 1.2;
		width: 600px;
		display: flex;
		flex-direction: column;
		@media (max-width: 800px) {
			display: none;
		}
	`,
	Subheader = styled.h2`
		font-size: 1.65rem;
		font-weight: 200;
		width: 600px;
		color: #fff;
		line-height: 1.2;
		font-family: inherit;
		margin: 0;
		@media (max-width: 800px) {
			display: none;
		}
	`,
	SmallIntro = styled.h1`
		font-size: 1.5rem;
		font-weight: 200;
		color: #fff;
		line-height: 1.2;
		@media (min-width: 800px), (max-height: 775px) {
			display: none;
		}
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
		height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background: #618CBC;
		position: relative;
	`,
	SectionThree = styled.div`
		height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background: rgb(108,192,166);
		position: relative;
	`,
	SectionFour = styled.div`
		height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background: #222233;
		position: relative;
	`,
	SectionFive = styled.div`
		height: 100vh;
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
	BulletDescription = styled.h2`
		font-size: 1.65rem;
		font-weight: 200;
		font-family: inherit;
		margin-top: 0.5rem;
	`,
	SmallScrollTaunt = styled.a`
		position: absolute;
		bottom: 1rem;
		right: 1rem;
		color: #fff;
		font-size: 2.5rem !important;
		:hover {
			color: #fff;
			cursor: pointer;
		}
		@media (min-width: 550px) {
			right: auto;
			left: 50%;
			transform: translateX( -50% );
			font-size: 2.7rem !important;
			bottom: 2rem;
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
			showPopup: true
		};
		this.section2Ref = React.createRef();
		this.section3Ref = React.createRef();
		this.section4Ref = React.createRef();
		this.section5Ref = React.createRef();
	}

	componentDidMount() {
		document.title = "Wanamic - Make friends online with your same interests.";
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
		if ( !credentials.fullname ) {
			this.setState({
				error: "Full name is required."
			});
			return;
		}

		if ( !/[\w]+$/.test( credentials.username )
		|| /[\s.]/.test( credentials.username )) {
			this.setState({
				error: "Invalid username format. Alphanumeric characters only. No spaces."
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

	scrollTo = ( ref ) => {
		const domNode = ReactDOM.findDOMNode( ref.current );
		domNode.scrollIntoView({ behavior: "smooth" });
	}

	render() {
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
								Make new friends online.
							</Intro>
							<Subheader>
								Wanamic allows you to connect with like-minded people who share your interests and hobbies.
							</Subheader>
							<SmallIntro>
								Connect with like-minded people who share your interests and hobbies.
							</SmallIntro>
						</HeaderText>
						<HeaderForm>
							<SignupForm
								error={this.state.error}
								handleChange={this.handleChange}
								handleSignup={this.handleSignup}
								handleSignupNext={this.handleSignupNext}
								step={this.state.signupStep}
								email={this.state.email}
								password={this.state.password}
							/>
						</HeaderForm>
					</Header>
					<BottomLine onClick={() => this.scrollTo( this.section2Ref )}>
						Show me what it does
					</BottomLine>
				</SectionOne>
				<SectionTwo ref={this.section2Ref}>
					<BulletText>
						<BulletHeader>
							Make new friends with our matchmaking tools.
						</BulletHeader>
						<BulletDescription>
							You will be able to explore profiles of users who share your interests.
							You can send them a friend request or start a conversation at any time.
							In Wanamic, making new friends matters, not just content.
						</BulletDescription>
					</BulletText>
					<SmallScrollTaunt
						onClick={() => this.scrollTo( this.section3Ref )}
					>
						<Icon name="arrow alternate circle down outline" />
					</SmallScrollTaunt>
				</SectionTwo>
				<SectionThree ref={this.section3Ref}>
					<BulletText>
						<BulletHeader>
							Join clubs to find new friends.
						</BulletHeader>
						<BulletDescription>
							You can join and create clubs focused on hobbies, there you can connect with other members or discover and share content.
							Finding friends with your same hobby has never been so easy!
						</BulletDescription>
					</BulletText>
					<SmallScrollTaunt
						onClick={() => this.scrollTo( this.section4Ref )}
					>
						<Icon name="arrow alternate circle down outline" />
					</SmallScrollTaunt>
				</SectionThree>
				<SectionFour ref={this.section4Ref}>
					<BulletText>
						<BulletHeader>
							Express yourself through our 7 types of post.
						</BulletHeader>
						<BulletDescription>
							Watching a movie? Reading a book? Maybe listening to a great song? Share it!
							Once you make friends you can share everything with them.
						</BulletDescription>
					</BulletText>
					<SmallScrollTaunt
						onClick={() => this.scrollTo( this.section5Ref )}
					>
						<Icon name="arrow alternate circle down outline" />
					</SmallScrollTaunt>
				</SectionFour>
				<SectionFive ref={this.section5Ref}>
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
						handleSignup={this.handleSignup}
						handleSignupNext={this.handleSignupNext}
						step={this.state.signupStep}
						email={this.state.email}
						password={this.state.password}
					/>
				</SectionFive>
			</Wrapper>
		);
	}
}

Signup.propTypes = {
	history: PropTypes.object.isRequired
};

export default connect( null, { signup })( Signup );
