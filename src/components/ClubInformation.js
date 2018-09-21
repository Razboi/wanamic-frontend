import React, { Component } from "react";
import { Button } from "semantic-ui-react";
import styled from "styled-components";
import PropTypes from "prop-types";
import api from "../services/api";
import refreshToken from "../utils/refreshToken";
import EditClubPopup from "../containers/EditClubPopup";

const
	Wrapper = styled.div`
		margin-top: 1rem;
		margin-right: 10px;
		@media (max-width: 900px) {
			margin-right: 0px;
		}
	`,
	MainInfo = styled.div`
		width: 300px;
		padding: 1rem;
		border-radius: 5px;
		background: #fff;
		display: flex;
		flex-direction: column;
		justify-content: center;
		margin-bottom: 1rem;
		div {
			margin-bottom: 1rem;
		}
		h4 {
			font-family: inherit;
			color: #111;
			margin-bottom: 0.2rem;
			word-break: break-word;
		}
		p {
			color: #111;
			font-weight: 200;
			font-size: 1.01rem;
			word-break: break-word;
		}
	`,
	InfoButton = styled( Button )`
		background: ${props => props.primary ?
		"rgb(133, 217, 191)" : "#fff"} !important;
		border: ${props => !props.primary &&
			"1px solid rgb(133, 217, 191)"} !important;
		color: ${props => !props.primary && "rgb(133, 217, 191)"} !important;
	`,
	EditButton = styled( Button )`
		margin-top: 1rem !important;
	`,
	SecondaryInfo = styled.div`
		margin-bottom: 1rem;
		width: 300px;
		padding: 1rem;
		border-radius: 5px;
		background: #fff;
		display: flex;
		flex-direction: column;
		justify-content: center;
		word-break: break-word;
		h4 {
			font-family: inherit;
		}
		a {
			color: #222
		}
		span {
			color: rgba(0,0,0,0.5);
		}
	`;

class ClubInformation extends Component {
	constructor( props ) {
		super( props );
		this.state = {
			editForm: false,
			giveUpForm: false,
			clubData: props.clubData
		};
	}

	componentDidUpdate( prevProps, prevState ) {
		if ( this.props.clubData !== prevProps.clubData ) {
			this.setState({ clubData: this.props.clubData });
		}
	}

	exitClub = async() => {
		try {
			if ( this.state.clubData.president._id === localStorage.getItem( "id" )) {
				return;
			}
			const updatedMembers = await api.exitClub( this.state.clubData._id );
			let updatedClubData = this.state.clubData;
			updatedClubData.members = updatedMembers.data;
			this.setState({ clubData: updatedClubData });
		} catch ( err ) {
			if ( err.response.data === "jwt expired" ) {
				await refreshToken();
				this.exitClub();
			} else {
				console.log( err );
			}
		}
	}

	joinClub = async() => {
		try {
			const updatedMembers = await api.joinClub( this.state.clubData._id );
			let updatedClubData = this.state.clubData;
			updatedClubData.members = updatedMembers.data;
			this.setState({ clubData: updatedClubData });
		} catch ( err ) {
			if ( err.response.data === "jwt expired" ) {
				await refreshToken();
				this.joinClub();
			} else {
				console.log( err );
			}
		}
	}

	toggleEditForm = () => {
		this.setState( state => ({ editForm: !state.editForm }));
	}

	toggleGiveUpForm = () => {
		this.setState( state => ({ giveUpForm: !state.giveUpForm }));
		this.toggleEditForm();
	}

	updateData = ( title, description ) => {
		let updatedData = this.state.clubData;
		updatedData.title = title;
		updatedData.description = description;
		this.setState({ clubData: updatedData });
		this.toggleEditForm();
	}

	render() {
		let { clubData } = this.state;
		return (
			<Wrapper>
				{this.state.editForm &&
					<EditClubPopup
						clubId={clubData._id}
						title={clubData.title}
						description={clubData.description}
						switchForm={this.toggleEditForm}
						updateData={this.updateData}
						giveUpForm={this.state.giveUpForm}
						toggleGiveUpForm={this.toggleGiveUpForm}
					/>
				}
				<MainInfo>
					<h4>{clubData.title}</h4>
					<p>{clubData.description}</p>
					{clubData.members &&
						clubData.members.includes( localStorage.getItem( "id" )) ?
						<InfoButton
							secondary
							content="ALREADY MEMBER"
							onClick={this.exitClub}
						/>
						:
						<InfoButton
							primary
							content="JOIN"
							onClick={this.joinClub}
						/>
					}
					{clubData.president &&
						clubData.president._id === localStorage.getItem( "id" ) &&
					<React.Fragment>
						<EditButton
							content="Edit Information"
							onClick={this.toggleEditForm}
						/>
						<EditButton
							content="Give up presidency"
							onClick={this.toggleGiveUpForm}
						/>
					</React.Fragment>
					}
				</MainInfo>
				{clubData.president &&
					<SecondaryInfo>
						<h4>Club president</h4>
						<a href={`/${clubData.president.username}`}>
							{clubData.president.fullname}
							<span>@{clubData.president.username}</span>
						</a>
					</SecondaryInfo>
				}
			</Wrapper>
		);
	}
}

ClubInformation.propTypes = {
	clubData: PropTypes.object.isRequired
};

export default ClubInformation;
