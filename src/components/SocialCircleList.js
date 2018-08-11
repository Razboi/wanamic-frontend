import React, { Component } from "react";
import { Icon, Image, Header } from "semantic-ui-react";
import styled from "styled-components";
import PropTypes from "prop-types";

const
	Wrapper = styled.div`
		height: 100vh;
		width: 100%;
		position: absolute;
		z-index: 4;
		background: #fff;
		@media (min-width: 420px) {
			height: 100%;
			background: none;
			top: 0;
		}
	`,
	HeaderWrapper = styled.div`
		height: 49.33px;
		display: flex;
		align-items: center;
		padding-left: 10px;
		border-bottom: 1px solid rgba(0, 0, 0, .5);
		@media (min-width: 420px) {
			border: none;
		}
	`,
	HeaderTxt = styled.span`
		margin-left: 15px;
		font-weight: bold;
		font-size: 16px;
		@media (min-width: 420px) {
			font-size: 1rem;
		}
	`,
	Friend = styled.div`
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: 1rem;
		border-bottom: 1px solid rgba(0, 0, 0, .1);
		@media (min-width: 420px) {
			border: none;
			padding: 0 1rem 1rem 1rem;
		}
		:hover {
			cursor: pointer;
		}
	`,
	FriendImg = styled( Image )`
		width: 40px !important;
		height: 40px !important;
		align-self: flex-start;
		@media (min-width: 420px) {
			width: 30px !important;
			height: 30px !important;
			align-self: center;
		}
	`,
	FriendData = styled( Header )`
		margin-top: 0 !important;
		margin-left: 0.66rem !important;
		font-family: inherit !important;
	`,
	Fullname = styled.span`
		font-size: 1.1475rem !important;
		@media (min-width: 420px) {
			font-size: 1rem !important;
			font-weight: 500 !important;
		}
	`,
	Username = styled( Header.Subheader )`
	`;


class SocialCircleList extends Component {
	constructor() {
		super();
		this.state = {
			socialCircleImages: []
		};
	}

	componentDidMount() {
		this.setFriendsImages();
	}

	setFriendsImages = async() => {
		var images = [];
		const s3Bucket = "https://d3dlhr4nnvikjb.cloudfront.net/";
		for ( const friend of this.props.socialCircle ) {
			try {
				if ( friend.profileImage ) {
					process.env.REACT_APP_STAGE === "dev" ?
						images.push( require( "../images/" + friend.profileImage ))
						:
						images.push( s3Bucket + friend.profileImage );
				} else {
					images.push( require( "../images/defaultUser.png" ));
				}
			} catch ( err ) {
				console.log( err );
			}
		}
		this.setState({ socialCircleImages: images });
	}

	render() {
		return (
			<Wrapper>
				<HeaderWrapper>
					<Icon
						name="arrow left"
						onClick={this.props.back}
						className="arrowBack"
					/>
					<HeaderTxt>Social Circle</HeaderTxt>
				</HeaderWrapper>
				<div className="socialCircleList">
					{this.props.socialCircle.map(( friend, index ) =>
						<Friend
							key={index}
							className="friend"
							onClick={() => this.props.handleNewConversation( friend )}
						>
							<FriendImg
								circular
								src={this.state.socialCircleImages[ index ]}
							/>
							<FriendData>
								<Fullname>{friend.fullname}</Fullname>
								<Username>@{friend.username}</Username>
							</FriendData>
						</Friend>
					)}
				</div>
			</Wrapper>
		);
	}
}

SocialCircleList.propTypes = {
	socialCircle: PropTypes.array.isRequired,
	handleNewConversation: PropTypes.func.isRequired,
	back: PropTypes.func.isRequired
};


export default SocialCircleList;
