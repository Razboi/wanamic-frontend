import React, { Component } from "react";
import { Image } from "semantic-ui-react";
import styled from "styled-components";
import PropTypes from "prop-types";

const
	Wrapper = styled.div`
		display: flex;
		position: relative;
		flex-direction: column;
		margin-bottom: 2.5rem;
	`,
	MatchFullname = styled.h3`
		margin: 0px;
		font-family: inherit;
		color: #111;
	`,
	MatchUsername = styled.span`
		color: #808080;
	`,
	MatchDescription = styled.p`
		margin: 0.5rem 0 0 0 !important;
		font-size: 1.025rem !important;
		color: #222;
	`,
	Hobbies = styled.div`
		display: flex;
		flex-wrap: wrap;
		width: 90%;
		align-items: center;
		justify-content: center;
		margin: 1rem 0;
	`,
	Hobbie = styled.div`
		border: 1px solid rgba( 0,0,0,0.4);
		color: #333;
		border-radius: 2px;
		padding: 0.5rem;
		font-size: 1rem;
		font-weight: bold;
		margin: 0.5rem 0 0 0.5rem;
		box-shadow: 0 1px 2px rgba(0, 0, 0, .125);
	`,
	UserImg = styled( Image )`
		width: 40px !important;
		height: 40px !important;
		margin-right: 0.5rem !important;
	`,
	UserInfo = styled.div`
		display: flex;
		flex-direction: row;
		:hover {
			cursor: pointer;
		}
	`,
	TextInfo = styled.div`
		display: flex;
		flex-direction: column;
	`;

class UserPreview extends Component {
	render() {
		let userImage;
		const
			s3Bucket = "https://d3dlhr4nnvikjb.cloudfront.net/",
			{ user, handleClick } = this.props;

		try {
			if ( user.profileImage ) {
				process.env.REACT_APP_STAGE === "dev" ?
					userImage = require( "../images/" + user.profileImage )
					:
					userImage = s3Bucket + user.profileImage;
			} else {
				userImage = require( "../images/defaultUser.png" );
			}
		} catch ( err ) {
			console.log( err );
		}
		return (
			<Wrapper>
				<UserInfo onClick={() =>
					handleClick && handleClick( user.username )}>
					<UserImg
						circular
						src={userImage}
					/>
					<TextInfo>
						<MatchFullname>{user.fullname}</MatchFullname>
						<MatchUsername>@{user.username}</MatchUsername>
					</TextInfo>
				</UserInfo>
				<MatchDescription>{user.description}</MatchDescription>
				<Hobbies>
					{user.hobbies && user.hobbies.map(( hobbie, index ) =>
						<Hobbie key={index}>
							{hobbie}
						</Hobbie>
					)}
				</Hobbies>
			</Wrapper>
		);
	}
}

UserPreview.propTypes = {
	user: PropTypes.object.isRequired,
	handleClick: PropTypes.func
};

export default UserPreview;
