import React, { Component } from "react";
import { Icon, Image, Header } from "semantic-ui-react";
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
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: 1rem;
		border-bottom: 1px solid rgba(0, 0, 0, .1);
	`,
	FriendImg = styled( Image )`
		width: 40px !important;
		height: 40px !important;
		align-self: flex-start;
	`,
	FriendData = styled( Header )`
		margin-top: 0 !important;
		margin-left: 0.66rem !important;
	`,
	Fullname = styled.span`
		font-size: 1.1475rem !important;
	`,
	Username = styled( Header.Subheader )`

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
								onClick={() => this.props.handleNewConversation( friend )}
							>
								<FriendImg
									circular
									src={friend.profileImage ?
										require( "../images/" + friend.profileImage )
										:
										require( "../images/defaultUser.png" )
									}
								/>
								<FriendData>
									<Fullname>{friend.fullname}</Fullname>
									<Username>@{friend.username}</Username>
								</FriendData>
							</Friend>
						</React.Fragment>
					)}
				</div>
			</FriendListWrapper>
		);
	}
}

FriendsList.propTypes = {
	friends: PropTypes.array.isRequired,
	handleNewConversation: PropTypes.func.isRequired,
	switchFriendsList: PropTypes.func.isRequired
};


export default FriendsList;
