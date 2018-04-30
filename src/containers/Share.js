import React, { Component } from "react";
import styled from "styled-components";
import { Icon, Input } from "semantic-ui-react";
import api from "../services/api";
import Post from "../containers/Post";
import MediaPost from "../containers/MediaPost";

const
	Wrapper = styled.div`
		position: absolute;
		height: 100vh;
		width: 100%;
		z-index: 3;
		background: #fff;
		display: grid;
		grid-template-columns: 100%;
		grid-template-rows: 7% 93%;
		grid-template-areas:
			"hea"
			"com"
	`,
	HeaderWrapper = styled.div`
		grid-area: hea;
		display: flex;
		align-items: center;
		padding: 0px 10px;
		border-bottom: 1px solid rgba(0, 0, 0, .5);
	`,
	HeaderTxt = styled.span`
		margin-left: 15px;
		font-weight: bold;
		font-size: 16px;
	`,
	ShareWrapper = styled.div`
		grid-area: com;
		display: grid;
		grid-template-columns: 100%;
		grid-template-rows: 10% 90%;
		grid-template-areas:
			"inp"
			"mai"
	`,
	ShareInput = styled( Input )`
		grid-area: inp;
		align-self: flex-end;
		justify-self: center;
		width: 90%;
	`,
	ShareMain = styled.div`
		grid-area: mai;
	`,
	PostToShare = styled.div`
		transform: scale( 0.75 );
		border: 1px solid #808080;
	`,
	CheckIcon = styled( Icon )`
		margin-left: auto !important;
	`;

class Share extends Component {
	constructor() {
		super();
		this.state = {
			shareComment: ""
		};
	}

	handleChange = e => {
		this.setState({ [ e.target.name ]: e.target.value });
	}

	handleShare = () => {
		api.sharePost( this.props.postToShare._id, this.state.shareComment )
			.catch( err => console.log( err ));
		this.props.switchShare( false );
	}

	render() {
		return (
			<Wrapper>
				<HeaderWrapper>
					<Icon
						className="backIcon"
						name="arrow left"
						onClick={() => this.props.switchShare( false )}
					/>
					<HeaderTxt>Share</HeaderTxt>
					<CheckIcon
						className="nextIcon"
						name="check"
						onClick={this.handleShare}
					/>
				</HeaderWrapper>
				<ShareWrapper>
					<ShareInput
						name="shareComment"
						placeholder="Add a comment..."
						onChange={this.handleChange}
					/>
					<ShareMain>
						<PostToShare>
							{this.props.postToShare.media ?
								<MediaPost
									author={this.props.postToShare.author}
									content={this.props.postToShare.content}
									mediaContent={this.props.postToShare.mediaContent}
									linkContent={this.props.postToShare.linkContent}
									date={this.props.postToShare.createdAt}
									link={this.props.postToShare.link}
									picture={this.props.postToShare.picture}
									likedBy={this.props.postToShare.likedBy}
									comments={this.props.postToShare.comments}
									sharedBy={this.props.postToShare.sharedBy}
									fakeOptions={true}
								/>
								:
								<Post
									author={this.props.postToShare.author}
									content={this.props.postToShare.content}
									date={this.props.postToShare.createdAt}
									likedBy={this.props.postToShare.likedBy}
									comments={this.props.postToShare.comments}
									sharedBy={this.props.postToShare.sharedBy}
									fakeOptions={true}
								/>}
						</PostToShare>
					</ShareMain>
				</ShareWrapper>
			</Wrapper>
		);
	}
}

export default Share;
