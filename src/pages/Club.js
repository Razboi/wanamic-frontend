import React, { Component } from "react";
import { Button } from "semantic-ui-react";
import styled from "styled-components";
import {
	setPosts, addToPosts, switchMediaOptions, addPost, switchPostDetails,
	switchShare, setFeed, setClub
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

const
	Wrapper = styled.div`
		overflow-y: auto;
		height: 100%;
		min-height: 100vh;
		width: 100%;
		padding-bottom: 300px;
		@media (max-width: 420px) {
			::-webkit-scrollbar {
				display: none !important;
			}
		};
		@media (min-width: 420px) {
			background: rgb(230, 240, 236);
		}
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
	ClubContent = styled.section`
		max-width: 1220px;
		display: flex;
		margin: 0 auto;
	`,
	BannedWrapper = styled.div`
		height: 100vh;
		width: 100vw;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgb(230, 240, 236);
	`,
	BannedMessage = styled.div`
		background: #fff;
		border-radius: 5px;
		padding: 1rem;
		h4 {
			font-family: inherit;
		}
	`,
	NextButton = styled( Button )`
		position: fixed;
		bottom: 10px;
		right: 10px;
		background: rgba( 0,0,0,0.5 ) !important;
		color: #fff !important;
		z-index: 4;
	`,
	BackButton = styled( Button )`
		position: fixed;
		bottom: 10px;
		left: 10px;
		background: rgba( 0,0,0,0.5 ) !important;
		color: #fff !important;
		z-index: 4;
	`;


class Club extends Component {
	constructor( props ) {
		super( props );
		this.state = {
			skip: 0,
			hasMore: true,
			mediaButton: true,
			chat: true,
			clubData: props.clubData
		};
	}

	componentDidMount() {
		window.scrollTo( 0, 0 );
		if ( this.props.explore ) {
			this.setExploreClubData();
		} else {
			this.getClubData();
		}
	}

	componentDidUpdate( prevProps, prevState ) {
		if ( this.props.clubData !== prevProps.clubData ) {
			this.setExploreClubData();
			this.setState({ clubData: this.props.clubData });
		}
	}

	setExploreClubData = async() => {
		try {
			document.title = "Explore: " + this.props.clubData.title;
			this.props.setPosts( this.props.clubData.feed );
			this.props.setFeed( "club" );
			this.props.setClub( this.props.clubData.name );
			this.setState({
				hasMore: this.props.clubData.feed.length === 10,
				skip: this.state.skip++
			});
		} catch ( err ) {
			console.log( err );
		}
	}

	getClubData = async() => {
		try {
			const club = await api.getClub( this.props.match.params.club );
			document.title = club.data.title;
			this.props.setPosts( club.data.feed );
			this.props.setFeed( "club" );
			this.props.setClub( club.data.name );
			this.setState({
				hasMore: club.data.feed.length === 10,
				skip: this.state.skip++,
				clubData: club.data
			});
		} catch ( err ) {
			if ( err.response.data === "jwt expired" ) {
				await refreshToken();
				this.getClubData();
			} else {
				console.log( err );
			}
		}
	}

	getClubFeed = async() => {
		try {
			const posts = await api.globalFeed( this.state.skip, 10 );
			this.props.addToPosts( posts.data, true );
			this.setState({
				hasMore: posts.data.length === 10,
				skip: this.state.skip++
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

	initClubFeed = async( club ) => {
		try {
			const posts = await api.clubFeed( 0, club );
			this.props.setPosts( posts.data, true );
			this.setState({
				hasMore: posts.data.length === 10
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

	render() {
		let
			{ clubData } = this.state,
			plusImage;

		try {
			plusImage = require( "../images/plus.svg" );
		} catch ( err ) {
			console.log( err );
		}

		if ( !clubData ) {
			return null;
		}

		if ( clubData.bannedUsers &&
			clubData.bannedUsers.includes( localStorage.getItem( "id" ))) {
			return (
				<BannedWrapper>
					<BannedMessage>
						<h4>You are banned from this club.</h4>
					</BannedMessage>
				</BannedWrapper>
			);
		}

		return (
			<Wrapper>
				<InfiniteScroll
					pageStart={this.state.skip}
					hasMore={this.state.hasMore}
					loadMore={this.getClubFeed}
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
							<ClubContent>
								<ClubInformation
									clubData={clubData}
									toggleEditForm={this.toggleEditForm}
									toggleGiveUpForm={this.toggleGiveUpForm}
									joinClub={this.joinClub}
									exitClub={this.exitClub}
								/>
								<NewsFeed
									clubAdmin={clubData.president._id === localStorage.getItem( "id" )}
									posts={this.props.feedPosts}
									socket={this.props.socket}
									history={this.props.history}
									feed={this.props.feed}
									switchFeed={this.switchFeed}
									clubs={this.props.clubs}
									selectedClub={this.props.selectedClub}
									selectClub={this.selectClub}
									hideTabs
								/>
								{this.props.displayButtons &&
									<React.Fragment>
										<NextButton
											circular
											icon="angle double right"
											size="large"
											onClick={this.props.next}
										/>
										<BackButton
											circular
											icon="close"
											size="large"
											onClick={this.props.back}
										/>
									</React.Fragment>
								}
							</ClubContent>
						</OutsideClickHandler>
					</MediaDimmer>

				</InfiniteScroll>
			</Wrapper>
		);
	}
}

Club.propTypes = {
	history: PropTypes.object.isRequired,
	socket: PropTypes.object.isRequired,
	clubData: PropTypes.object,
	displayButtons: PropTypes.bool,
	explore: PropTypes.bool
};

const
	mapStateToProps = state => ({
		feedPosts: state.posts.feedPosts,
		mediaOptions: state.posts.mediaOptions,
		displayMessages: state.conversations.displayMessages,
		displayNotifications: state.notifications.displayNotifications,
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
		setClub: ( club ) => dispatch( setClub( club ))
	});

export default connect( mapStateToProps, mapDispatchToProps )( Club );
