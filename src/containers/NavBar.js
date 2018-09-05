import React, { Component } from "react";
import { Label, Dropdown, Image } from "semantic-ui-react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { logout } from "../services/actions/auth";
import { switchNotifications } from "../services/actions/notifications";
import { switchMessages } from "../services/actions/conversations";
import { switchPostDetails, switchShare } from "../services/actions/posts";
import Notifications from "../pages/Notifications";
import Messages from "../pages/Messages";
import Share from "../containers/Share";
import PostDetails from "../containers/PostDetails";

const
	Wrapper = styled.div`
		z-index: 4;
		width: 100%;
		height: 49.33px;
		top: ${props => props.hide ? "-50px" : "0px"};
		transition: top 0.7s linear;
		position: fixed;
		background: #fff;
		&:after {
			background: rgba(0,0,0,.0975);
	    content: '';
	    height: 1px;
	    left: 0;
	    position: absolute;
	    right: 0;
	    bottom: -1px;
		};
		@media(min-width: 760px) and (min-height: 450px) {
			display: ${props => props.hideOnLargeScreen && "none"};
		}
	`,
	Options = styled.div`
		height: 100%;
		display: flex;
		align-items: center;
		@media (max-width: 960px) {
			width: 100%;
			justify-content: space-around;
		}
		@media (min-width: 960px) {
			margin: 0 auto;
			justify-content: flex-start;
			position: relative;
		}
		@media (min-width: 960px) and (max-width: 1200px) {
			width: 960px;
		}
		@media (min-width: 1200px) {
			width: 1140px;
		}
	`,
	NavOption = styled.div`
		height: 100%;
		@media (max-width: 960px) {
			width: 100%;
		}
		@media (min-width: 960px) {
			width: 49.33px;
			margin-right: 2rem;
			position: relative;
		}
		display: flex;
		align-items: center;
		justify-content: center;
	`,
	NavImage = styled.span`
		height: 24px;
		width: 24px;
		display: block;
		background-image: url(${props => props.image});
		background-repeat: no-repeat;
		background-size: 100%;
		margin: 0;
		position: relative;
		:hover {
			cursor: pointer;
		}
	`,
	ProfileImg = styled( Image )`
		width: 33px !important;
		height: 33px !important;
	`,
	DropdownFullname = styled.h4`
		margin: 0 !important;
		font-family: inherit;
	`,
	DropdownUsername = styled.span`
		color: rgba( 0,0,0,0.5 );
		font-size: 1rem;
	`,
	StyledDropdownItem = styled( Dropdown.Item )`
		display: flex !important;
		align-content: center !important;
		justify-content: center !important;
	`,
	Scores = styled( Dropdown.Item )`
		display: flex !important;
		align-content: center;
		justify-content: space-between;
		font-size: 1rem !important;
		@media (min-width: 960px) {
			margin-right: 2rem;
		}
	`,
	UserInfo = styled( Dropdown.Item )`
		display: flex !important;
		flex-direction: column !important;
		align-content: center !important;
		justify-content: center !important;
	`,
	Count = styled.span`
		z-index: 2;
		font-size: 1rem;
		color: rgb(168, 170, 171);
		line-height: 2rem;
		@media (min-width: 960px) {
			margin-left: 0.5rem;
		}
	`,
	RightOptions = styled.div`
		display: flex;
		align-items: center;
		margin-left: auto;
		@media (max-width: 960px) {
			display: none;
		}
	`,
	Logo = styled.a`
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		z-index: 2;
		height: 45px;
		width: 153px;
		display: block;
		background-image: url(${props => props.image});
		background-repeat: no-repeat;
		background-size: 100%;
		span {
			font-weight: 400;
		}
		@media (max-width: 960px) {
			display: none;
		}
	`,
	PostDetailsDimmer = styled.div`
		position: fixed;
		height: 100%;
		width: 100%;
		z-index: 5;
		background: rgba(0,0,0,0.6);
		display: flex;
		align-items: center;
		justify-content: center;
	`,
	OutsideClickHandler = styled.div`
		width: 100%;
		height: 100%;
		min-height: 100vh;
	`;


class NavBar extends Component {
	componentWillUnmount() {
		this.hidePopups();
	}

