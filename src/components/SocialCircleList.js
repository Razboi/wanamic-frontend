import React, { Component } from "react";
import { Icon, Image, Header } from "semantic-ui-react";
import styled from "styled-components";
import PropTypes from "prop-types";

const
	Wrapper = styled.div`
		height: ${props => props.popup ? "400px" : "100%"};
		width: ${props => props.popup ? "400px" : "100%"};
		overflow-y: auto;
		padding-bottom: 4rem;
		z-index: 4;
		::-webkit-scrollbar {
			display: block !important;
			width: 5px !important;
		}
		@media (max-width: 420px) {
			height: 100vh;
			width: 100%;
		}
	`,
	HeaderWrapper = styled.div`
		display: flex;
		align-items: center;
		padding-left: 0 10px;
		box-shadow: 0 1px 2px #111;
		height: 55px;
		min-height: 55px;
		padding: 0px 20px;
		color: #222;
		i {
			font-size: 1.5rem !important;
			color: #222;
		}
		@media (min-width: 420px) {
			box-shadow: none;
			i {
				:hover {
					cursor: pointer !important;
				}
			}
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
		this.previousHref = window.location.href;
	}

	componentDidMount() {
		window.history.pushState( null, null, "/socialCircle" );
		window.onpopstate = e => this.handlePopstate( e );
		this.setFriendsImages();
	}

	componentWillUnmount() {
		window.onpopstate = () => {};
	}

	handlePopstate = e => {
		e.preventDefault();
		this.handleBack();
	}

	handleBack = () => {
		window.history.pushState( null, null, this.previousHref );
		this.props.back();
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
			<Wrapper popup={this.props.popup}>
				<HeaderWrapper>
					<Icon
						name="arrow left"
						onClick={this.handleBack}
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
	back: PropTypes.func.isRequired,
	popup: PropTypes.bool,
};


export default SocialCircleList;
