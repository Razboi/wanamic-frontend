import React, { Component } from "react";
import styled from "styled-components";
import { Icon, Input } from "semantic-ui-react";
import api from "../services/api";
import PropTypes from "prop-types";
import SharedPost from "./SharedPost";

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
							<SharedPost post={this.props.postToShare} />
						</PostToShare>
					</ShareMain>
				</ShareWrapper>
			</Wrapper>
		);
	}
}

Share.propTypes = {
	postToShare: PropTypes.object.isRequired,
	switchShare: PropTypes.func.isRequired,
};

export default Share;
