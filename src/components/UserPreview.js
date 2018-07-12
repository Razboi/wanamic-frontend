import React, { Component } from "react";
import { Image } from "semantic-ui-react";
import styled from "styled-components";
import PropTypes from "prop-types";
import FollowButtonComponent from "./FollowButton";

const
	Wrapper = styled.div`
		display: flex;
		position: relative;
		flex-direction: column;
		margin-bottom: 2.5rem;
	`,
	MatchFullname = styled.h3`
		margin: 0px;
	`,
	MatchUsername = styled.span`
		color: #808080;
	`,
	MatchDescription = styled.p`
		margin: 0.5rem 0 0 0 !important;
		font-size: 1.025rem !important;
	`,
	Hobbies = styled.div`
		@media (max-width: 420px) {
			text-align: center;
			font-size: 1.025rem;
			color: rgba( 0,0,0,0.5 );
			padding: 0.66rem;
		}
	`,
	UserImg = styled( Image )`
		width: 40px !important;
		height: 40px !important;
		margin-right: 0.5rem !important;
	`,
	UserInfo = styled.div`
		display: flex;
		flex-direction: row;
	`,
	TextInfo = styled.div`
		display: flex;
		flex-direction: column;
	`;

class UserPreview extends Component {
	render() {
		const {
			user, handleFollow, handleUnfollow, handleUnfriend,
			alreadyFollowing, alreadyFriends
		} = this.props;
		return (
			<Wrapper>
				<UserInfo>
					<UserImg
						circular
						src={user.profileImage ?
							require( "../images/" + user.profileImage )
							:
							require( "../images/defaultUser.png" )
						}
					/>
					<TextInfo>
						<MatchFullname>{user.fullname}</MatchFullname>
						<MatchUsername>@{user.username}</MatchUsername>
					</TextInfo>
				</UserInfo>
				<MatchDescription>{user.description}</MatchDescription>
				<Hobbies>
					{"#" + user.keywords.toString().replace( /,/g, " #" )}
				</Hobbies>
				{localStorage.getItem( "username" ) !== user.username &&
				<FollowButtonComponent
					user={user}
					handleFollow={handleFollow}
					handleUnfollow={handleUnfollow}
					handleUnfriend={handleUnfriend}
					alreadyFollowing={alreadyFollowing}
					alreadyFriends={alreadyFriends}
				/>
				}
			</Wrapper>
		);
	}
}

UserPreview.propTypes = {
	user: PropTypes.object.isRequired,
	handleFollow: PropTypes.func.isRequired,
	handleUnfollow: PropTypes.func.isRequired,
	handleUnfriend: PropTypes.func,
	alreadyFollowing: PropTypes.bool,
	alreadyFriends: PropTypes.bool,
};

export default UserPreview;
