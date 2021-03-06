import React, { Component } from "react";
import styled from "styled-components";
import { Icon } from "semantic-ui-react";
import api from "../services/api";
import PropTypes from "prop-types";
import SharedPost from "./SharedPost";
import { addPost, switchShare, updatePost } from "../services/actions/posts";
import { connect } from "react-redux";
import refreshToken from "../utils/refreshToken";
import InputTrigger from "../utils/inputTrigger";
import Suggestions from "../components/Suggestions";
import extract from "../utils/extractMentionsHashtags";

const
	Wrapper = styled.div`
		position: absolute;
		z-index: 20;
		background: #222;
		color: #fff !important;
		overflow-y: auto;
		height: 100%;
		width: 100%;
		display: flex;
		flex-direction: column;
		@media (min-width: 760px) and (min-height: 700px) {
			height: 700px;
			width: 600px;
			border-radius: 2px;
		}
		::-webkit-scrollbar {
			display: block !important;
			width: 5px !important;
			background: #fff;
		}
	`,
	HeaderWrapper = styled.div`
		display: flex;
		z-index: 2;
		align-items: center;
		justify-content: space-between;
		box-shadow: 0 1px 2px #111;
		i {
			font-size: 1.5rem !important;
		}
		@media (max-width: 420px) {
			height: 55px;
			min-height: 55px;
			padding: 0px 20px;
		}
		@media (min-width: 420px) {
			height: 80px;
			min-height: 80px;
			padding: 0px 40px;
			i {
				:hover {
					cursor: pointer !important;
				}
			}
		}
	`,
	HeaderTxt = styled.span`
		font-weight: bold;
		font-size: 1.35rem;
		@media (max-width: 450px) {
			font-size: 1.2rem;
		}
	`,
	InputWrapper = styled.div`
		position: relative;
		margin-top: 2rem;
	`,
	UserContentInput = {
		width: "90%",
		minHeight: "45px",
		zIndex: 2,
		fontFamily: "inherit",
		background: "none",
		border: "none",
		resize: "none"
	},
	InputTriggerStyles = {
		gridArea: "inp",
		display: "flex",
		justifyContent: "center",
		zIndex: 2,
		height: "100%"
	},
	SuggestionsWrapper = styled.div`
		display: ${props => !props.showSuggestions && "none"};
		z-index: 3;
		position: fixed;
		width: 100%;
		height: 80%;
		bottom: 0;
		left: 0;
		border: 1px solid rgba(0,0,0,0.1);
		@media (min-width: 420px) {
			position: absolute;
			bottom: auto;
			height: 150px;
			width: 300px;
			top: calc( ${props => props.top}px + 40px );
			left: ${props => props.left < 280 ? props.left + "px" : "auto"};
			right: ${props => props.left > 280 ? 0 + "px" : "auto"};
		}
	`,
	ShareMain = styled.div`
		grid-area: mai;
		position: relative;
	`,
	PostToShare = styled.div`
		transform: scale( 0.75 );
		background: #fff;
		max-width: 390px;
    margin: 0 auto 3rem auto;
	`;

class Share extends Component {
	constructor() {
		super();
		this.state = {
			description: "",
			step: 1,
			socialCircle: [],
			showSuggestions: false,
			suggestionsTop: undefined,
			suggestionsLeft: undefined,
			mentionInput: "",
			currentSelection: 0,
			startPosition: undefined
		};
		this.scrollAlreadyBlocked = false;
		this.previousHref = undefined;
	}

	componentDidMount() {
		document.body.style.overflowY === "hidden" ?
			this.scrollAlreadyBlocked = true
			:
			document.body.style.overflowY = "hidden";
		if ( !this.props.displayPostDetails ) {
			this.previousHref = window.location.href;
			window.history.pushState( null, null, "/share" );
			window.onpopstate = e => this.handlePopstate( e );
		}
		this.getSocialCircle();
	}

	componentWillUnmount() {
		if ( !this.scrollAlreadyBlocked ) {
			document.body.style.overflowY = "auto";
		}
		if ( !this.props.displayPostDetails ) {
			window.history.pushState( null, null, this.previousHref );
		}
	}

	handlePopstate = e => {
		e.preventDefault();
		this.props.switchShare();
	}

	getSocialCircle = () => {
		api.getSocialCircle()
			.then( res => {
				if ( res === "jwt expired" ) {
					refreshToken()
						.then(() => this.getSocialCircle())
						.catch( err => console.log( err ));
				} else {
					this.setState({ socialCircle: res.data });
				}
			}).catch( err => console.log( err ));
	}

