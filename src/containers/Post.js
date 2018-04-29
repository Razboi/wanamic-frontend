import React, { Component } from "react";
import styled from "styled-components";
import { Header, Dropdown, Modal, Form } from "semantic-ui-react";
import api from "../services/api";
import moment from "moment";
import PostOptions from "../components/PostOptions";

const
	Wrapper = styled.div`
		position: relative;
	`,
	PostHeader = styled( Header )`
		padding: 10px !important;
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
	`,
	PostContent = styled.div`
		padding: 10px;
	`;


class Post extends Component {
	constructor() {
		super();
		this.state = {
			content: "",
			updatedContent: "",
			deleted: false,
			likedBy: []
		};
	}

	static getDerivedStateFromProps( nextProps, prevState ) {
		return { content: nextProps.content, likedBy: nextProps.likedBy };
	}

	handleChange = e =>
		this.setState({ [ e.target.name ]: e.target.value });

	handleDelete = () => {
		api.deletePost( this.props.id )
			.then(() => this.setState({ deleted: true }))
			.catch( err => console.log( err ));
	};

	handleUpdate = () => {
		if ( this.state.content !== this.state.updatedContent ) {
			this.setState({ content: this.state.updatedContent });
			api.updatePost( this.props.id, this.state.updatedContent )
				.catch( err => console.log( err ));
		}
	};

	handleLike = () => {
		this.setState({
			likedBy: [ ...this.state.likedBy, localStorage.getItem( "username" ) ]
		});

		api.likePost( this.props.id )
			.catch( err => console.log( err ));
	}

	handleDislike = () => {
		var	newLikedBy = this.state.likedBy;
		const index = this.state.likedBy.indexOf( localStorage.getItem( "username" ));
		newLikedBy.splice( index, 1 );
		this.setState({ likedBy: newLikedBy });

		api.dislikePost( this.props.id )
			.catch( err => console.log( err ));
	}

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
												value={this.state.updatedContent}
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
						<DateTime className="postDate">
							{moment( this.props.date ).fromNow()}
						</DateTime>
					</PostHeader>
					<PostContent>
						<p className="postContent">
							{this.state.content}
						</p>
					</PostContent>
					<PostOptions
						handleLike={this.handleLike}
						handleDislike={this.handleDislike}
						liked={
							this.state.likedBy.includes( localStorage.getItem( "username" ))
						}
					/>
				</Wrapper>
			);
		}
		return null;
	}
}

export default Post;
