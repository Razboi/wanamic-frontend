import React, { Component } from "react";
import { Icon, Label, Dropdown, Image } from "semantic-ui-react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { switchNotifications } from "../services/actions/notifications";
import { switchMessages } from "../services/actions/conversations";
import { logout } from "../services/actions/auth";

var profileImage;

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
	`;


class NavBar extends Component {
	handleHome = () => {
		if ( this.props.location.pathname !== "/" ) {
			this.props.history.push( "/" );
		}
		if ( this.props.displayNotifications ) {
			this.props.switchNotifications();
		}
		if ( this.props.displayMessages ) {
			this.props.switchMessages();
		}
	}

	handleExplore = () => {
		if ( this.props.location.pathname !== "/explore" ) {
			this.props.history.push( "/explore" );
		}
		if ( this.props.displayNotifications ) {
			this.props.switchNotifications();
		}
		if ( this.props.displayMessages ) {
			this.props.switchMessages();
		}
	}

	handleNotifications = () => {
		this.props.switchNotifications();
		if ( this.props.displayMessages ) {
			this.props.switchMessages();
		}
	}

	handleMessages = () => {
		this.props.switchMessages();
		if ( this.props.displayNotifications ) {
			this.props.switchNotifications();
		}
	}

	render() {
		const
			username = localStorage.getItem( "username" ),
			fullname = localStorage.getItem( "fullname" );
		try {
			if ( localStorage.getItem( "uimg" )) {
				profileImage = require( "../images/" + localStorage.getItem( "uimg" ));
			} else {
				profileImage = require( "../images/defaultUser.png" );
			}
		} catch ( err ) {
			console.log( err );
		}
		return (
			<Wrapper hide={this.props.mediaOptions}>
				<NavOption>
					<Icon
						color={this.props.location.pathname === "/" &&
									!this.props.displayMessages &&
									!this.props.displayNotifications ?
							"black" : null}
						className="test"
						name="home"
						onClick={this.handleHome}
					/>
				</NavOption>
				<NavOption onClick={this.handleNotifications}>
					<Icon
						name="bell outline"
						color={this.props.displayNotifications ? "black" : null}
					/>
					{this.props.newNotifications > 0 &&
						<NotificationsLength size="small" floating circular color="red">
							{this.props.newNotifications}
						</NotificationsLength>
					}
				</NavOption>
				<NavOption>
					<Icon
						name="search"
						color={this.props.location.pathname === "/explore" &&
									!this.props.displayMessages &&
									!this.props.displayNotifications ? "black" : null}
						onClick={this.handleExplore}
					/>
				</NavOption>
				<NavOption onClick={this.handleMessages}>
					<Icon
						name="conversation"
						color={this.props.displayMessages ? "black" : null}
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
							<Dropdown.Item
								onClick={() => this.props.history.push( "/" + username )}
							>
								<DropdownFullname>{fullname}</DropdownFullname>
								<DropdownUsername>@{username}</DropdownUsername>
							</Dropdown.Item>
							<Dropdown.Divider />
							<Dropdown.Item
								text="Total likes"
							/>
							<Dropdown.Item
								text="Total views"
							/>
							<Dropdown.Divider />
							<Dropdown.Item
								text="Logout"
								onClick={this.props.logout}
							/>
							<Dropdown.Item
								text="Settings"
								onClick={() => this.props.history.push( "/settings" )}
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
	switchNotifications: PropTypes.func.isRequired,
	logout: PropTypes.func.isRequired,
	newNotifications: PropTypes.number.isRequired,
	chatNotifications: PropTypes.array.isRequired,
	displayNotifications: PropTypes.bool.isRequired
};

const
	mapStateToProps = state => ({
		newNotifications: state.notifications.newNotifications,
		chatNotifications: state.conversations.notifications,
		displayNotifications: state.notifications.displayNotifications,
		displayMessages: state.conversations.displayMessages
	}),

	mapDispatchToProps = dispatch => ({
		switchNotifications: () => dispatch( switchNotifications()),
		switchMessages: ( id ) => dispatch( switchMessages( id )),
		logout: () => dispatch( logout())
	});

export default withRouter(
	connect( mapStateToProps, mapDispatchToProps )( NavBar )
);