	handleHome = () => {
		if ( this.props.location.pathname !== "/" ) {
			this.props.history.push( "/" );
		}
	}

	handleNotifications = () => {
		if ( window.innerWidth > 760 && window.innerHeight > 450 ) {
			this.props.switchNotifications();
			this.props.displayMessages && this.props.switchMessages();
		} else if ( this.props.location.pathname !== "/notifications" ) {
			this.props.history.push( "/notifications" );
		}
	}

	handleExplore = () => {
		if ( this.props.location.pathname !== "/explore" ) {
			this.props.history.push( "/explore" );
		}
	}

	handleMessages = () => {
		if ( window.innerWidth > 760 && window.innerHeight > 450 ) {
			this.props.switchMessages();
			this.props.displayNotifications && this.props.switchNotifications();
		} else if ( this.props.location.pathname !== "/messages" ) {
			this.props.history.push( "/messages" );
		}
	}

	goToProfile = username => {
		if ( this.props.location.pathname !== "/" + username ) {
			this.props.history.push( "/" + username );
		}
	}

	goToSettings = username => {
		if ( this.props.location.pathname !== "/settings" ) {
			this.props.history.push( "/settings" );
		}
	}

	handleLogout = () => {
		this.props.socket.disconnect();
		this.props.logout();
	}

