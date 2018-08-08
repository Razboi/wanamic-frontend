import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import api from "../services/api";
import refreshToken from "../utils/refreshToken";

const
	Wrapper = styled.div`
		min-height: 100vh;
		height: 100%;
		width: 100%;
		background: #eee;
		overflow: hidden;
		margin-top: 1rem;
		font-size: 1.05rem;
		@media (min-width: 960px) {
			width: 600px;
			margin-top: 2rem;
			padding: 0 5px;
		}
		@media (min-width: 600px) and (max-width: 960px) {
			width: 600px;
			padding-top: 1rem;
			background: none;
			margin: 0 auto;
		}
	`,
	InfoSegment = styled.div`
		width: 100%;
		padding: 1rem;
		display: flex;
		justify-content: space-between;
		background: #fff;
		border-bottom: 1px solid rgba( 0,0,0,0.2 );
	`,
	InfoLabel = styled.span`
		margin-right: 1rem;
	`,
	InfoContent = styled.span`
		color: rgba( 0,0,0,0.6 );
	`;

class UserInformation extends Component {
	constructor() {
		super();
		this.state = {
			userInformation: {}
		};
	}
	componentDidMount() {
		this.getUserInformation();
	}

	getUserInformation = async() => {
		try {
			const info = await api.getUserInfo( this.props.username );
			if ( info === "jwt expired" ) {
				await refreshToken();
				this.getUserInformation();
			} else if ( info.data ) {
				this.setState({ userInformation: info.data });
			}
		} catch ( err ) {
			console.log( err );
		}
	}

	render() {
		const { userInformation } = this.state;
		return (
			<Wrapper>
				<InfoSegment>
					<InfoLabel>Fullname</InfoLabel>
					<InfoContent>{userInformation.fullname}</InfoContent>
				</InfoSegment>
				<InfoSegment>
					<InfoLabel>Username</InfoLabel>
					<InfoContent>@{userInformation.username}</InfoContent>
				</InfoSegment>
				<InfoSegment>
					<InfoLabel>Description</InfoLabel>
					<InfoContent>{userInformation.description}</InfoContent>
				</InfoSegment>
				<InfoSegment>
					<InfoLabel>Hobbies</InfoLabel>
					<InfoContent>
						{userInformation.hobbies &&
						userInformation.hobbies.map( hobbie => hobbie + ", " )}
					</InfoContent>
				</InfoSegment>
				<InfoSegment>
					<InfoLabel>Country</InfoLabel>
					<InfoContent>{userInformation.country}</InfoContent>
				</InfoSegment>
				<InfoSegment>
					<InfoLabel>Region</InfoLabel>
					<InfoContent>{userInformation.region}</InfoContent>
				</InfoSegment>
				<InfoSegment>
					<InfoLabel>Birthday</InfoLabel>
					<InfoContent>
						{userInformation.birthday &&
						userInformation.birthday.split( "T" )[ 0 ]}
					</InfoContent>
				</InfoSegment>
				<InfoSegment>
					<InfoLabel>Gender</InfoLabel>
					<InfoContent>{userInformation.gender}</InfoContent>
				</InfoSegment>
			</Wrapper>
		);
	}
}

UserInformation.propTypes = {
	username: PropTypes.string.isRequired
};

export default UserInformation;
