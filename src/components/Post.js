import React, { Component } from "react";
import styled from "styled-components";
import { Header, Dropdown, Modal, Form } from "semantic-ui-react";

const
	Wrapper = styled.div`
		padding: 10px;
		margin: 10px auto;
		border: 1px solid #808080;
		position: relative;
	`,
	PostHeader = styled( Header )`
	`,
	Author = styled.span`
	`,
	DateTime = styled( Header.Subheader )`
	`,
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


class Post extends Component {

	render() {
		return (
			<Wrapper>
				<Options direction="left">
					<Dropdown.Menu>

						<UpdateModal trigger={<Dropdown.Item text="Update" />} >
							<Header>Update your post</Header>
							<Modal.Content>
								<Form>
									<Form.Input
										name="updatedPost"
										placeholder={this.props.content}
										onChange={this.props.handleChange}
									/>
									<Form.Button content="Update" onClick={this.props.handleUpdate} />
								</Form>
							</Modal.Content>
						</UpdateModal>

						<Dropdown.Item
							text="Delete"
							onClick={() => this.props.handleDelete( this.props.id )}
						/>
					</Dropdown.Menu>
				</Options>
				<PostHeader>
					<Author>{this.props.author}</Author>
					<DateTime>{this.props.date}</DateTime>
				</PostHeader>
				<p>{this.props.content}</p>
			</Wrapper>
		);
	}
}

export default Post;
