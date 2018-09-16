import React, { Component } from "react";
import Post from "../containers/Post";
import MediaPost from "../containers/MediaPost";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Button, Dropdown } from "semantic-ui-react";

const
	Wrapper = styled.div`
		height: 100%;
		@media (max-width: 600px) {
			width: 100%;
			background: #fff;
			margin-top: 1rem;
		}
		@media (min-width: 600px) {
			width: 600px;
			padding-top: 1rem;
		}
	`,
	FeedSelectors = styled.div`
		background: rgb(230, 240, 236);
	`,
	Tab = styled( Button )`
		background-color: ${props => props.primary && "rgb(133,217,191)"} !important;
	`,
	ClubsList = styled( Dropdown.Menu )`
		max-height: 300px;
		overflow-y: auto;
		::-webkit-scrollbar {
			display: block !important;
			width: 5px !important;
		}
	`;

class NewsFeed extends Component {
	renderClub = ( club, index ) => {
		return (
			<Dropdown.Item
				key={index}
				text={club.name}
				onClick={() => this.props.selectClub( club )}
			/>
		);
	}
	render() {
		let { selectedClub } = this.props;
		return (
			<Wrapper>
				{ !this.props.hideTabs &&
					<FeedSelectors>
						<Tab
							content="Global"
							primary={this.props.feed === "global"}
							onClick={() => this.props.switchFeed( "global" )}
						/>
						<Tab
							content="Home"
							primary={this.props.feed === "home"}
							onClick={() => this.props.switchFeed( "home" )}
						/>
						<Tab
							primary={this.props.feed === "club"}
							content={
								<Dropdown text={selectedClub ? selectedClub : "Clubs"}>
									<ClubsList>
										{this.props.clubs.map( this.renderClub )}
									</ClubsList>
								</Dropdown>
							}
						/>
					</FeedSelectors>
				}
				{this.props.posts.map(( post, index ) =>
					post.media ?
						<MediaPost
							newsFeed
							key={index}
							index={index}
							post={post}
							socket={this.props.socket}
							history={this.props.history}
						/>
						:
						<Post
							key={index}
							index={index}
							post={post}
							socket={this.props.socket}
							history={this.props.history}
						/>
				)}
			</Wrapper>
		);
	}
}

NewsFeed.propTypes = {
	posts: PropTypes.array.isRequired,
	socket: PropTypes.object.isRequired,
	history: PropTypes.object.isRequired,
	feed: PropTypes.string,
	switchFeed: PropTypes.func,
	clubs: PropTypes.array,
	selectedClub: PropTypes.string,
	selectClub: PropTypes.func,
	clubAdmin: PropTypes.bool
};

export default NewsFeed;
