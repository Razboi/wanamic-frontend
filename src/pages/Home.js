import React, { Component } from "react";
import { Button } from "semantic-ui-react";
import styled from "styled-components";
import {
	setPosts, addToPosts, switchMediaOptions, addPost, switchPostDetails,
	switchShare, setFeed, setClub, setClubs
} from "../services/actions/posts";
import { switchNotifications } from "../services/actions/notifications";
import { switchMessages } from "../services/actions/conversations";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import NewsFeed from "../components/NewsFeed";
import ClubInformation from "../components/ClubInformation";
import api from "../services/api";
import InfiniteScroll from "react-infinite-scroller";
import MediaOptions from "../containers/MediaOptions";
import NavBar from "../containers/NavBar";
import refreshToken from "../utils/refreshToken";
import CreateClubPopup from "../containers/CreateClubPopup";
import UserPreview from "../components/UserPreview";

const
	Wrapper = styled.div`
		overflow-y: auto;
		height: 100%;
		min-height: 100vh;
		width: 100%;
		padding-bottom: 300px;
		background: rgb(230, 240, 236);
		@media (max-width: 420px) {
			::-webkit-scrollbar {
				display: none !important;
			}
		};
	`,
	ShareMediaButton = styled.div`
		position: fixed;
		left: 50%;
		transform: translateX(-50%);
		bottom: 5px;
		z-index: 3;
		border-radius: 100%;
		padding: 1rem;
		background: rgba(133, 217, 191, 0.9) !important;
		display: flex;
		align-items: center;
		justify-content: center;
		:hover {
			cursor: pointer;
		}
	`,
	PlusImage = styled.span`
		height: 24px;
		width: 24px;
		display: block;
		background-image: url(${props => props.image});
		background-repeat: no-repeat;
		margin: 0;
		position: relative;
		transform: ${props => props.active ? "rotate(45deg)" : "none"};
		transition: transform 0.5s;
		background-size: 100%;
	`,
	MediaDimmer = styled.div`
		filter: ${props => props.blur ? "blur(15px)" : "none"};
		padding-top: 49.33px;
	`,
	OutsideClickHandler = styled.div`
		width: 100%;
		height: 100%;
		min-height: 100vh;
	`,
	HomeContent = styled.section`
		max-width: 1220px;
		display: flex;
		margin: 0 auto;
		@media (max-width: 900px) {
			justify-content: center;
		}
	`,
	Information = styled.div`
		color: rgba(0,0,0,0.17);
		width: 170px;
		font-size: 12px;
		text-align: center;
		margin: auto;
	`,
	Clubs = styled.div`
		margin-top: 50px;
		margin-right: 10px;
		@media (max-width: 900px) {
			display: none;
		}
	`,
	ClubSuggestions = styled.div`
		width: 300px;
		padding: 1rem;
		border-radius: 5px;
		background: #fff;
		display: flex;
		flex-direction: column;
		justify-content: center;
		margin-bottom: 1rem;
		word-break: break-word;
		div {
			margin-bottom: 1rem;
		}
		h4,h3 {
			font-family: inherit;
			color: #111;
			margin-bottom: 0.2rem;
		}
		h3 {
			margin-bottom: 1rem;
			font-weight: 200;
		}
		p {
			color: #111;
			font-weight: 200;
			font-size: 1.01rem;
		}
	`,
	CreateClub = styled.div`
		width: 300px;
		padding: 1rem;
		border-radius: 5px;
		background: #fff;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	`,
	CreateClubTitle = styled.h4`
		font-family: inherit;
		color: #111;
	`,
	CreateClubDescription = styled.p`
		color: #111;
		font-weight: 200;
		font-size: 1.01rem;
	`,
	InfoLinks = styled.ul`
		display: flex;
		padding: 0;
    list-style: none;
    justify-content: space-evenly;
		a {
			color: inherit;
		}
	`,
	Copyright = styled.h4`
		font-size: 12px;
		font-family: inherit;
		margin: 0;
		font-weight: normal;
	`,
	UserExposition = styled.div`
		margin-top: 50px;
		margin-left: 10px;
		@media (max-width: 900px) {
			display: none;
		}
	`,
	RandomUser = styled.div`
		width: 300px;
		padding: 1rem;
		border-radius: 5px;
		background: #fff;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		h2 {
			font-size: 1.28571429rem;
			margin-bottom: 1rem;
			font-weight: 200;
			font-family: inherit;
			color: #111;
		}
		h3 {
			font-family: inherit;
		}
		button {
			font-family: inherit !important;
		}
	`;


class Home extends Component {
	constructor() {
		super();
		this.state = {
			skip: 0,
			hasMore: true,
			mediaButton: true,
			chat: true,
			clubForm: false,
			clubSuggestions: [],
			clubData: {},
			randomUser: {}
		};
	}

	componentDidMount() {
		window.scrollTo( 0, 0 );
		this.initGlobalFeed();
		this.getUserClubs();
		this.getClubSuggestions();
		this.getRandomUser();
		this.props.setFeed( "global" );
		this.props.setClub( undefined );
		document.title = "Wanamic";
	}

