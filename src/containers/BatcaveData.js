import React, { Component } from "react";
import {
	Table, Checkbox, Dropdown, Button, Form
} from "semantic-ui-react";
import styled from "styled-components";
import api from "../services/api";
import refreshToken from "../utils/refreshToken";
import PostDetails from "./PostDetails";
import Comment from "./Comment";
import { switchPostDetails } from "../services/actions/posts";
import PropTypes from "prop-types";
import { connect } from "react-redux";

const
	Wrapper = styled.div`
		height: 100%;
		width: 100%;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		background: #111;
	`,
	Section = styled.div`
		display: flex;
	`,
	Block = styled.section`
		color: #fff;
		text-align: center;
		border: 1px solid #fff;
		border-radius: 5px;
		padding: 1rem;
		font-size: 1.2rem;
		margin: 1rem;
		margin-bottom: 2rem;
		max-height: 600px;
		overflow-y: auto;
		@media (max-width: 420px) {
			margin: 0 !important;
		}
	`,
	StyledTable = styled( Table )`
		width: 100% !important;
	`,
	PostDetailsDimmer = styled.div`
		position: fixed;
		height: 100%;
		width: 100%;
		z-index: 5;
		background: rgba(0,0,0,0.6);
		display: flex;
		align-items: center;
		justify-content: center;
	`,
	Options = styled.div`
		display: flex;
		@media (max-width: 420px) {
			position: fixed;
			top: 6rem;
			right: 5px;
		}
	`,
	CommentWrapper = styled.div`
		position: absolute;
		top: 0;
		bottom: 0;
		margin: auto;
		background: #fff;
		padding: 1rem;
	`,
	ViewPostButton = styled( Button )`
		position: fixed;
		top: 1rem;
		right: 1rem;
	`,
	ClubWrapper = styled.div`
		position: absolute;
		top: 0;
		bottom: 0;
		height: 100%;
		width: 100%;
		max-height: 400px;
		max-width: 400px;
		margin: auto;
		background: #fff;
		padding: 1rem;
		display: flex;
    flex-direction: column;
		overflow-y: auto;
		z-index: 5;
		h2, h4 {
			font-family: inherit;
		}
		p {
			word-break: break-word;
		}
		::-webkit-scrollbar {
			display: block !important;
			width: 5px !important;
		}
	`,
	FeedbackForm = styled( Form )`
	`;

class BatcaveData extends Component {
	constructor() {
		super();
		this.state = {
			data: undefined,
			selectedTicket: undefined,
			visualizedComment: undefined,
			visualizedClubRequest: undefined,
			commentDetails: false,
			clubDetails: false,
			rejectForm: false,
			feedback: ""
		};
	}

	componentDidMount() {
		this.getBatcaveData();
	}

	getBatcaveData = async() => {
		try {
			const res = await api.batcaveData();
			this.setState({ data: res });
		} catch ( err ) {
			console.log( err );
			if ( err.response.data === "jwt expired" ) {
				await refreshToken();
				this.handleContinue();
			}
		}
	}

	visualize = ticket => {
		this.setState({ selectedTicket: ticket._id });
		switch ( true ) {
		case ticket.type === "post":
			this.visualizePost( ticket.object );
			break;
		case ticket.type === "comment":
			this.visualizeComment( ticket.object );
			break;
		case ticket.clubRequest:
			this.visualizeClubRequest( ticket.clubName );
			break;
		default:
			this.visualizePost( ticket.object );
		}
	}

	visualizePost = async postId => {
		try {
			const res = await api.getPost( postId );
			this.props.switchPostDetails( res.data );
		} catch ( err ) {
			console.log( err );
			if ( err.response.data === "jwt expired" ) {
				await refreshToken();
				this.visualizePost();
			}
		}
	}

