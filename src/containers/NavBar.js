import React, { Component } from "react";
import { Icon, Label, Dropdown } from "semantic-ui-react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { switchNotifications } from "../services/actions/notifications";
import { switchMessages } from "../services/actions/messages";
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
		background: #2185d0;
	`,
	NavOption = styled.span`
		color: #fff !important;
		position: relative;
	`,
	NotificationsLength = styled( Label )`

	`;


class NavBar extends Component {
	handleHome = () => {
		if ( this.props.location.pathname !== "/" ) {
			this.props.history.push( "/" );
			return;
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
		return (
			<Wrapper hide={this.props.mediaOptions}>
				<NavOption>
					<Icon
						className="test"
						name="home"
						size="large"
						onClick={this.handleHome}
					/>
				</NavOption>
				<NavOption onClick={this.handleNotifications}>
					<Icon name="bell outline" size="large" />
					{this.props.newNotifications > 0 &&
						<NotificationsLength size="small" floating circular color="red">
							{this.props.newNotifications}
						</NotificationsLength>
					}
				</NavOption>
				<NavOption>
					<Icon
						name="search"
						size="large"
						onClick={() => this.props.history.push( "/explore" )}
					/>
				</NavOption>
				<NavOption onClick={this.handleMessages}>
					<Icon name="conversation" size="large" />
					{this.props.newMessages > 0 &&
						<NotificationsLength size="small" floating circular color="red">
							{this.props.newMessages}
						</NotificationsLength>
					}
				</NavOption>
				<NavOption>
					<Icon icon="bars" size="large">
						<Dropdown icon="bars" direction="left">
							<Dropdown.Menu>
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
					</Icon>
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
	newMessages: PropTypes.number.isRequired,
	displayNotifications: PropTypes.bool.isRequired
};

const
	mapStateToProps = state => ({
		newNotifications: state.notifications.newNotifications,
		newMessages: state.messages.newMessages,
		displayNotifications: state.notifications.displayNotifications,
		displayMessages: state.messages.displayMessages
	}),

	mapDispatchToProps = dispatch => ({
		switchNotifications: () => dispatch( switchNotifications()),
		switchMessages: ( id ) => dispatch( switchMessages( id )),
		logout: () => dispatch( logout())
	});

export default withRouter(
	connect( mapStateToProps, mapDispatchToProps )( NavBar )
);
