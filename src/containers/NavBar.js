import React, { Component } from "react";
import { Icon, Label } from "semantic-ui-react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { switchNotifications } from "../services/actions/notifications";

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
		} else {
			this.props.displayNotifications ?
				this.props.switchNotifications()
				:
				window.scrollTo( 0, 0 );
		}
	}
	render() {
		return (
			<Wrapper hide={this.props.mediaOptions}>
				<NavOption>
					<Icon
						name="home"
						size="large"
						onClick={this.handleHome}
					/>
				</NavOption>
				<NavOption onClick={this.props.switchNotifications}>
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
				<NavOption>
					<Icon name="conversation" size="large" />
				</NavOption>
				<NavOption>
					<Icon name="bars" size="large" />
				</NavOption>
			</Wrapper>
		);
	}
}

NavBar.propTypes = {
	mediaOptions: PropTypes.bool
};

const
	mapStateToProps = state => ({
		newNotifications: state.notifications.newNotifications,
		displayNotifications: state.notifications.displayNotifications
	}),

	mapDispatchToProps = dispatch => ({
		switchNotifications: () => dispatch( switchNotifications()),
	});

export default withRouter(
	connect( mapStateToProps, mapDispatchToProps )( NavBar )
);
