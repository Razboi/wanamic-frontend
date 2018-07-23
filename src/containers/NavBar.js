import React, { Component } from "react";
import { Label, Dropdown, Image } from "semantic-ui-react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { logout } from "../services/actions/auth";

const
	Wrapper = styled.div`
		z-index: 4;
		width: 100%;
		height: 49.33px;
		visibility: ${props => props.hide ? "hidden" : "visible"};
		position: fixed;
		top: 0px
		display: flex;
		align-items: center;
		justify-content: space-around;
		background: #fff;
		&:after {
			background: rgba(0,0,0,.0975);
	    content: '';
	    height: 1px;
	    left: 0;
	    position: absolute;
	    right: 0;
	    bottom: -1px;
		}
	`,
	NavOption = styled.div`
		height: 100%;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		color: rgba( 0, 0, 0, .5 ) !important;
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
	NotificationsLength = styled( Label )`
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
			<Wrapper hide={this.props.mediaOptions}>
				<NavOption onClick={this.handleHome} >
					<NavImage
						image={this.props.location.pathname === "/" ?
							require( "../images/home_color.png" )
							:
							require( "../images/home.png" )
						}
					/>
				</NavOption>
				<NavOption onClick={this.handleNotifications}>
					<NavImage
						image={this.props.location.pathname === "/notifications" ?
							require( "../images/bell_color.png" )
							:
							require( "../images/bell.png" )
						}
					>
						{this.props.newNotifications > 0 &&
							<NotificationsLength size="small" floating circular color="red">
								{this.props.newNotifications}
							</NotificationsLength>
						}
					</NavImage>
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
				<NavOption onClick={this.handleMessages}>
					<NavImage
						image={this.props.location.pathname === "/messages" ?
							require( "../images/chat_color.png" )
							:
							require( "../images/chat.png" )
						}
					>
						{this.props.chatNotifications.length > 0 &&
							<NotificationsLength size="small" floating circular color="red">
								{this.props.chatNotifications.length}
							</NotificationsLength>
						}
					</NavImage>
				</NavOption>
				<NavOption>
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
		totalViews: state.user.totalViews
	}),

	mapDispatchToProps = dispatch => ({
		logout: () => dispatch( logout())
	});

export default withRouter(
	connect( mapStateToProps, mapDispatchToProps )( NavBar )
);
