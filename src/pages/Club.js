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
import api from "../services/api";
import InfiniteScroll from "react-infinite-scroller";
import MediaOptions from "../containers/MediaOptions";
import NavBar from "../containers/NavBar";
import refreshToken from "../utils/refreshToken";
import EditClubPopup from "../containers/EditClubPopup";

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
	ClubInformation = styled.div`
		margin-top: 1rem;
		margin-right: 10px;
	`,
	MainInfo = styled.div`
		width: 300px;
		padding: 1rem;
		border-radius: 5px;
		background: #fff;
		display: flex;
		flex-direction: column;
		justify-content: center;
		margin-bottom: 1rem;
		div {
			margin-bottom: 1rem;
		}
		h4 {
			font-family: inherit;
			color: #111;
			margin-bottom: 0.2rem;
		}
		p {
			color: #111;
			font-weight: 200;
			font-size: 1.01rem;
		}
	`,
	InfoButton = styled( Button )`
		background: ${props => props.primary ?
		"rgb(133, 217, 191)" : "#fff"} !important;
		border: ${props => !props.primary &&
			"1px solid rgb(133, 217, 191)"} !important;
		color: ${props => !props.primary && "rgb(133, 217, 191)"} !important;
	`,
	EditButton = styled( Button )`
		margin-top: 1rem !important;
	`,
	SecondaryInfo = styled.div`
		margin-top: 1rem;
		width: 300px;
		padding: 1rem;
		border-radius: 5px;
		background: #fff;
		display: flex;
		flex-direction: column;
		justify-content: center;
		h4 {
			font-family: inherit;
		}
		a {
			color: #222
		}
		span {
			color: rgba(0,0,0,0.5);
		}
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
	`;


class Club extends Component {
	constructor() {
		super();
		this.state = {
			skip: 0,
			hasMore: true,
			mediaButton: true,
			chat: true,
			clubData: undefined,
			editForm: false
		};
	}

	componentDidMount() {
		window.scrollTo( 0, 0 );
		this.getClubData();
	}

	getClubData = async() => {
		try {
			const club = await api.getClub( this.props.match.params.club );
			document.title = club.data.title;
			this.props.addToPosts( club.data.feed );
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

	exitClub = async() => {
		try {
			if ( this.state.clubData.president._id === localStorage.getItem( "id" )) {
				return;
			}
			const updatedMembers = await api.exitClub( this.state.clubData._id );
			let updatedClubData = this.state.clubData;
			updatedClubData.members = updatedMembers.data;
			this.setState({ clubData: updatedClubData });
		} catch ( err ) {
			if ( err.response.data === "jwt expired" ) {
				await refreshToken();
				this.exitClub();
			} else {
				console.log( err );
			}
		}
	}

	joinClub = async() => {
		try {
			const updatedMembers = await api.joinClub( this.state.clubData._id );
			let updatedClubData = this.state.clubData;
			updatedClubData.members = updatedMembers.data;
			this.setState({ clubData: updatedClubData });
		} catch ( err ) {
			if ( err.response.data === "jwt expired" ) {
				await refreshToken();
				this.joinClub();
			} else {
				console.log( err );
			}
		}
	}

	toggleEditForm = () => {
		this.setState( state => ({ editForm: !state.editForm }));
	}

	updateData = ( title, description ) => {
		let updatedData = this.state.clubData;
		updatedData.title = title;
		updatedData.description = description;
		this.setState({ clubData: updatedData });
		this.toggleEditForm();
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

		if ( clubData.bannedUsers.includes( localStorage.getItem( "id" ))) {
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
				{this.state.editForm &&
					<EditClubPopup
						clubId={clubData._id}
						title={clubData.title}
						description={clubData.description}
						switchForm={this.toggleEditForm}
						updateData={this.updateData}
					/>
				}
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
							<ClubContent>
								<ClubInformation>
									<MainInfo>
										<h4>{clubData.title}</h4>
										<p>{clubData.description}</p>
										{clubData.members &&
											clubData.members.includes( localStorage.getItem( "id" )) ?
											<InfoButton
												secondary
												content="ALREADY MEMBER"
												onClick={this.exitClub}
											/>
											:
											<InfoButton
												primary
												content="JOIN"
												onClick={this.joinClub}
											/>
										}
										{clubData.president._id === localStorage.getItem( "id" ) &&
										<EditButton
											content="Edit Information"
											onClick={this.toggleEditForm}
										/>
										}
									</MainInfo>
									<SecondaryInfo>
										<h4>Club president</h4>
										<a href={`/${clubData.president.username}`}>
											{clubData.president.fullname}
											<span>@{clubData.president.username}</span>
										</a>
									</SecondaryInfo>
								</ClubInformation>
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
	socket: PropTypes.object.isRequired
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
