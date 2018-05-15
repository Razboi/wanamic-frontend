import React, { Component } from "react";
import styled from "styled-components";
import NewsFeed from "../components/NewsFeed";
import ProfileOptions from "../components/ProfileOptions";
import api from "../services/api";
import InfiniteScroll from "react-infinite-scroller";
import PropTypes from "prop-types";
var
	backgroundImg,
	profileImg;

const
	Wrapper = styled.div`
		height: 100vh;
		width: 100%;
		overflow: auto;
		::-webkit-scrollbar {
			@media (max-width: 420px) {
				display: none !important;
			}
		}
	`,
	StyledInfiniteScroll = styled( InfiniteScroll )`
		@media (max-width: 420px) {
			height: 100%;
			width: 100%;
			display: grid;
			grid-template-columns: 100%;
			grid-template-rows: 25% 45% auto;
			grid-template-areas:
				"h"
				"i"
				"p"
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
	UserName = styled.h2`
		@media (max-width: 420px) {
			margin: 0px;
		}
	`,
	NickName = styled.span`
		@media (max-width: 420px) {
			color: #D3D3D3;
		}
	`,
	Description = styled.div`
		@media (max-width: 420px) {
			padding: 10px;
			grid-area: d;
			text-align: left;
			align-self: center;
		}
	`,
	Timeline = styled.div`
		@media (max-width: 420px) {
			grid-area: p;
		}
	`;


class ProfilePage extends Component {
	constructor() {
		super();
		this.state = {
			user: undefined,
			posts: [],
			hasMore: true,
			skip: 1,
			isInfiniteLoading: false,
			inexistent: false,
			requested: false
		};
	}

	componentDidMount() {
		this.refreshTimeline();
		api.isRequested( this.props.match.params.username )
			.then( res => this.setState({ requested: res.data }))
			.catch( err => console.log( err ));

		api.getUserInfo( this.props.match.params.username )
			.then( res => {
				this.setImages( res.data.headerImage, res.data.profileImage );
				this.setState({ user: res.data });
			})
			.catch( err => {
				console.log( err );
				this.setState({ inexistent: true });
			});
	}

	setImages( headerImage, profileImage ) {
		try {
			if ( headerImage ) {
				backgroundImg = require( "../images/" + headerImage );
			} else {
				backgroundImg = require( "../images/defaultbg.png" );
			}
		} catch ( err ) {
			console.log( err );
		}

		try {
			if ( profileImage ) {
				profileImg = require( "../images/" + profileImage );
			} else {
				profileImg = require( "../images/defaultUser.png" );
			}
		} catch ( err ) {
			console.log( err );
		}
	}

	getTimeline = () => {
		if ( this.state.hasMore && !this.state.isInfiniteLoading ) {
			this.setState({ isInfiniteLoading: true });
			api.getTimeline( this.state.skip, this.props.match.params.username )
				.then( res => {
					if ( res.data.length < 10 ) {
						this.setState({ hasMore: false, isInfiniteLoading: false });
						return;
					}
					this.setState({
						posts: [ ...this.state.posts, ...res.data ],
						isInfiniteLoading: false,
						skip: this.state.skip + 1
					});
				}).catch( err => console.log( err ));
		}
	}

	refreshTimeline = () => {
		api.getTimeline( 0, this.props.match.params.username )
			.then( res => {
				this.setState({ posts: res.data });
			}).catch( err => console.log( err ));
	}

	handleAddFriend = () => {
		api.addFriend( this.props.match.params.username )
			.catch( err => console.log( err ));
	}

	handleFollow = () => {
		api.followUser( this.props.match.params.username )
			.catch( err => console.log( err ));
	}

	handleReqAccept = () => {
		api.acceptRequest( this.props.match.params.username )
			.catch( err => console.log( err ));
	}

	handleReqDelete = () => {
		api.acceptRequest( this.props.match.params.username )
			.catch( err => console.log( err ));
	}

	handleDeleteFriend = () => {
		api.deleteFriend( this.props.match.params.username )
			.catch( err => console.log( err ));
	}

	render() {
		if ( this.state.inexistent ) {
			return (
				<h2>This account doesn't exist</h2>
			);
		}
		if ( !this.state.user ) {
			return null;
		}
		return (
			<Wrapper>
				<StyledInfiniteScroll
					pageStart={this.state.skip}
					hasMore={this.state.hasMore}
					loadMore={this.getTimeline}
					initialLoad={false}
					useWindow={false}
				>
					<Header image={`url(${backgroundImg})`} />

					<Information>
						<BasicInfo>
							<UserImage src={profileImg} />
							<Names>
								<UserName>{this.state.user.fullname}</UserName>
								<NickName>@{this.state.user.username}</NickName>
							</Names>
						</BasicInfo>

						<ProfileOptions
							user={this.state.user}
							handleAddFriend={this.handleAddFriend}
							handleFollow={this.handleFollow}
							handleReqAccept={this.handleReqAccept}
							handleReqDelete={this.handleReqDelete}
							requested={this.state.requested}
							handleDeleteFriend={this.handleDeleteFriend}
						/>

						<Description>
							<p>{this.state.user.description}</p>
						</Description>
					</Information>

					<Timeline>
						<NewsFeed posts={this.state.posts} />
					</Timeline>
				</StyledInfiniteScroll>
			</Wrapper>
		);
	}
}

ProfilePage.propTypes = {
	match: PropTypes.shape({
		params: PropTypes.shape({
			username: PropTypes.string.isRequired
		})
	}),
};

export default ProfilePage;
