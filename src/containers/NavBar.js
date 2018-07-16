import React, { Component } from "react";
import { Icon, Label, Dropdown, Image } from "semantic-ui-react";
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
	NavOption = styled.span`
		color: rgba( 0, 0, 0, .5 ) !important;
		position: relative;
		i {
			font-size: 1.45rem !important;
			margin: 0 !important;
		}
	`,
	ProfileImg = styled( Image )`
		width: 30px !important;
		height: 30px !important;
	`,
	NotificationsLength = styled( Label )`
	`,
	DropdownFullname = styled.h4`
		margin: 0 !important;
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
		align-content: center !important;
		justify-content: center !important;
		font-size: 1rem !important;
	`,
	UserInfo = styled( Dropdown.Item )`
		display: flex !important;
		flex-direction: column !important;
		align-content: center !important;
		justify-content: center !important;
	`,
	Count = styled.span`
		font-weight: bold;
		margin-top: -7px;
		z-index: 2;
		font-size: 1.1rem;
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
				<NavOption onClick={this.handleHome}>
					<Icon
						color={this.props.location.pathname === "/" ?
							"black" : null}
						name="home"
					/>
				</NavOption>
				<NavOption onClick={this.handleNotifications}>
					<Icon
						name="bell outline"
						color={this.props.location.pathname === "/notifications" ?
							"black" : null}
					/>
					{this.props.newNotifications > 0 &&
						<NotificationsLength size="small" floating circular color="red">
							{this.props.newNotifications}
						</NotificationsLength>
					}
				</NavOption>
				<NavOption onClick={this.handleExplore}>
					<Icon
						name="search"
						color={this.props.location.pathname === "/explore" ?
							"black" : null}
					/>
				</NavOption>
				<NavOption onClick={this.handleMessages}>
					<Icon
						name="conversation"
						color={this.props.location.pathname === "/messages" ?
							"black" : null}
					/>
					{this.props.chatNotifications.length > 0 &&
						<NotificationsLength size="small" floating circular color="red">
							{this.props.chatNotifications.length}
						</NotificationsLength>
					}
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
								<Icon name="like" color="red" />
								<Count>{this.props.totalLikes}</Count>
							</Scores>
							<Scores>
								<Icon name="eye" color="blue" />
								<Count>{this.props.totalViews}</Count>
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