	visualizeComment = async commentId => {
		try {
			const res = await api.getComment( commentId );
			this.setState({ visualizedComment: res.data, commentDetails: true });
		} catch ( err ) {
			console.log( err );
			if ( err.response.data === "jwt expired" ) {
				await refreshToken();
				this.visualizeComment();
			}
		}
	}

	visualizeClubRequest = async clubId => {
		try {
			const res = await api.getClub( clubId );
			this.setState({
				visualizedClubRequest: res.data,
				clubDetails: true
			});
		} catch ( err ) {
			console.log( err );
			if ( err.response.data === "jwt expired" ) {
				await refreshToken();
				this.visualizeClubRequest();
			}
		}
	}

	removeTicket = async() => {
		let { selectedTicket } = this.state;
		if ( !selectedTicket ) {
			return;
		}
		try {
			await api.removeTicket( selectedTicket );
			this.deleteSelectedTicket();
		} catch ( err ) {
			console.log( err );
			if ( err.response.data === "jwt expired" ) {
				await refreshToken();
				this.removeTicket();
			}
		}
	}

	deleteObject = async() => {
		let { selectedTicket } = this.state;
		if ( !selectedTicket ) {
			return;
		}
		try {
			await api.deleteObject( selectedTicket );
			this.deleteSelectedTicket();
		} catch ( err ) {
			console.log( err );
			if ( err.response.data === "jwt expired" ) {
				await refreshToken();
				this.deleteObject();
			}
		}
	}

	banUser = async() => {
		let { selectedTicket } = this.state;
		if ( !selectedTicket ) {
			return;
		}
		try {
			await api.banUser( selectedTicket );
			this.deleteSelectedTicket();
		} catch ( err ) {
			console.log( err );
			if ( err.response.data === "jwt expired" ) {
				await refreshToken();
				this.banUser();
			}
		}
	}

	hidePopups = () => {
		this.setState({ clubDetails: false, rejectForm: false });
	}

	viewPost = () => {
		this.setState({ commentDetails: false });
		this.visualizePost( this.state.visualizedComment.post );
	}

	handleApprove = async() => {
		const { visualizedClubRequest } = this.state;
		try {
			await api.approveClub( visualizedClubRequest._id );
			this.deleteSelectedTicket();
			this.hidePopups();
		} catch ( err ) {
			if ( err.response.data === "jwt expired" ) {
				await refreshToken();
				this.handleApprove();
			} else {
				console.log( err );
			}
		}
	}

	deleteSelectedTicket = () => {
		const { selectedTicket, data } = this.state;
		let updatedTickets = data.tickets.filter( ticket => {
			return ticket._id !== selectedTicket;
		});
		data.tickets = updatedTickets;
		this.setState({ data: data, selectedTicket: undefined });
	}

	handleRejectForm = () => {
		this.setState({ rejectForm: true });
	}

	reject = async() => {
		const { visualizedClubRequest, feedback } = this.state;
		if ( !feedback ) {
			return;
		}
		try {
			await api.rejectClub( visualizedClubRequest._id, feedback );
			this.deleteSelectedTicket();
			this.hidePopups();
			this.setState({ rejectForm: false });
		} catch ( err ) {
			if ( err.response.data === "jwt expired" ) {
				await refreshToken();
				this.reject();
			} else {
				console.log( err );
			}
		}
	}

	handleChange = e => {
		this.setState({ [ e.target.name ]: e.target.value });
	}

