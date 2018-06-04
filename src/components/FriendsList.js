import React, { Component } from "react";
import { Icon, Divider } from "semantic-ui-react";
import styled from "styled-components";
import PropTypes from "prop-types";

const
	FriendListWrapper = styled.div`
		height: 100vh;
		width: 100%;
		position: absolute;
		z-index: 4;
		background: #fff;
	`,
	HeaderWrapper = styled.div`
		height: 49.33px;
		display: flex;
		align-items: center;
		padding-left: 10px;
		border-bottom: 1px solid rgba(0, 0, 0, .5);
	`,
	HeaderTxt = styled.span`
		margin-left: 15px;
		font-weight: bold;
		font-size: 16px;
	`,
	Friend = styled.div`
		padding: 10px;
	`,
	StyledDivider = styled( Divider )`
		margin: 0px !important;
	`;


class FriendsList extends Component {

	render() {
		return (
			<FriendListWrapper>
				<HeaderWrapper>
					<Icon
						name="arrow left"
						onClick={this.props.switchFriendsList}
						className="arrowBack"
					/>
					<HeaderTxt>Friends</HeaderTxt>
				</HeaderWrapper>
				<div className="friendsList">
					{this.props.friends.map(( friend, index ) =>
						<React.Fragment key={index}>
							<Friend
								className="friend"
								onClick={() => this.props.handleSelectConversation( friend )}
							>
								<span>
									<b>{friend.username}</b>
								</span>
							</Friend>
							<StyledDivider />
						</React.Fragment>
					)}
				</div>
			</FriendListWrapper>
		);
	}
}

FriendsList.propTypes = {
	friends: PropTypes.array.isRequired,
	handleSelectConversation: PropTypes.func.isRequired,
	switchFriendsList: PropTypes.func.isRequired
};


export default FriendsList;
