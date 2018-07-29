import React, { Component } from "react";
import { Label, Dropdown, Image } from "semantic-ui-react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { logout } from "../services/actions/auth";
import { switchNotifications } from "../services/actions/notifications";
import Notifications from "../pages/Notifications";

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
		@media(min-width: 420px) {
			display: ${props => props.hideOnLargeScreen && "none"};
		}
	`,
	Options = styled.div`
		height: 100%;
		display: flex;
		align-items: center;
		@media (max-width: 420px) {
			width: 100%;
			justify-content: space-around;
		}
		@media (min-width: 420px) {
			width: 1140px;
			margin: 0 auto;
			justify-content: flex-start;
			position: relative;
		}
	`,
	NavOption = styled.div`
		height: 100%;
		@media (max-width: 420px) {
			width: 100%;
		}
		@media (min-width: 420px) {
			width: 49.33px;
			margin-right: 2rem;
			position: relative;
		}
		display: flex;
		align-items: center;
		justify-content: center;
		i {
			font-size: 1.45rem !important;
			margin: 0 !important;
		}
	`,
	NavImage = styled.span`
		height: 24px;
		width: 24px;
		display: block;
		background-image: url(${props => props.image});
		background-repeat: no-repeat;
		margin: 0;
		position: relative;
	`,
	ProfileImg = styled( Image )`
		width: 30px !important;
		height: 30px !important;
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
		@media (min-width: 420px) {
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
		@media (min-width: 420px) {
			margin-left: 0.5rem;
		}
	`,
	RightOptions = styled.div`
		display: flex;
		margin-left: auto;
		@media (max-width: 420px) {
			display: none;
		}
	`,
	Logo = styled.a`
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		font-size: 1.9rem;
    font-family: inherit;
    color: #111 !important;
		@media (max-width: 420px) {
			display: none;
		}
	`;


class NavBar extends Component {
	handleHome = () => {
		if ( this.props.location.pathname !== "/" ) {
			this.props.history.push( "/" );
		}
	}

	handleNotifications = () => {
		if ( this.props.location.pathname !== "/notifications" ) {
			this.props.history.push( "/notifications" );
		}
	}

	handleExplore = () => {
		if ( this.props.location.pathname !== "/explore" ) {
			this.props.history.push( "/explore" );
		}
	}

	handleMessages = () => {
		if ( this.props.location.pathname !== "/messages" ) {
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

	render() {
		var profileImage;
		const
			username = localStorage.getItem( "username" ),
			fullname = localStorage.getItem( "fullname" );
		try {
			if ( localStorage.getItem( "uimg" )) {
				profileImage = require( "../images/" +
				localStorage.getItem( "uimg" ));
			} else {
				profileImage = require( "../images/defaultUser.png" );
			}
		} catch ( err ) {
			console.log( err );
		}
		return (
			<Wrapper
				hide={this.props.hide}
				hideOnLargeScreen={this.props.hideOnLargeScreen}
			>
				<Options>
					<NavOption onClick={this.handleHome} >
						<NavImage
							image={this.props.location.pathname === "/" ?
								require( "../images/home_color.png" )
								:
								require( "../images/home.png" )
							}
						/>
					</NavOption>
					<NavOption>
						<div
							onClick={window.innerWidth > 420 ?
								this.props.switchNotifications
								:
								this.handleNotifications}
						>
							<NavImage
								image={this.props.location.pathname === "/notifications" ?
									require( "../images/bell_color.png" )
									:
									require( "../images/bell.png" )
								}
							>
								{this.props.newNotifications > 0 &&
									<Label size="small" floating circular>
										{this.props.newNotifications}
									</Label>
								}
							</NavImage>
						</div>

						{this.props.displayNotifications &&
							<Notifications socket={this.props.socket} isPopup />
						}
					</NavOption>
					<NavOption onClick={this.handleExplore}>
						<NavImage
							image={this.props.location.pathname === "/explore" ?
								require( "../images/explore_color.png" )
								:
								require( "../images/explore.png" )
							}
						/>
					</NavOption>
					<NavOption
						id="NavbarSmallScreenOption"
						onClick={this.handleMessages}
					>
						<NavImage
							image={this.props.location.pathname === "/messages" ?
								require( "../images/chat_color.png" )
								:
								require( "../images/chat.png" )
							}
						>
							{this.props.chatNotifications.length > 0 &&
								<Label size="small" floating circular color="red">
									{this.props.chatNotifications.length}
								</Label>
							}
						</NavImage>
					</NavOption>

					<Logo href="localhost:3000">
						Wanamic
					</Logo>

					<RightOptions>
						<Scores>
							<NavImage
								image={require( "../images/heart.png" )}
							/>
							<Count>{this.props.totalLikes} likes</Count>
						</Scores>
						<Scores>
							<NavImage
								image={require( "../images/visibility.png" )}
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
										image={require( "../images/heart.png" )}
									/>
									<Count>{this.props.totalLikes} likes</Count>
								</Scores>
								<Scores>
									<NavImage
										image={require( "../images/visibility.png" )}
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
	chatNotifications: PropTypes.array.isRequired,
	totalLikes: PropTypes.number.isRequired,
	totalViews: PropTypes.number.isRequired
};

const
	mapStateToProps = state => ({
		newNotifications: state.notifications.newNotifications,
		chatNotifications: state.conversations.notifications,
		totalLikes: state.user.totalLikes,
		totalViews: state.user.totalViews,
		displayNotifications: state.notifications.displayNotifications
	}),

	mapDispatchToProps = dispatch => ({
		logout: () => dispatch( logout()),
		switchNotifications: () => dispatch( switchNotifications())
	});

export default withRouter(
	connect( mapStateToProps, mapDispatchToProps )( NavBar )
);