	handleKeyPress = e => {
		if ( e.key === "Enter" ) {
			e.preventDefault();
			if ( this.state.showSuggestions ) {
				const
					{ description, startPosition, currentSelection } = this.state,
					user = this.state.socialCircle[ currentSelection ],
					updatedDescription =
						description.slice( 0, startPosition - 1 )
						+ "@" + user.username + " " +
						description.slice( startPosition + user.username.length, description.length );

				this.setState({
					description: updatedDescription,
					startPosition: undefined,
					showSuggestions: false,
					suggestionsLeft: undefined,
					suggestionsTop: undefined,
					mentionInput: "",
					currentSelection: 0
				});

				this.endHandler();
			} else {
				this.props.nextStep();
			}
		}

		if ( this.state.showSuggestions ) {
			if ( e.keyCode === 40 &&
			this.state.currentSelection !== this.state.socialCircle.length - 1 ) {
				e.preventDefault();
				this.setState({
					currentSelection: this.state.currentSelection + 1
				});
			}

			if ( e.keyCode === 38 && this.state.currentSelection !== 0 ) {
				e.preventDefault();
				this.setState({
					currentSelection: this.state.currentSelection - 1
				});
			}
		}
	}

	toggleSuggestions = metaData => {
		if ( metaData.hookType === "start" &&
			( this.state.description.length + 31 ) <= 2200 ) {
			this.setState({
				startPosition: metaData.cursor.selectionStart,
				showSuggestions: true,
				suggestionsLeft: metaData.cursor.left,
				suggestionsTop: metaData.cursor.top + metaData.cursor.height,
			});
		}

		if ( metaData.hookType === "cancel" ) {
			this.setState({
				startPosition: undefined,
				showSuggestions: false,
				suggestionsLeft: undefined,
				suggestionsTop: undefined,
				mentionInput: "",
				currentSelection: 0
			});
		}
	}
	selectFromMentions = user => {
		const
			{ description, startPosition } = this.state,
			updatedUserInput =
				description.slice( 0, startPosition - 1 )
				+ "@" + user.username + " " +
				description.slice( startPosition + user.username.length, description.length );

		this.setState({
			description: updatedUserInput,
			startPosition: undefined,
			showSuggestions: false,
			suggestionsLeft: undefined,
			suggestionsTop: undefined,
			mentionInput: "",
			currentSelection: 0
		});

		this.endHandler();
	}

	handleMentionInput = metaData => {
		if ( this.state.showSuggestions ) {
			this.setState({ mentionInput: metaData.text });
		}
	}

	handleChange = e => {
		this.setState({ [ e.target.name ]: e.target.value });
	}

	handleShare = async() => {
		var response;
		const { description } = this.state,

			{ mentions, hashtags } = await extract(
				description, { symbol: false, type: "all" }
			);

		try {
			response = await api.sharePost(
				this.props.postToShare._id, description, mentions, hashtags
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
			if ( response.mentionsNotifications ) {
				for ( const notification of response.mentionsNotifications ) {
					this.props.socket.emit( "sendNotification", notification );
				}
			}
		}
	}

	render() {
		if ( !this.props.authenticated ) {
			return null;
		}
		return (
			<Wrapper>
				<HeaderWrapper>
					<Icon
						className="backIcon"
						name="arrow left"
						onClick={() => this.props.switchShare()}
					/>
					<HeaderTxt>Share with Friends</HeaderTxt>
					<Icon
						className="nextIcon"
						name="check"
						onClick={this.handleShare}
					/>
				</HeaderWrapper>
				<InputWrapper>
					<InputTrigger
						style={InputTriggerStyles}
						trigger={{ key: "@" }}
						onStart={metaData => this.toggleSuggestions( metaData ) }
						onCancel={metaData => this.toggleSuggestions( metaData ) }
						onType={metaData => this.handleMentionInput( metaData ) }
						endTrigger={endHandler => this.endHandler = endHandler }
					>
						<textarea
							id="SharePostInput"
							maxLength="2200"
							style={UserContentInput}
							name="description"
							value={this.state.description}
							placeholder="Share your opinion, tag @users and add #hashtags..."
							onChange={this.handleChange}
							onKeyDown={this.handleKeyPress}
						/>
					</InputTrigger>

					<SuggestionsWrapper
						showSuggestions={this.state.showSuggestions}
						left={this.state.suggestionsLeft}
						top={this.state.suggestionsTop}
					>
						<Suggestions
							socialCircle={this.state.socialCircle}
							showSuggestions={this.state.showSuggestions}
							mentionInput={this.state.mentionInput}
							selectFromMentions={this.selectFromMentions}
							media={"true"}
						/>
					</SuggestionsWrapper>
				</InputWrapper>

				<ShareMain>
					<PostToShare>
						<SharedPost
							history={this.props.history}
							post={this.props.postToShare.sharedPost ?
								this.props.postToShare.sharedPost
								:
								this.props.postToShare
							}
						/>
					</PostToShare>
				</ShareMain>
			</Wrapper>
		);
	}
}

Share.propTypes = {
	postToShare: PropTypes.object.isRequired,
	switchShare: PropTypes.func.isRequired,
	socket: PropTypes.object.isRequired,
	history: PropTypes.object.isRequired
};

const
	mapStateToProps = state => ({
		postToShare: state.posts.postToShare,
		displayPostDetails: state.posts.displayPostDetails,
		authenticated: state.authenticated
	}),

	mapDispatchToProps = dispatch => ({
		updatePost: post => dispatch( updatePost( post )),
		addPost: post => dispatch( addPost( post )),
		switchShare: postIndex => dispatch( switchShare( postIndex ))
	});

export default connect( mapStateToProps, mapDispatchToProps )( Share );
