import React, { Component } from "react";
import { Dropdown, Modal, Form } from "semantic-ui-react";
import styled from "styled-components";

const
	Options = styled( Dropdown )`
		position: absolute !important;
		right: 10px;
		top: 5px;
		.dropdown.icon {
			margin: 0px !important;
		}
	`,
	UpdateModal = styled( Modal )`
		margin: 0px !important;
	`;

class DropdownOptions extends Component {
	constructor() {
		super();
		this.state = {
			updatedPost: ""
		};
	}

	handleChange = e =>
		this.setState({ [ e.target.name ]: e.target.value });

	render() {
		return (
			<Options direction="left">
				{ localStorage.getItem( "username" ) === this.props.author ?
					<Dropdown.Menu className="postDropdown">
						<UpdateModal trigger={<Dropdown.Item text="Update" />} >
							<Modal.Content>
								<Form>
									<Form.Input
										className="postUpdateInput"
										name="updatedPost"
										onChange={this.handleChange}
									/>
									<Form.Button
										className="postUpdateButton"
										primary
										content="Update"
										onClick={() =>
											this.props.handleUpdate( this.state.updatedPost )}
									/>
								</Form>
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
						<Dropdown.Item
							text="Report"
						/>
					</Dropdown.Menu>
				}
			</Options>
		);
	}
}

export default DropdownOptions;