	render() {
		let {
			data, commentDetails, visualizedComment, clubDetails, visualizedClubRequest
		} = this.state;
		if ( !data ) {
			return (
				<Wrapper>
					<div className="lds-ring"><div></div><div></div><div></div><div></div></div>
				</Wrapper>
			);
		}

		return (
			<Wrapper>
				{ clubDetails &&
					<React.Fragment>
						<PostDetailsDimmer onClick={this.hidePopups} />
						<ClubWrapper>
							{this.state.rejectForm ?
								<FeedbackForm>
									<textarea
										name="feedback"
										onChange={this.handleChange}
										value={this.state.feedback}
									/>
									<Button
										content="REJECT"
										color="red"
										onClick={this.reject}
									/>
								</FeedbackForm>
								:
								<div>
									<h2>Club Request</h2>
									<h4>name:</h4>
									<p>{visualizedClubRequest.name}</p>
									<h4>title:</h4>
									<p>{visualizedClubRequest.title}</p>
									<h4>description:</h4>
									<p>{visualizedClubRequest.description}</p>
									<div>
										<Button
											content="Approve"
											primary
											onClick={this.handleApprove}
										/>
										<Button
											content="Reject"
											secondary
											onClick={this.handleRejectForm}
										/>
									</div>
								</div>
							}
						</ClubWrapper>
					</React.Fragment>
				}
				{ commentDetails && !clubDetails &&
					<React.Fragment>
						<ViewPostButton content="View post" onClick={this.viewPost} />
						<CommentWrapper>
							<Comment comment={visualizedComment} />
						</CommentWrapper>
					</React.Fragment>
				}
				{ this.props.displayPostDetails && !commentDetails && !clubDetails &&
					<PostDetailsDimmer>
						<PostDetails
							socket={this.props.socket}
							history={this.props.history}
						/>
					</PostDetailsDimmer>
				}
				<Section className="usersCount">
					<Block>
						<h4>Users Count</h4>
						<span>{data.usersCount}</span>
					</Block>
					<Block>
						<h4>Month</h4>
						<span>{data.lastMonthUsers}</span>
					</Block>
					<Block>
						<h4>Week</h4>
						<span>{data.lastWeekUsers}</span>
					</Block>
					<Block>
						<h4>24h</h4>
						<span>{data.last24Users}</span>
					</Block>
				</Section>
				<Section className="TicketsTable">
					<Block className="TicketsTable">
						<Options>
							<Dropdown text="Actions" button>
								<Dropdown.Menu>
									<Dropdown.Item
										content="Remove Ticket"
										disabled={!this.state.selectedTicket}
										onClick={this.removeTicket}
									/>
									<Dropdown.Item
										content="Delete object"
										disabled={!this.state.selectedTicket}
										onClick={this.deleteObject}
									/>
									<Dropdown.Item
										content="Ban user"
										disabled={!this.state.selectedTicket}
										onClick={this.banUser}
									/>
								</Dropdown.Menu>
							</Dropdown>
						</Options>
						<StyledTable basic inverted>
							<Table.Header>
								<Table.Row>
									<Table.HeaderCell>Author</Table.HeaderCell>
									<Table.HeaderCell>Content</Table.HeaderCell>
									<Table.HeaderCell>Object</Table.HeaderCell>
								</Table.Row>
							</Table.Header>
							<Table.Body>
								{data.tickets.map(( ticket, index ) =>
									<Table.Row key={index}>
										<Table.Cell>{ticket.author}</Table.Cell>
										<Table.Cell>{ticket.content}</Table.Cell>
										<Table.Cell onClick={() => this.visualize( ticket )}>
											{ticket.object}
										</Table.Cell>
										<Table.Cell>
											<Checkbox
												onClick={() => this.setState({ selectedTicket: ticket._id })}
												checked={this.state.selectedTicket === ticket._id}
											/>
										</Table.Cell>
									</Table.Row>
								)}
							</Table.Body>
						</StyledTable>
					</Block>
				</Section>
			</Wrapper>
		);
	}
}

BatcaveData.propTypes = {
	history: PropTypes.object.isRequired,
	socket: PropTypes.object.isRequired
};

const
	mapStateToProps = state => ({
		displayPostDetails: state.posts.displayPostDetails
	}),

	mapDispatchToProps = dispatch => ({
		switchPostDetails: post => dispatch( switchPostDetails( post ))
	});

export default connect( mapStateToProps, mapDispatchToProps )( BatcaveData );
