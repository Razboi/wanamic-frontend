import React, { Component } from "react";
import styled from "styled-components";
import { Button } from "semantic-ui-react";
import api from "../services/api";
import ExploreUsers from "../components/ExploreUsers";
import ExploreClubs from "../components/ExploreClubs";
import Profile from "./Profile";
import Club from "./Club";
import NavBar from "../containers/NavBar";
import refreshToken from "../utils/refreshToken";
import { setPosts, addToPosts, switchPostDetails
} from "../services/actions/posts";
import { switchNotifications } from "../services/actions/notifications";
import { switchMessages } from "../services/actions/conversations";
import { connect } from "react-redux";

const
	Wrapper = styled.div`
		overflow-y: auto;
		height: 100%;
		width: 100%;
		@media (max-width: 420px) {
			::-webkit-scrollbar {
				display: none !important;
			}
		};
		@media (min-width: 420px) {
			background: rgb(230, 240, 236);
		};
	`,
	PageContent = styled.div`
		height: 100%;
		min-height: 100vh;
		width: 100%;
		max-width: 1500px;
		margin: auto;
		margin-top: 49.33px;
		display: flex;
		align-items: center;
		justify-content: space-evenly;
	`,
	ExploreUsersButton = styled( Button )`
		font-family: inherit !important;
		background: rgb(133, 217, 191) !important;
		border-radius: 2px !important;
	`,
	ExploreClubsButton = styled( Button )`
		font-family: inherit !important;
		border-radius: 2px !important;
	`;


class ExplorePage extends Component {
	constructor() {
		super();
		this.state = {
			hobbies: "",
			usernameSearch: "",
			renderProfile: false,
			renderClub: false,
			typeOfSearch: "",
			userSkip: 0,
			hasMore: true,
			user: {},
			clubSearch: "",
			type: "",
			clubData: {},
			multiple: false,
			messageTarget: undefined,
			userSuggestions: undefined,
			loadingUsers: false,
			clubSuggestions: undefined,
			loadingClubs: false
		};
	}

	componentDidMount() {
		window.scrollTo( 0, 0 );
		document.title = "Explore";
	}


	getRandomUser = async() => {
		try {
			const res = await api.getRandom();
			this.setState({
				user: res.data,
				renderProfile: true,
				typeOfSearch: "random"
			});
		} catch ( err ) {
			if ( err.response.data === "jwt expired" ) {
				await refreshToken();
				this.getRandomUser();
			} else {
				console.log( err );
			}
		}
	}

	matchHobbies = () => {
		api.matchHobbies( this.state.hobbies, this.state.userSkip )
			.then( res => {
				if ( res === "jwt expired" ) {
					refreshToken()
						.then(() => this.matchHobbies())
						.catch( err => console.log( err ));
				} else if ( res.data ) {
					this.setState({
						user: res.data, renderProfile: true, typeOfSearch: "hobbie",
						skip: this.state.userSkip + 1
					});
				}
			}).catch( err => console.log( err ));
	}

	handleChange = e => {
		this.getSearchSuggestions( e.target.name, e.target.value );
		this.setState({ [ e.target.name ]: e.target.value });
	}

	getSearchSuggestions = ( type, value ) => {
		switch ( type ) {
		case "usernameSearch":
			this.getUserSuggestions( value );
			break;
		case "clubSearch":
			this.getClubSuggestions( value );
			break;
		default:
			this.getUserSuggestions( value );
		}
	}

	getUserSuggestions = async value => {
		if ( !value ) {
			this.setState({
				userSuggestions: undefined,
				loadingUsers: false
			});
			return;
		}
		try {
			this.setState({ loading: true });
			const userSuggestions = await api.getUserSuggestions( value );
			this.setState({
				userSuggestions: userSuggestions.data,
				loadingUsers: false
			});
		} catch ( err ) {
			if ( err.response.data === "jwt expired" ) {
				await refreshToken();
				this.getUserSuggestions( value );
			} else {
				console.log( err );
			}
		}
	}


	getClubSuggestions = async value => {
		if ( !value ) {
			this.setState({
				clubSuggestions: undefined,
				loadingClubs: false
			});
			return;
		}
		try {
			this.setState({ loadingClubs: true });
			const clubSuggestions = await api.getClubSuggestions( value );
			this.setState({
				clubSuggestions: clubSuggestions.data,
				loadingClubs: false
			});
		} catch ( err ) {
			if ( err.response.data === "jwt expired" ) {
				await refreshToken();
				this.getClubSuggestions( value );
			} else {
				console.log( err );
			}
		}
	}

	backToMenu = () => {
		this.setState({
			renderProfile: false,
			renderClub: false,
			skip: 0,
			multiple: false
		});
	}

	nextUser = () => {
		switch ( this.state.typeOfSearch ) {
		case "sugested":
			this.getSuggestedUser();
			break;
		case "random":
			this.getRandomUser();
			break;
		case "hobbie":
			this.matchHobbies();
			break;
		default:
			this.getSuggestedUser();
		}
	}