	getRandomUser = async() => {
		try {
			const res = await api.getRandom( true );
			this.setState({ randomUser: res.data });
		} catch ( err ) {
			if ( err.response.data === "jwt expired" ) {
				await refreshToken();
				this.getRandomUser();
			} else {
				console.log( err );
			}
		}
	}

	getClubSuggestions = async() => {
		try {
			const clubs = await api.clubSuggestions();
			this.setState({ clubSuggestions: clubs.data });
		} catch ( err ) {
			if ( err.response.data === "jwt expired" ) {
				await refreshToken();
				this.getClubSuggestions();
			} else {
				console.log( err );
			}
		}
	}

	getUserClubs = async() => {
		try {
			const clubs = await api.userClubs();
			this.props.setClubs( clubs.data );
		} catch ( err ) {
			if ( err.response.data === "jwt expired" ) {
				await refreshToken();
				this.getUserClubs();
			} else {
				console.log( err );
			}
		}
	}

	getGlobalFeed = async() => {
		try {
			const posts = await api.globalFeed( this.state.skip, 10 );
			this.props.addToPosts( posts.data );
			this.setState({
				hasMore: posts.data.length === 10,
				skip: this.state.skip + 1
			});
		} catch ( err ) {
			if ( err.response.data === "jwt expired" ) {
				await refreshToken();
				this.getGlobalFeed();
			} else {
				console.log( err );
			}
		}
	}

	getHomeFeed = async() => {
		try {
			const posts = await api.homeFeed( this.state.skip, 10 );
			this.props.addToPosts( posts.data );
			this.setState({
				hasMore: posts.data.length === 10,
				skip: this.state.skip + 1
			});
		} catch ( err ) {
			if ( err.response.data === "jwt expired" ) {
				await refreshToken();
				this.getHomeFeed();
			} else {
				console.log( err );
			}
		}
	}

	getClubFeed = async() => {
		try {
			const posts = await api.clubFeed(
				this.state.skip, this.props.selectedClub );
			this.props.addToPosts( posts.data );
			this.setState({
				hasMore: posts.data.length === 10,
				skip: this.state.skip + 1
			});
		} catch ( err ) {
			if ( err.response.data === "jwt expired" ) {
				await refreshToken();
				this.getClubFeed();
			} else {
				console.log( err );
			}
		}
	}

	initGlobalFeed = async() => {
		try {
			const posts = await api.globalFeed( 0, 10 );
			this.props.setPosts( posts.data );
			this.setState({
				hasMore: posts.data.length === 10,
				skip: this.state.skip + 1
			});
		} catch ( err ) {
			if ( err.response.data === "jwt expired" ) {
				await refreshToken();
				this.initGlobalFeed();
			} else {
				console.log( err );
			}
		}
	}

	initHomeFeed = async() => {
		try {
			const posts = await api.homeFeed( 0, 10 );
			this.props.setPosts( posts.data );
			this.setState({
				hasMore: posts.data.length === 10,
				skip: this.state.skip + 1
			});
		} catch ( err ) {
			if ( err.response.data === "jwt expired" ) {
				await refreshToken();
				this.initHomeFeed();
			} else {
				console.log( err );
			}
		}
	}

	initClubFeed = async( club ) => {
		try {
			const posts = await api.clubFeed( 0, club );
			this.props.setPosts( posts.data );
			this.setState({
				hasMore: posts.data.length === 10,
				skip: this.state.skip + 1
			});
		} catch ( err ) {
			if ( err.response.data === "jwt expired" ) {
				await refreshToken();
				this.initClubFeed( club );
			} else {
				console.log( err );
			}
		}
	}

	loadMore = () => {
		if ( !this.state.hasMore ) {
			return;
		}
		switch ( this.props.feed ) {
		case "global":
			this.getGlobalFeed();
			break;
		case "home":
			this.getHomeFeed();
			break;
		case "club":
			this.getClubFeed();
			break;
		default:
			this.getGlobalFeed();
		}
	}

	initializeFeed = ( feed, club ) => {
		switch ( feed ) {
		case "global":
			this.initGlobalFeed();
			break;
		case "home":
			this.initHomeFeed();
			break;
		case "club":
			this.initClubFeed( club );
			break;
		default:
			this.initGlobalFeed();
		}
	}

	toggleMediaButton = () => {
		this.setState({ mediaButton: !this.state.mediaButton });
	}

	hidePostDetails = () => {
		this.props.switchPostDetails();
	}

	hidePopups = () => {
		if ( this.props.displayNotifications ) {
			this.props.switchNotifications();
		}
		if ( this.props.displayMessages ) {
			this.props.switchMessages();
		}
		if ( this.props.displayPostDetails ) {
			this.props.switchPostDetails();
		}
		if ( this.props.displayShare ) {
			this.props.switchShare();
		}
	}

	toggleChat = () => {
		this.setState( state => ({ chat: !state.chat }));
	}

	switchFeed = feed => {
		this.props.setFeed( feed );
		this.props.setClub( undefined );
		this.setState({ skip: 0 });
		this.initializeFeed( feed );
	}

