import React, { Component } from "react";
import { Dropdown, Modal, Form, Button } from "semantic-ui-react";
import styled from "styled-components";
import PropTypes from "prop-types";
import InputTrigger from "../utils/inputTrigger";
import Suggestions from "./Suggestions";
import api from "../services/api";
import refreshToken from "../utils/refreshToken";

const
	StyledDropdown = styled( Dropdown )`
		i {
			color: #555 !important;
		}
	`,
	UpdateModal = styled( Modal )`
		margin: 2rem auto 0 auto !important;
	`,
	UpdateForm = styled( Form )`
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	`,
	ReportModal = styled( Modal )`
		margin: 2rem auto 0 auto !important;
	`,
	ReportForm = styled( Form )`
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	`,
	TriggerStyle = {
		width: "90%"
	},
	TextAreaStyle = {
		color: "#111",
		fontFamily: "inherit",
		width: "100%"
	},
	UpdateButton = styled( Button )`
		background: rgb(133, 217, 191) !important;
		border-radius: 2px !important;
		font-family: inherit !important;
		margin-top: 1rem !important;
	`,
	ReportButton = styled( Button )`
		background: rgb(133, 217, 191) !important;
		border-radius: 2px !important;
		font-family: inherit !important;
		margin-top: 1rem !important;
	`,
	SuggestionsWrapper = styled.div`
		display: ${props => !props.showSuggestions && "none"};
		z-index: 3;
		border: 1px solid rgba(0,0,0,0.1);
		@media (min-width: 420px) {
			position: absolute;
			grid-area: none;
			height: 150px;
			width: 300px;
			top: ${props => props.top}px;
			left: ${props => props.left < 280 ? props.left + "px" : "auto"};
			right: ${props => props.left > 280 ? 0 + "px" : "auto"};
		}
		@media (max-width: 420px) {
			position: fixed;
			bottom: 0;
			left: 0;
			width: 100%;
			height: 50%;
		}
	`;

class DropdownOptions extends Component {
	constructor( props ) {
		super();
		this.state = {
			socialCircle: [],
			updatedContent: props.currentContent,
			openModal: false,
			showSuggestions: false,
			suggestionsTop: undefined,
			suggestionsLeft: undefined,
			mentionInput: "",
			currentSelection: 0,
			startPosition: undefined,
			report: false,
			reportContent: ""
		};
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
		if ( e.key === "Enter" && this.state.showSuggestions &&
		this.props.socialCircle.length > 0 ) {
			e.preventDefault();
			const
				{ updatedContent, startPosition, currentSelection } = this.state,
				user = this.state.socialCircle[ currentSelection ],
				updatedUserInput =
					updatedContent.slice( 0, startPosition - 1 )
					+ "@" + user.username + " " +
					updatedContent.slice( startPosition + user.username.length, updatedContent.length );

			this.setState({
				updatedContent: updatedUserInput,
				startPosition: undefined,
				showSuggestions: false,
				suggestionsLeft: undefined,
				suggestionsTop: undefined,
				mentionInput: "",
				currentSelection: 0
			});

			this.endHandler();
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

	selectFromMentions = user => {
		const
			{ updatedContent, startPosition } = this.state,
			updatedUserInput =
				updatedContent.slice( 0, startPosition - 1 )
				+ "@" + user.username + " " +
				updatedContent.slice( startPosition + user.username.length, updatedContent.length );

		this.setState({
			updatedContent: updatedUserInput,
			startPosition: undefined,
			showSuggestions: false,
			suggestionsLeft: undefined,
			suggestionsTop: undefined,
			mentionInput: "",
			currentSelection: 0
		});

		this.endHandler();
	}

	toggleSuggestions = metaData => {
		if ( metaData.hookType === "start" &&
			( this.state.updatedContent.length + 31 ) <= 2200 ) {
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

	handleMentionInput = metaData => {
		if ( this.state.showSuggestions ) {
			this.setState({ mentionInput: metaData.text });
		}
	}

	displayModal = report => {
		if ( report ) {
			this.setState({ report: true });
		} else {
			this.getSocialCircle();
			this.toggleModal();
		}
	}

	toggleModal = () => {
		if ( this.state.report ) {
			this.setState( state => ({ report: !state.report }));
		} else {
			this.setState( state => ({ openModal: !state.openModal }));
		}
	}

	handleUpdate = () => {
		this.toggleModal();
		this.props.handleUpdate( this.state.updatedContent );
	}

	handleReport = () => {
		this.toggleModal();
		this.props.handleReport( this.state.reportContent );
	}

	handleChange = e => {
		this.setState({ [ e.target.name ]: e.target.value });
	}

	render() {
		return (
			<StyledDropdown icon="angle down" style={this.props.style} direction="left">
				{ localStorage.getItem( "id" ) === this.props.author._id ?
					<Dropdown.Menu className="postDropdown">
						<UpdateModal
							open={this.state.openModal}
							onClose={this.toggleModal}
							trigger={
								<Dropdown.Item text="Update" onClick={this.displayModal} />}
						>
							<Modal.Content>
								<UpdateForm>
									<InputTrigger
										style={TriggerStyle}
										trigger={{ key: "@" }}
										onStart={metaData => this.toggleSuggestions( metaData ) }
										onCancel={metaData => this.toggleSuggestions( metaData ) }
										onType={metaData => this.handleMentionInput( metaData ) }
										endTrigger={endHandler => this.endHandler = endHandler }
									>
										<textarea
											style={TextAreaStyle}
											name="updatedContent"
											maxLength="2200"
											autoFocus
											rows="4"
											value={this.state.updatedContent}
											onChange={this.handleChange}
											onKeyDown={this.handleKeyPress}
										/>
									</InputTrigger>
									<UpdateButton
										primary
										content="Update"
										onClick={this.handleUpdate}
									/>

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
										/>
									</SuggestionsWrapper>
								</UpdateForm>
							</Modal.Content>
						</UpdateModal>

						<Dropdown.Item
							className="postDeleteOption"
							text="Delete"
							onClick={this.props.handleDelete}
						/>
					</Dropdown.Menu>
					:
					<Dropdown.Menu className="postDropdown">
						<ReportModal
							open={this.state.report}
							onClose={this.toggleModal}
							trigger={
								<Dropdown.Item
									text="Report"
									onClick={() => this.displayModal( true )}
								/>}
						>
							<Modal.Content>
								<ReportForm>
									<textarea
										style={TextAreaStyle}
										name="reportContent"
										maxLength="500"
										autoFocus
										rows="4"
										value={this.state.reportContent}
										onChange={this.handleChange}
										onKeyDown={this.handleKeyPress}
									/>
									<ReportButton
										primary
										content="Report"
										onClick={this.handleReport}
									/>
								</ReportForm>
							</Modal.Content>
						</ReportModal>
					</Dropdown.Menu>
				}
			</StyledDropdown>
		);
	}
}

DropdownOptions.propTypes = {
	author: PropTypes.object.isRequired,
	handleDelete: PropTypes.func.isRequired,
	handleUpdate: PropTypes.func.isRequired,
	handleReport: PropTypes.func.isRequired,
	currentContent: PropTypes.string.isRequired
};

export default DropdownOptions;
