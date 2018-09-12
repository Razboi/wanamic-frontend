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
	UsersWrapper = styled.div`
		background: #fff;
		display: flex;
		flex-direction: column;
		padding: 1rem;
	`,
	LoaderDimmer = styled.div`
		position: absolute;
		left: 0;
		top: 0;
		height: 100%;
		width: 100%;
		z-index: 5;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background: rgba(0,0,0,0.4);
	`;

class UserNetwork extends Component {
	constructor() {
		super();
		this.state = {
			network: { friends: [] },
			tab: 0,
			requesterNetwork: {},
			loader: false
		};
	}
	componentDidMount() {
		this.getNetwork();
	}
	getNetwork = async() => {
		try {
			this.setState({ loader: true });
			const network = await api.getUserNetwork( this.props.username );
			if ( network === "jwt expired" ) {
				await refreshToken();
				this.getNetwork();
			} else if ( network.data ) {
				this.setState({
					network: network.data.user,
					requesterNetwork: network.data.requester,
					loader: false
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
		const { requesterNetwork, network, loader } = this.state;
		if ( network.friends.length === 0 && !loader ) {
			return (
				<Wrapper>
					<UsersWrapper>
						@{this.props.username} hasn't built a network yet.
					</UsersWrapper>
				</Wrapper>
			);
		}
		return (
			<Wrapper>
				{loader &&
					<LoaderDimmer>
						<div className="lds-ring"><div></div><div></div><div></div><div></div></div>
					</LoaderDimmer>
				}

				<UsersWrapper>
					{network.friends.map(( user, index ) =>
						<UserPreview
							handleClick={this.handleUserPreviewClick}
							key={index}
							user={user}
							handleUnfriend={this.handleUnfriend}
							alreadyFriends={
								requesterNetwork.friends.includes( user._id )}
						/>
					)}
				</UsersWrapper>
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
