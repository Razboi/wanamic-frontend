import React, { Component } from "react";
import styled from "styled-components";
import { Button } from "semantic-ui-react";
import api from "../services/api";
var
	LSToken = localStorage.getItem( "token" ),
	backgroundImg,
	profileImg;

const
	Wrapper = styled.div`
		@media (max-width: 420px) {
			height: 100vh;
			width: 100%;
			display: grid;
			grid-template-columns: 100%;
			grid-template-rows: 25% 45% auto;
			grid-template-areas:
				"h"
				"i"
		}
	`,
	Header = styled.div`
		@media (max-width: 420px) {
			grid-area: h;
			border-bottom: 1px solid #000;
			background-image: ${props => props.image};
			background-repeat: no-repeat;
			background-size: cover;
		}
	`,
	Information = styled.div`
		@media (max-width: 420px) {
			grid-area: i;

			display: grid;
			grid-template-columns: 45% 55%;
			grid-template-rows: 50% 50%;
			grid-template-areas:
				"i o"
				"d d"
		}
	`,
	BasicInfo = styled.div`
		@media (max-width: 420px) {
			grid-area: i;
			position: relative;
			display: grid;
			padding: 10px;
		}
	`,
	UserImage = styled.img`
		@media (max-width: 420px) {
			width: 116px;
			height: 116px;
			position: absolute;
			top: -62px;
			left: 10px;
			border-radius: 4px;
		}
	`,
	Names = styled.span`
		align-self: center;
	`,
	FullName = styled.h2`
		@media (max-width: 420px) {
			margin: 0px;
		}
	`,
	UserName = styled.span`
		@media (max-width: 420px) {
			color: #D3D3D3;
		}
	`,
	Options = styled.div`
		@media (max-width: 420px) {
			grid-area: o;
			display: grid;
			grid-template-columns: 100%;
			grid-template-rows: 33% 66%;
			grid-template-areas:
				"buttons"
				"kw"
		}
	`,
	Buttons = styled.span`
		grid-area: buttons;
		align-self: center;
		justify-self: center;
	`,
	Keywords = styled.span`
		grid-area: kw;
		align-self: center;
	`,
	Description = styled.div`
		@media (max-width: 420px) {
			padding: 10px;
			grid-area: d;
			text-align: left;
			align-self: center;
		}
	`,
	BackButton = styled( Button )`
		position: absolute;
		bottom: 10px;
		left: 10px;
	`,
	NextButton = styled( Button )`
		position: absolute;
		bottom: 10px;
		right: 10px;
	`;


class ExploreProfile extends Component {
	setImages() {
		try {
			if ( this.props.user.headerImage ) {
				backgroundImg = require( "../images/" + this.props.user.headerImage );
			} else {
				backgroundImg = require( "../images/defaultbg.png" );
			}
		} catch ( err ) {
			console.log( err );
		}

		try {
			if ( this.props.user.profileImage ) {
				profileImg = require( "../images/" + this.props.user.profileImage );
			} else {
				profileImg = require( "../images/defaultUser.png" );
			}
		} catch ( err ) {
			console.log( err );
		}
	}

	handleAddFriend = () => {
		api.addFriend( LSToken, this.props.user.username )
			.then( res => console.log( res ))
			.catch( err => console.log( err ));
	}

	handleFollow = () => {
		api.followUser( LSToken, this.props.user.username )
			.then( res => console.log( res ))
			.catch( err => console.log( err ));
	}

	render() {
		this.setImages();
		return (
			<Wrapper>
				<Header image={`url(${backgroundImg})`} />
				<Information>
					<BasicInfo>
						<UserImage src={profileImg} />
						<Names>
							<FullName className="fullname">
								{this.props.user.fullname}
							</FullName>
							<UserName className="username">
								@{this.props.user.username}
							</UserName>
						</Names>
					</BasicInfo>
					<Options>
						<Buttons>
							<Button
								onClick={this.handleAddFriend}
								primary
								size="tiny"
								content="Add Friend"
							/>
							<Button
								onClick={this.handleFollow}
								secondary
								size="tiny"
								content="Follow"
							/>
							<Button size="tiny" icon="mail outline" />
						</Buttons>
						<Keywords>
							#{this.props.user.keywords &&
								this.props.user.keywords.toString().replace( /,/g, " #" )}
						</Keywords>
					</Options>
					<Description>
						<p className="description">{this.props.user.description}</p>
					</Description>
				</Information>
				<BackButton
					className="backButton"
					secondary
					content="Back to menu"
					onClick={this.props.backToMenu}
				/>
				<NextButton
					className="nextButton"
					primary
					content="Next"
					onClick={this.props.next}
				/>
			</Wrapper>
		);
	}
}

export default ExploreProfile;
