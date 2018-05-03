import React, { Component } from "react";
import styled from "styled-components";
import { Header } from "semantic-ui-react";
import api from "../services/api";
import moment from "moment";
import PostOptions from "../components/PostOptions";
import SharedPost from "../containers/SharedPost";
import DropdownOptions from "../components/DropdownOptions";
import PropTypes from "prop-types";
import { deletePost, updatePost } from "../services/actions/posts";
import { connect } from "react-redux";

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
			likedBy: []
		};
	}

	static getDerivedStateFromProps( nextProps, prevState ) {
		return {
			likedBy: nextProps.likedBy
		};
	}

	handleDelete = () => {
		api.deletePost( this.props.id )
			.then(() => {
				if ( this.props.sharedPost ) {
					this.props.updatePost( this.props.sharedPost.sharedBy.pop());
				}
				this.props.deletePost( this.props.index );
			}).catch( err => console.log( err ));
	};

	handleUpdate = updatedContent => {
		if ( this.state.content !== updatedContent ) {
			api.updatePost( this.props.id, updatedContent )
				.then( res => this.props.updatePost( res.data ))
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
		return (
			<Wrapper>

				{ !this.props.fakeOptions &&
					<DropdownOptions
						author={this.props.author}
						handleUpdate={this.handleUpdate}
						handleDelete={this.handleDelete}
					/>
				}

				<PostHeader>
					<Author className="postAuthor">{this.props.author}</Author>
					<DateTime className="postDate">
						{moment( this.props.date ).fromNow()}
					</DateTime>
				</PostHeader>

				<PostContent>
					<p className="postContent">
						{this.props.content}
					</p>
					{this.props.sharedPost && <SharedPost post={this.props.sharedPost} />}
				</PostContent>

				{ !this.props.fakeOptions &&
					<PostOptions
						fakeOptions={this.props.fakeOptions}
						handleLike={this.handleLike}
						handleDislike={this.handleDislike}
						switchShare={this.props.switchShare}
						numLiked={this.state.likedBy.length}
						numComments={this.props.comments.length}
						numShared={this.props.sharedBy.length}
						id={this.props.id}
						index={this.props.index}
						liked={
							this.state.likedBy.includes( localStorage.getItem( "username" ))
						}
					/>
				}
			</Wrapper>
		);
	}
}

Post.propTypes = {
	index: PropTypes.number,
	id: PropTypes.string.isRequired,
	author: PropTypes.string.isRequired,
	content: PropTypes.string.isRequired,
	date: PropTypes.string.isRequired,
	link: PropTypes.bool,
	picture: PropTypes.bool,
	likedBy: PropTypes.array,
	comments: PropTypes.array,
	sharedBy: PropTypes.array,
	sharedPost: PropTypes.object,
	fakeOptions: PropTypes.bool
};

const
	mapStateToProps = state => ({
	}),

	mapDispatchToProps = dispatch => ({
		deletePost: postIndex => dispatch( deletePost( postIndex )),
		updatePost: post => dispatch( updatePost( post ))
	});

export default connect( mapStateToProps, mapDispatchToProps )( Post );