	goToBatcave = () => {
		if ( this.props.location.pathname !== "/batcave" ) {
			this.props.history.push( "/batcave" );
		}
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

	render() {
		var
			profileImage,
			chatNotifications = 0;
		const
			s3Bucket = "https://d3dlhr4nnvikjb.cloudfront.net/",
			username = localStorage.getItem( "username" ),
			fullname = localStorage.getItem( "fullname" );
		try {
			for ( const conversation of this.props.allConversations ) {
				if ( conversation.newMessagesCount > 0 ) {
					chatNotifications++;
				}
			}

			if ( !localStorage.getItem( "uimg" ) ||
			localStorage.getItem( "uimg" ) === "undefined" ) {
				profileImage = require( "../images/defaultUser.png" );
			} else {
				process.env.REACT_APP_STAGE === "dev" ?
					profileImage = require( `../images/${localStorage.getItem( "uimg" )}` )
					:
					profileImage = s3Bucket + localStorage.getItem( "uimg" );
			}
		} catch ( err ) {
			console.log( err );
		}
		const { displayPostDetails, displayShare } = this.props;
		return (
			<Wrapper
				hide={this.props.hide}
				hideOnLargeScreen={this.props.hideOnLargeScreen}
			>
				{( displayPostDetails || displayShare ) &&
					<PostDetailsDimmer>
						<OutsideClickHandler onClick={this.hidePopups} />
						{displayPostDetails &&
							<PostDetails
								socket={this.props.socket}
								history={this.props.history}
							/>}
						{displayShare &&
							<Share socket={this.props.socket} history={this.props.history}
							/>}
					</PostDetailsDimmer>
				}
				<Options>
					<NavOption onClick={this.handleHome} >
						<NavImage
							image={this.props.location.pathname === "/" ?
								require( "../images/home_color.svg" )
								:
								require( "../images/home.svg" )
							}
						/>
					</NavOption>

					<NavOption onClick={this.handleExplore}>
						<NavImage
							image={this.props.location.pathname === "/explore" ?
								require( "../images/search_color.svg" )
								:
								require( "../images/search.svg" )
							}
						/>
					</NavOption>

					<NavOption>
						<NavImage
							onClick={this.handleNotifications}
							image={this.props.location.pathname === "/notifications"
							|| this.props.displayNotifications
								?
								require( "../images/bell_color.svg" )
								:
								require( "../images/bell.svg" )
							}
						>
							{this.props.newNotifications > 0 &&
								<Label size="small" floating circular>
									{this.props.newNotifications}
								</Label>
							}
						</NavImage>

						{this.props.displayNotifications &&
							<Notifications socket={this.props.socket} isPopup />
						}
					</NavOption>

					<NavOption>
						<NavImage
							onClick={this.handleMessages}
							image={this.props.location.pathname === "/messages"
							|| this.props.displayMessages ?
								require( "../images/chat_color.svg" )
								:
								require( "../images/chat.svg" )
							}
						>
							{chatNotifications > 0 &&
								<Label size="small" floating circular>
									{chatNotifications}
								</Label>
							}
						</NavImage>

						<Messages
							displayPopup={this.props.displayMessages}
							socket={this.props.socket}
							largeScreen
							onHome={this.props.location.pathname === "/"}
							hideSidebar={this.props.location.pathname !== "/"}
							messageTarget={this.props.messageTarget}
							profilePage={this.props.profilePage}
							startChat={this.props.startChat}
							history={this.props.history}
						/>
					</NavOption>

					<Logo href="/" image={require( "../images/black-logo-lname.svg" )} />

					<RightOptions>
						<Scores>
							<NavImage
								image={require( "../images/heart.svg" )}
							/>
							<Count>{this.props.totalLikes} likes</Count>
						</Scores>
						<Scores>
							<NavImage
								image={require( "../images/visibility.svg" )}
							/>
							<Count>{this.props.totalViews} views</Count>
						</Scores>

						<Dropdown
							trigger={<ProfileImg circular src={profileImage} />}
							icon={null} direction="left">
							<Dropdown.Menu>
								<UserInfo
									onClick={() => this.goToProfile( username )}
								>
									<DropdownFullname>{fullname}</DropdownFullname>
									<DropdownUsername>@{username}</DropdownUsername>
								</UserInfo>
								<Dropdown.Divider />
								<StyledDropdownItem
									text="Logout"
									onClick={this.handleLogout}
								/>
								<StyledDropdownItem
									text="Settings"
									onClick={this.goToSettings}
								/>
								{localStorage.getItem( "ia" ) === "true" &&
								<StyledDropdownItem
									text="Batcave"
									onClick={this.goToBatcave}
								/>}
							</Dropdown.Menu>
						</Dropdown>
					</RightOptions>

					<NavOption id="NavbarSmallScreenOption">
						<Dropdown
							trigger={<ProfileImg circular src={profileImage} />}
							icon={null} direction="left">
							<Dropdown.Menu>
								<UserInfo
									onClick={() => this.goToProfile( username )}
								>
									<DropdownFullname>{fullname}</DropdownFullname>
									<DropdownUsername>@{username}</DropdownUsername>
								</UserInfo>
								<Dropdown.Divider />
								<Scores>
									<NavImage
										image={require( "../images/heart.svg" )}
									/>
									<Count>{this.props.totalLikes} likes</Count>
								</Scores>
								<Scores>
									<NavImage
										image={require( "../images/visibility.svg" )}
									/>
									<Count>{this.props.totalViews} views</Count>
								</Scores>
								<Dropdown.Divider />
								<StyledDropdownItem
									text="Logout"
									onClick={this.handleLogout}
								/>
								<StyledDropdownItem
									text="Settings"
									onClick={this.goToSettings}
								/>
								{localStorage.getItem( "ia" ) === "true" &&
								<StyledDropdownItem
									text="Batcave"
									onClick={this.goToBatcave}
								/>}
							</Dropdown.Menu>
						</Dropdown>
					</NavOption>
				</Options>
			</Wrapper>
		);
	}
}

NavBar.propTypes = {
	mediaOptions: PropTypes.bool,
	logout: PropTypes.func.isRequired,
	newNotifications: PropTypes.number.isRequired,
	totalLikes: PropTypes.number.isRequired,
	totalViews: PropTypes.number.isRequired,
	messageTarget: PropTypes.object
};

const
	mapStateToProps = state => ({
		newNotifications: state.notifications.newNotifications,
		totalLikes: state.user.totalLikes,
		totalViews: state.user.totalViews,
		displayNotifications: state.notifications.displayNotifications,
		displayMessages: state.conversations.displayMessages,
		allConversations: state.conversations.allConversations,
		displayShare: state.posts.displayShare,
		displayPostDetails: state.posts.displayPostDetails,
	}),

	mapDispatchToProps = dispatch => ({
		logout: () => dispatch( logout()),
		switchNotifications: () => dispatch( switchNotifications()),
		switchMessages: () => dispatch( switchMessages()),
		switchPostDetails: post => dispatch( switchPostDetails( post )),
		switchShare: () => dispatch( switchShare())
	});

export default withRouter(
	connect( mapStateToProps, mapDispatchToProps )( NavBar )
);
