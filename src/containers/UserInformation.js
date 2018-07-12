import React, { Component } from "react";
import styled from "styled-components";
import { Icon } from "semantic-ui-react";
import PropTypes from "prop-types";
import api from "../services/api";
import refreshToken from "../utils/refreshToken";

const
	Wrapper = styled.div`
		height: 100vh;
		width: 100%;
		background: rgba( 0,0,0,0.1 );
		overflow: hidden;
	`,
	HeaderWrapper = styled.div`
		height: 9%;
		display: flex;
		align-items: center;
		padding-left: 10px;
		border-bottom: 1px solid rgba(0, 0, 0, .1);
		background: #fff;
	`,
	BackArrow = styled( Icon )`
		font-size: 1.3rem !important;
		margin: 0 !important;
	`,
	HeaderTxt = styled.span`
		margin-left: 1rem;
		font-weight: bold;
		font-size: 1.25rem;
	`,
	InformationWrapper = styled.section`
		margin-top: 2rem;
		height: 100%;
		font-size: 1.05rem;
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
			userInformation: undefined
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
		if ( !userInformation ) {
			return null;
		}
		return (
			<Wrapper>
				<HeaderWrapper>
					<BackArrow
						name="arrow left"
						onClick={this.props.toggleTab}
					/>
					<HeaderTxt>@{this.props.username} information</HeaderTxt>
				</HeaderWrapper>
				<InformationWrapper>
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
						<InfoContent>{userInformation.keywords}</InfoContent>
					</InfoSegment>
					<InfoSegment>
						<InfoLabel>Location</InfoLabel>
						<InfoContent>{userInformation.location}</InfoContent>
					</InfoSegment>
					<InfoSegment>
						<InfoLabel>Birthday</InfoLabel>
						<InfoContent>{userInformation.birthday}</InfoContent>
					</InfoSegment>
					<InfoSegment>
						<InfoLabel>Gender</InfoLabel>
						<InfoContent>{userInformation.gender}</InfoContent>
					</InfoSegment>
				</InformationWrapper>
			</Wrapper>
		);
	}
}

UserInformation.propTypes = {
	username: PropTypes.string.isRequired
};

export default UserInformation;
