import React, { Component } from "react";
import { Table, Checkbox, Button, Dropdown } from "semantic-ui-react";
import styled from "styled-components";
import api from "../services/api";
import refreshToken from "../utils/refreshToken";
import PostDetails from "../containers/PostDetails";
import Comment from "../containers/Comment";
import PropTypes from "prop-types";

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
	OutsideClickHandler = styled.div`
		width: 100%;
		height: 100%;
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
		background: #fff;
		padding: 1rem;
	`,
	ViewPostButton = styled( Button )`
		position: fixed;
		top: 1rem;
		right: 1rem;
	`;

class BatcaveData extends Component {
	constructor() {
		super();
		this.state = {
			data: undefined,
			visualizedPost: {},
			postDetails: false,
			visualizedComment: {},
			commentDetails: false,
			selectedTicket: undefined
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
		if ( ticket.type === "post" ) {
			this.visualizePost( ticket.object );
		} else {
			this.visualizeComment( ticket.object );
		}
	}

	visualizePost = async postId => {
		try {
			const res = await api.getPost( postId );
			this.setState({ visualizedPost: res.data, postDetails: true });
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

	hideDetails = () => {
		this.setState({ postDetails: false, commentDetails: false });
	}

	removeTicket = async() => {
		let { data, selectedTicket } = this.state;
		if ( !selectedTicket ) {
			return;
		}
		try {
			await api.removeTicket( selectedTicket );
			let updatedTickets = data.tickets.filter( ticket => {
				return ticket._id !== selectedTicket;
			});
			data.tickets = updatedTickets;
			this.setState({ data: data, selectedTicket: undefined });
		} catch ( err ) {
			console.log( err );
			if ( err.response.data === "jwt expired" ) {
				await refreshToken();
				this.removeTicket();
			}
		}
	}

	deleteObject = async() => {
		let { data, selectedTicket } = this.state;
		if ( !selectedTicket ) {
			return;
		}
		try {
			await api.deleteObject( selectedTicket );
			let updatedTickets = data.tickets.filter( ticket => {
				return ticket._id !== selectedTicket;
			});
			data.tickets = updatedTickets;
			this.setState({ data: data, selectedTicket: undefined });
		} catch ( err ) {
			console.log( err );
			if ( err.response.data === "jwt expired" ) {
				await refreshToken();
				this.deleteObject();
			}
		}
	}

	banUser = async() => {
		let { data, selectedTicket } = this.state;
		if ( !selectedTicket ) {
			return;
		}
		try {
			await api.banUser( selectedTicket );
			let updatedTickets = data.tickets.filter( ticket => {
				return ticket._id !== selectedTicket;
			});
			data.tickets = updatedTickets;
			this.setState({ data: data, selectedTicket: undefined });
		} catch ( err ) {
			console.log( err );
			if ( err.response.data === "jwt expired" ) {
				await refreshToken();
				this.banUser();
			}
		}
	}

	viewPost = () => {
		this.setState({ commentDetails: false });
		this.visualizePost( this.state.visualizedComment.post );
	}


	render() {
		let {
			data, postDetails, visualizedPost, visualizedComment, commentDetails
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
				{( postDetails || commentDetails ) &&
					<PostDetailsDimmer>
						<OutsideClickHandler onClick={this.hideDetails} />
						{postDetails &&
						<PostDetails
							post={visualizedPost}
							switchDetails={this.hideDetails}
							socket={this.props.socket}
							history={this.props.history}
						/>}
						{commentDetails &&
							<React.Fragment>
								<ViewPostButton content="View post" onClick={this.viewPost} />
								<CommentWrapper>
									<Comment
										comment={visualizedComment}
										handleDelete={() => {}}
										handleUpdate={() => {}}
										handleReply={() => {}}
										socket={{}}
									/>
								</CommentWrapper>
							</React.Fragment>
						}
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

export default BatcaveData;
