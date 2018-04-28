import React, { Component } from "react";
import styled from "styled-components";
import { Header, Dropdown, Modal, Form } from "semantic-ui-react";
import api from "../services/api";

const
	Wrapper = styled.div`
		padding: 10px;
		margin: 0px 0px 20px 0px;
		border: 1px solid #D3D3D3;
		border-radius: 5px;
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
	constructor() {
		super();
		this.state = {
			updatedPost: "",
			deleted: false
		};
	}

	static getDerivedStateFromProps( nextProps, prevState ) {
		if ( nextProps.content ) {
			return { updatedPost: nextProps.content };
		}
	}

	handleChange = e =>
		this.setState({ [ e.target.name ]: e.target.value });

	handleDelete = () => {
		api.deletePost( this.props.id )
			.then(() => this.setState({ deleted: true }))
			.catch( err => console.log( err ));
	};

	handleUpdate = () => {
		// if the post has been updated
		if ( this.props.content !== this.state.updatedPost ) {
			api.updatePost( this.props.id, this.state.updatedPost )
				.then( res => this.props.updatePost( this.props.index, this.state.updatedPost ))
				.catch( err => console.log( err ));
		}
	};

	render() {
		if ( !this.state.deleted ) {
			return (
				<Wrapper>

					<Options direction="left">

						{ localStorage.getItem( "username" ) === this.props.author ?
							<Dropdown.Menu className="postDropdown">
								<UpdateModal trigger={<Dropdown.Item text="Update" />} >
									<Header>Update your post</Header>
									<Modal.Content>
										<Form>
											<Form.Input
												className="postUpdateInput"
												name="updatedPost"
												onChange={this.handleChange}
												value={this.state.updatedPost}
											/>
											<Form.Button
												className="postUpdateButton"
												primary
												content="Update"
												onClick={this.handleUpdate}
											/>
										</Form>
									</Modal.Content>
								</UpdateModal>

								<Dropdown.Item
									className="postDeleteOption"
									text="Delete"
									onClick={this.handleDelete}
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

					<PostHeader>
						<Author className="postAuthor">{this.props.author}</Author>
						<DateTime className="postDate">{this.props.date}</DateTime>
					</PostHeader>
					<p className="postContent">
						{this.props.content}
					</p>
				</Wrapper>
			);
		}
		return null;
	}
}

export default Post;