	handleKeyPress = e => {
		if ( e.key === "Enter" ) {
			if ( this.state.search ) {
				this.setState({ searching: true, skip: 1 });
				this.searchContent();
			} else if ( this.state.searching ) {
				this.setState({ searching: false, skip: 1 });
				this.refreshPosts();
			}
		}
	}

	hidePopups = () => {
		if ( this.props.displayNotifications ) {
			this.props.switchNotifications();
		}
		if ( this.props.displayMessages ) {
			this.props.switchMessages();
		}
	}

	displayUsers = () => {
		this.setState({ type: "users" });
	}

	displayClubs = () => {
		this.setState({ type: "clubs" });
	}

	randomClub = async() => {
		try {
			const club = await api.randomClub();
			this.setState({
				clubData: club.data,
				renderClub: true,
				multiple: true
			});
		} catch ( err ) {
			if ( err.response.data === "jwt expired" ) {
				await refreshToken();
				this.randomClub();
			} else {
				console.log( err );
			}
		}
	}

	startChat = messageTarget => {
		this.setState({ messageTarget: messageTarget });
	}

	chatMatchmaking = async() => {
		try {
			const user = await api.chatMatchmaking();
			this.startChat( user.data );
		} catch ( err ) {
			if ( err.response.data === "jwt expired" ) {
				await refreshToken();
				this.chatMatchmaking();
			} else {
				console.log( err );
			}
		}
	}


	render() {
		if ( this.state.renderProfile ) {
			return (
				<Profile
					user={this.state.user}
					backToMenu={this.backToMenu}
					next={this.nextUser}
					explore={true}
					socket={this.props.socket}
					history={this.props.history}
				/>
			);
		}
		if ( this.state.renderClub ) {
			return (
				<Club
					clubData={this.state.clubData}
					explore={true}
					displayButtons={this.state.multiple}
					next={this.randomClub}
					back={this.backToMenu}
					socket={this.props.socket}
					history={this.props.history}
				/>
			);
		}
		if ( window.innerWidth < 1300 ) {
			return (
				this.state.type ?
					<Wrapper>
						<NavBar
							socket={this.props.socket}
							messageTarget={this.state.messageTarget}
							startChat={this.startChat}
						/>

						<PageContent onClick={this.hidePopups}>
							{this.state.type === "users" ?
								<ExploreUsers
									history={this.props.history}
									getRandom={this.getRandomUser}
									matchHobbies={this.matchHobbies}
									handleChange={this.handleChange}
									chatMatchmaking={this.chatMatchmaking}
									searchSuggestions={this.state.userSuggestions}
									loading={this.state.loadingUsers}
								/>
								:
								<ExploreClubs
									history={this.props.history}
									randomClub={this.randomClub}
									handleChange={this.handleChange}
									searchSuggestions={this.state.clubSuggestions}
									loading={this.state.loadingClubs}
								/>
							}
						</PageContent>
					</Wrapper>
					:
					<Wrapper>
						<PageContent>
							<ExploreUsersButton
								primary
								content="Explore Users"
								onClick={this.displayUsers}
							/>
							<ExploreClubsButton
								primary
								content="Explore Clubs"
								onClick={this.displayClubs}
							/>
						</PageContent>
					</Wrapper>
			);
		}
		return (
			<Wrapper>
				<NavBar
					socket={this.props.socket}
					profilePage
					messageTarget={this.state.messageTarget}
					startChat={this.startChat}
				/>

				<PageContent onClick={this.hidePopups}>
					<ExploreUsers
						history={this.props.history}
						getRandom={this.getRandomUser}
						matchHobbies={this.matchHobbies}
						handleChange={this.handleChange}
						chatMatchmaking={this.chatMatchmaking}
						searchSuggestions={this.state.userSuggestions}
						loading={this.state.loadingUsers}
					/>
					<ExploreClubs
						history={this.props.history}
						randomClub={this.randomClub}
						handleChange={this.handleChange}
						searchSuggestions={this.state.clubSuggestions}
						loading={this.state.loadingClubs}
					/>
				</PageContent>
			</Wrapper>
		);
	}
}

const
	mapStateToProps = state => ({
		posts: state.posts.explore,
		displayMessages: state.conversations.displayMessages,
		displayNotifications: state.notifications.displayNotifications
	}),

	mapDispatchToProps = dispatch => ({
		setPosts: ( posts, onExplore ) =>
			dispatch( setPosts( posts, onExplore )),
		addToPosts: ( posts, onExplore ) =>
			dispatch( addToPosts( posts, onExplore )),
		switchPostDetails: post => dispatch( switchPostDetails( post )),
		switchNotifications: () => dispatch( switchNotifications()),
		switchMessages: () => dispatch( switchMessages())
	});


export default connect( mapStateToProps, mapDispatchToProps )( ExplorePage );
