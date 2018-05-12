import React, { Component } from "react";
import { Button, Dropdown, Icon } from "semantic-ui-react";
import styled from "styled-components";
import PropTypes from "prop-types";

const
	Options = styled.div`
		@media (max-width: 420px) {
			grid-area: o;
			display: grid;
			grid-template-columns: 100%;
			grid-template-rows: 33% 66%;
			grid-template-areas:
				"buttons"
				"kw"
		}
	`,
	Buttons = styled.span`
		grid-area: buttons;
		align-self: center;
		justify-self: center;
	`,
	Keywords = styled.span`
		grid-area: kw;
		align-self: center;
	`;


class ProfileOptions extends Component {
	render() {
		if ( this.props.user.friends.includes( localStorage.getItem( "id" ))) {
			return (
				<Options>
					<Buttons>

						<Icon.Group size="large" onClick={this.props.handleDeleteFriend}>
							<Icon name="user" />
							<Icon corner name="check" color="green" />
						</Icon.Group>

						<Button size="tiny" icon="mail outline" />

					</Buttons>
					<Keywords>
						{this.props.user.keywords}
					</Keywords>
				</Options>
			);
		}
		return (
			<Options>
				<Buttons>
					{this.props.requested ?
						<Button
							primary
							size="tiny"
						>
							<Dropdown text="Reply request">
								<Dropdown.Menu>
									<Dropdown.Item
										text="Accept"
										onClick={this.props.handleReqAccept}
									/>
									<Dropdown.Item
										text="Delete Request"
										onClick={this.props.handleReqDelete}
									/>
								</Dropdown.Menu>
							</Dropdown>
						</Button>
						:
						<Button
							onClick={this.props.handleAddFriend}
							primary
							size="tiny"
							content="Add Friend"
						/>
					}
					<Button
						onClick={this.props.handleFollow}
						secondary
						size="tiny"
						content="Follow"
					/>
					<Button size="tiny" icon="mail outline" />
				</Buttons>

				<Keywords>
					{this.props.user.keywords}
				</Keywords>
			</Options>
		);
	}
}

ProfileOptions.propTypes = {
	user: PropTypes.object.isRequired,
	handleAddFriend: PropTypes.func.isRequired,
	handleFollow: PropTypes.func.isRequired,
	handleReqAccept: PropTypes.func.isRequired,
	handleReqDelete: PropTypes.func.isRequired,
	handleDeleteFriend: PropTypes.func.isRequired,
	requested: PropTypes.bool
};


export default ProfileOptions;
