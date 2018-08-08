import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import api from "../services/api";
import refreshToken from "../utils/refreshToken";
import UserPreview from "../components/UserPreview";

const
	Wrapper = styled.div`
		min-height: 100vh;
		height: 100%;
		width: 100%;
		margin-top: 1rem;
		padding: 0 5px;
		@media (min-width: 600px) {
			width: 600px;
			background: none;
		}
		@media (max-width: 1100px) {
			margin: 2rem auto 0 auto;
		}
	`,
	Tabs = styled.div`
		background: #fff;
		display: flex;
		flex-direction: row;
		width: 100%;
		justify-content: space-around;
		padding: 1rem 0;
		border-bottom: 1px solid #bec2c9;
	`,
	TabOption = styled.div`
		display: flex;
		flex-direction: column;
		align-items: center;
		font-size: 1rem;
		font-weight: ${props => props.selected ? "bold" : "normal"};
		:hover {
			cursor: pointer;
		}
	`,
	UsersWrapper = styled.div`
		background: #fff;
		display: flex;
		flex-direction: column;
		padding: 1rem;
	`;

class UserNetwork extends Component {
	constructor() {
		super();
		this.state = {
			network: { friends: [], followers: [], following: [] },
			tab: 0,
			requesterNetwork: {}
		};
	}
	componentDidMount() {
		this.getNetwork();
	}
	getNetwork = async() => {
		try {
			const network = await api.getUserNetwork( this.props.username );
			if ( network === "jwt expired" ) {
				await refreshToken();
				this.getNetwork();
			} else if ( network.data ) {
				this.setState({
					network: network.data.user,
					requesterNetwork: network.data.requester
				});
			}
		} catch ( err ) {
			console.log( err );
		}
	}

	setTab = tab => {
		if ( this.state.tab !== tab ) {
			this.setState({ tab: tab });
		}
	}

	handleFollow = async( username, id ) => {
		var requesterNetwork = this.state.requesterNetwork;
		try {
			const notification = await api.followUser( username );
			if ( notification === "jwt expired" ) {
				await refreshToken();
				this.handleFollow();
			} else if ( notification.data ) {
				this.props.socket.emit( "sendNotification", notification.data );
				requesterNetwork.following.push( id );
				this.setState({ requesterNetwork: requesterNetwork });
			}
		} catch ( err ) {
			console.log( err );
		}
	}

	handleUnfollow = async( username, id ) => {
		var requesterNetwork = this.state.requesterNetwork;
		try {
			const response = await api.unfollowUser( username );
			if ( response === "jwt expired" ) {
				await refreshToken();
				this.handleUnfollow();
			} else {
				const indexOfUnfollow = requesterNetwork.following.indexOf(
					id );
				requesterNetwork.following.splice( indexOfUnfollow, 1 );
				this.setState({ requesterNetwork: requesterNetwork });
			}
		} catch ( err ) {
			console.log( err );
		}
	}

	handleUnfriend = async( username, id ) => {
		var requesterNetwork = this.state.requesterNetwork;
		try {
			const response = await api.deleteFriend( username );
			if ( response === "jwt expired" ) {
				await refreshToken();
				this.handleUnfriend();
			} else {
				const indexOfUnfriend = requesterNetwork.friends.indexOf(
					id );
				requesterNetwork.friends.splice( indexOfUnfriend, 1 );
				this.setState({ requesterNetwork: requesterNetwork });
			}
		} catch ( err ) {
			console.log( err );
		}
	}

	handleUserPreviewClick = username => {
		this.props.toggleTab();
		this.props.history.push( "/" + username );
	}

	render() {
		const { requesterNetwork, network, tab } = this.state;
		return (
			<Wrapper>
				<Tabs>
					<TabOption
						onClick={() => this.setTab( 0 )}
						selected={tab === 0}
					>
						<span>Friends</span>
						<span>{network.friends.length}</span>
					</TabOption>
					<TabOption
						onClick={() => this.setTab( 1 )}
						selected={tab === 1}
					>
						<span>Followers</span>
						<span>{network.followers.length}</span>
					</TabOption>
					<TabOption
						onClick={() => this.setTab( 2 )}
						selected={tab === 2}
					>
						<span>Following</span>
						<span>{network.following.length}</span>
					</TabOption>
				</Tabs>

				{tab === 0 &&
				<UsersWrapper>
					{network.friends.map(( user, index ) =>
						<UserPreview
							handleClick={this.handleUserPreviewClick}
							key={index}
							user={user}
							handleFollow={this.handleFollow}
							handleUnfollow={this.handleUnfollow}
							handleUnfriend={this.handleUnfriend}
							alreadyFollowing={
								requesterNetwork.following.includes( user._id )}
							alreadyFriends={
								requesterNetwork.friends.includes( user._id )}
						/>
					)}
				</UsersWrapper>}
				{tab === 1 &&
				<UsersWrapper>
					{network.followers.map(( user, index ) =>
						<UserPreview
							handleClick={this.handleUserPreviewClick}
							key={index}
							user={user}
							handleFollow={this.handleFollow}
							handleUnfollow={this.handleUnfollow}
							handleUnfriend={this.handleUnfriend}
							alreadyFollowing={
								requesterNetwork.following.includes( user._id )}
							alreadyFriends={
								requesterNetwork.friends.includes( user._id )}
						/>
					)}
				</UsersWrapper>}
				{tab === 2 &&
				<UsersWrapper>
					{network.following.map(( user, index ) =>
						<UserPreview
							handleClick={this.handleUserPreviewClick}
							key={index}
							user={user}
							handleFollow={this.handleFollow}
							handleUnfollow={this.handleUnfollow}
							handleUnfriend={this.handleUnfriend}
							alreadyFollowing={
								requesterNetwork.following.includes( user._id )}
							alreadyFriends={
								requesterNetwork.friends.includes( user._id )}
						/>
					)}
				</UsersWrapper>}
			</Wrapper>
		);
	}
}

UserNetwork.propTypes = {
	username: PropTypes.string.isRequired,
	toggleTab: PropTypes.func.isRequired,
	socket: PropTypes.object.isRequired,
	history: PropTypes.object.isRequired
};

export default UserNetwork;
