import React, { Component } from "react";
import styled from "styled-components";
import { Header } from "semantic-ui-react";
import api from "../services/api";
import moment from "moment";
import PostOptions from "../components/PostOptions";
import SharedPost from "../containers/SharedPost";
import DropdownOptions from "../components/DropdownOptions";

const
	Wrapper = styled.div`
		position: relative;
	`,
	PostHeader = styled( Header )`
		padding: 10px 10px 0px 10px !important;
		margin-bottom: 10px !important;
	`,
	Author = styled.span`
	`,
	DateTime = styled( Header.Subheader )`
	`,
	PostContent = styled.div`
		height: auto;
		padding: 0px 10px;
		margin-bottom: 30px;
	`;


class Post extends Component {
	constructor() {
		super();
		this.state = {
			content: "",
			deleted: false,
			likedBy: [],
			comments: [],
			sharedBy: []
		};
	}

	static getDerivedStateFromProps( nextProps, prevState ) {
		return {
			content: nextProps.content,
			likedBy: nextProps.likedBy,
			comments: nextProps.comments,
			sharedBy: nextProps.sharedBy
		};
	}

	handleDelete = () => {
		api.deletePost( this.props.id )
			.then(() => this.setState({ deleted: true }))
			.catch( err => console.log( err ));
	};

	handleUpdate = updatedContent => {
		if ( this.state.content !== updatedContent ) {
			this.setState({ content: updatedContent });
			api.updatePost( this.props.id, updatedContent )
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

					<DropdownOptions
						author={this.props.author}
						handleUpdate={this.handleUpdate}
						handleDelete={this.handleDelete}
					/>

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
						{this.props.sharedPost &&
								<SharedPost post={this.props.sharedPost} />}
					</PostContent>

					<PostOptions
						fakeOptions={this.props.fakeOptions}
						handleLike={this.handleLike}
						handleDislike={this.handleDislike}
						switchComments={this.props.switchComments}
						switchShare={this.props.switchShare}
						numLiked={this.state.likedBy.length}
						numComments={this.state.comments.length}
						numShared={this.state.sharedBy.length}
						id={this.props.id}
						index={this.props.index}
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
