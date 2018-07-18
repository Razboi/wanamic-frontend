import React, { Component } from "react";
import styled from "styled-components";
import { Icon, Input } from "semantic-ui-react";
import api from "../services/api";
import PropTypes from "prop-types";
import SharedPost from "./SharedPost";
import { addPost, switchShare, updatePost } from "../services/actions/posts";
import { connect } from "react-redux";
import refreshToken from "../utils/refreshToken";
import MediaStep3 from "../components/MediaStep3";

const
	Wrapper = styled.div`
		position: absolute;
		height: 100vh;
		width: 100%;
		z-index: 4;
		background: rgb( 70,70,70 );
		color: #fff !important;
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
		justify-content: space-between;
		padding: 0px 10px;
	`,
	HeaderTxt = styled.span`
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
		background: #fff;
	`;

class Share extends Component {
	constructor() {
		super();
		this.state = {
			shareComment: "",
			step: 1,
			privacyRange: 1,
			checkNsfw: false,
			checkSpoiler: false,
		};
	}

	handleChange = e => {
		this.setState({ [ e.target.name ]: e.target.value });
	}

	handleShare = async() => {
		var response;
		const {
				shareComment, privacyRange, checkNsfw, checkSpoiler
			} = this.state,
			alerts = { nsfw: checkNsfw, spoiler: checkSpoiler };

		try {
			response = await api.sharePost(
				this.props.postToShare._id, shareComment, privacyRange, alerts
			);
		} catch ( err ) {
			console.log( err );
		}

		if ( response === "jwt expired" ) {
			await refreshToken();
			this.handleShare();
		} else if ( response.data ) {
			this.props.addPost( response.data.newPost );
			this.props.updatePost( response.data.postToShare );
			this.props.switchShare( undefined );
		}
	}

	nextStep = () => {
		this.setState({ step: this.state.step + 1 });
	}

	prevStep = () => {
		if ( this.state.step !== 1 ) {
			this.setState({ step: this.state.step - 1 });
		}
	}

	setPrivacyRange = range => {
		this.setState({ privacyRange: range });
	}

	handleCheck = ( e, semanticUiProps ) => {
		this.setState({ [ semanticUiProps.name ]: semanticUiProps.checked });
	}

	render() {
		if ( this.state.step === 2 ) {
			return (
				<Wrapper>
					<MediaStep3
						handleCheck={this.handleCheck}
						setPrivacyRange={this.setPrivacyRange}
						prevStep={this.prevStep}
						handleSubmit={this.handleShare}
						mediaData={{}}
						privacyRange={this.state.privacyRange}
					/>
				</Wrapper>
			);
		}
		return (
			<Wrapper>
				<HeaderWrapper>
					<Icon
						className="backIcon"
						name="arrow left"
						onClick={() => this.props.switchShare( undefined )}
					/>
					<HeaderTxt>Share</HeaderTxt>
					<Icon
						className="nextIcon"
						name="check"
						onClick={this.nextStep}
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
							<SharedPost
								post={this.props.postToShare.sharedPost ?
									this.props.postToShare.sharedPost
									:
									this.props.postToShare
								}
							/>
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

const
	mapStateToProps = state => ({
		postToShare: state.posts.postToShare
	}),

	mapDispatchToProps = dispatch => ({
		updatePost: post => dispatch( updatePost( post )),
		addPost: post => dispatch( addPost( post )),
		switchShare: postIndex => dispatch( switchShare( postIndex ))
	});

export default connect( mapStateToProps, mapDispatchToProps )( Share );