	selectClub = club => {
		this.setState({ clubData: club, skip: 0 });
		this.props.setFeed( "club" );
		this.props.setClub( club.name );
		this.initializeFeed( "club", club.name );
	}

	switchCreateForm = () => {
		this.setState( state => ({ clubForm: !state.clubForm }));
	}

	handleUserPreviewClick = () => {
		this.props.history.push( "/" + this.state.randomUser.username );
	}

	renderClubSuggestions = ( club, index ) => {
		return (
			<div key={index}>
				<a href={`/c/${club.name}`}>
					<h4>{club.title}</h4>
					<p>{club.description}</p>
				</a>
			</div>
		);
	}

	render() {
		let
			{ clubData } = this.state,
			plusImage;

		try {
			plusImage = require( "../images/plus.svg" );
		} catch ( err ) {
			console.log( err );
		}

		return (
			<Wrapper>
				<InfiniteScroll
					pageStart={this.state.skip}
					hasMore={this.state.hasMore}
					loadMore={this.loadMore}
					initialLoad={false}
					useWindow={true}
				>

					{this.state.mediaButton &&
						<ShareMediaButton
							onClick={() => this.props.switchMediaOptions()}
						>
							<PlusImage
								image={plusImage}
								active={this.props.mediaOptions}
							/>
						</ShareMediaButton>
					}

					{this.props.mediaOptions &&
						<MediaOptions
							toggleMediaButton={this.toggleMediaButton}
							socket={this.props.socket}
						/>}

					<MediaDimmer blur={this.props.mediaOptions} >
						<NavBar socket={this.props.socket}/>

						<OutsideClickHandler onClick={this.hidePopups}>
							<HomeContent>
								<Clubs>
									{this.props.feed === "club" ?
										<ClubInformation
											clubData={clubData}
											toggleEditForm={this.toggleEditForm}
											toggleGiveUpForm={this.toggleGiveUpForm}
											joinClub={this.joinClub}
											exitClub={this.exitClub}
										/>
										:
										<React.Fragment>
											<ClubSuggestions>
												<h3>Random club suggestions</h3>
												{this.state.clubSuggestions.map( this.renderClubSuggestions )}
											</ClubSuggestions>
											<CreateClub>
												<CreateClubTitle>Create and preside a club</CreateClubTitle>
												<CreateClubDescription>
													Haven't found a club for your hobbie? You can create it so other users with the same hobbie can join.
												</CreateClubDescription>
												<Button
													primary
													content="Create"
													onClick={this.switchCreateForm}
												/>
											</CreateClub>
										</React.Fragment>
									}

									{this.state.clubForm &&
										<CreateClubPopup switchCreateForm={this.switchCreateForm} />
									}
									<Information>
										<InfoLinks>
											<li><a href="/information/privacy">Privacy</a></li>
											<li><a href="/information/terms">Terms</a></li>
											<li><a href="/information/contact">Contact</a></li>
										</InfoLinks>
										<Copyright>© 2018 WANAMIC</Copyright>
									</Information>
								</Clubs>
								<NewsFeed
									posts={this.props.feedPosts}
									socket={this.props.socket}
									history={this.props.history}
									feed={this.props.feed}
									switchFeed={this.switchFeed}
									clubs={this.props.clubs}
									selectedClub={this.props.selectedClub}
									selectClub={this.selectClub}
								/>
								<UserExposition>
									<RandomUser>
										<h2>Random user exposition</h2>
										<UserPreview
											user={this.state.randomUser}
											handleClick={this.handleUserPreviewClick}
											exposition
										/>
										<Button
											primary
											content="View profile"
											onClick={this.handleUserPreviewClick}
										/>
									</RandomUser>
								</UserExposition>
							</HomeContent>
						</OutsideClickHandler>
					</MediaDimmer>

				</InfiniteScroll>
			</Wrapper>
		);
	}
}

Home.propTypes = {
	history: PropTypes.object.isRequired,
	socket: PropTypes.object.isRequired
};

const
	mapStateToProps = state => ({
		feedPosts: state.posts.feedPosts,
		mediaOptions: state.posts.mediaOptions,
		displayMessages: state.conversations.displayMessages,
		displayNotifications: state.notifications.displayNotifications,
		feed: state.posts.feed,
		selectedClub: state.posts.selectedClub,
		clubs: state.posts.clubs
	}),

	mapDispatchToProps = dispatch => ({
		setPosts: posts => dispatch( setPosts( posts )),
		addToPosts: posts => dispatch( addToPosts( posts )),
		addPost: post => dispatch( addPost( post )),
		switchMediaOptions: () => dispatch( switchMediaOptions()),
		switchPostDetails: post => dispatch( switchPostDetails( post )),
		switchNotifications: () => dispatch( switchNotifications()),
		switchMessages: () => dispatch( switchMessages()),
		switchShare: () => dispatch( switchShare()),
		setFeed: ( feed ) => dispatch( setFeed( feed )),
		setClub: ( club ) => dispatch( setClub( club )),
		setClubs: ( clubs ) => dispatch( setClubs( clubs ))
	});

export default connect( mapStateToProps, mapDispatchToProps )( Home );
