import React, { Component } from "react";
import { Icon, Label } from "semantic-ui-react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import { connect } from "react-redux";

const
	Wrapper = styled.div`
		z-index: 3;
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
	render() {
		return (
			<Wrapper hide={this.props.mediaOptions}>
				<NavOption>
					<Icon
						name="home"
						size="large"
						onClick={() => this.props.history.push( "/" )}
					/>
				</NavOption>
				<NavOption>
					<Icon name="bell outline" size="large" />
					{this.props.notifications.length > 0 &&
						<NotificationsLength size="small" floating circular color="red">
							{this.props.notifications.length}
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
		notifications: state.notifications.newNotifications
	}),

	mapDispatchToProps = dispatch => ({
	});

export default withRouter(
	connect( mapStateToProps, mapDispatchToProps )( NavBar )
);
