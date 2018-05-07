import React, { Component } from "react";
import styled from "styled-components";
import { Header } from "semantic-ui-react";
import api from "../services/api";
import moment from "moment";
import PostOptions from "./PostOptions";
import SharedPost from "../containers/SharedPost";
import DropdownOptions from "../components/DropdownOptions";
import PropTypes from "prop-types";
import { deletePost, updatePost } from "../services/actions/posts";
import { connect } from "react-redux";

const
	Wrapper = styled.div`
		position: relative;
		border-bottom: 1px solid rgba(0, 0, 0, .5);
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
			likedBy: [],
			updatedContent: ""
		};
	}

	static getDerivedStateFromProps( nextProps, prevState ) {
		return {
			likedBy: nextProps.post.likedBy,
			updatedContent: nextProps.post.content
		};
	}

	handleChange = e => {
		this.setState({ [ e.target.name ]: e.target.value });
	}

	handleDelete = () => {
		api.deletePost( this.props.post._id )
			.then( res => {
				if ( res.data.updatedOriginalPost ) {
					this.props.updatePost( res.data.updatedOriginalPost );
				}
				this.props.deletePost( this.props.index );
			}).catch( err => console.log( err ));
	};

	handleUpdate = () => {
		if ( this.state.content !== this.state.updatedContent
			&& this.state.updatedContent !== "" ) {
			api.updatePost( this.props.post._id, this.state.updatedContent )
				.then( res => this.props.updatePost( res.data ))
				.catch( err => console.log( err ));
		}
	};

	handleLike = () => {
		this.setState({
			likedBy: [ ...this.state.likedBy, localStorage.getItem( "username" ) ]
		});

		api.likePost( this.props.post._id )
			.catch( err => console.log( err ));
	}

	handleDislike = () => {
		var	newLikedBy = this.state.likedBy;
		const index = this.state.likedBy.indexOf( localStorage.getItem( "username" ));
		newLikedBy.splice( index, 1 );
		this.setState({ likedBy: newLikedBy });

		api.dislikePost( this.props.post._id )
			.catch( err => console.log( err ));
	}

	render() {
		return (
			<Wrapper>

				{ !this.props.fakeOptions &&
					<DropdownOptions
						author={this.props.post.author}
						updatedContent={this.state.updatedContent}
						handleUpdate={this.handleUpdate}
						handleDelete={this.handleDelete}
						handleChange={this.handleChange}
					/>
				}

				<PostHeader>
					<Author className="postAuthor">{this.props.post.author}</Author>
					<DateTime className="postDate">
						{moment( this.props.post.date ).fromNow()}
					</DateTime>
				</PostHeader>

				<PostContent>
					<p className="postContent">
						{this.props.post.content}
					</p>
					{this.props.post.sharedPost &&
						<SharedPost post={this.props.post.sharedPost} />}
				</PostContent>

				{ !this.props.fakeOptions &&
					<PostOptions
						fakeOptions={this.props.fakeOptions}
						handleLike={this.handleLike}
						handleDislike={this.handleDislike}
						numLiked={this.state.likedBy.length}
						numComments={this.props.post.comments.length}
						numShared={this.props.post.sharedBy.length}
						id={this.props.post._id}
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
	post: PropTypes.object.isRequired
};

const
	mapStateToProps = state => ({
	}),

	mapDispatchToProps = dispatch => ({
		deletePost: postIndex => dispatch( deletePost( postIndex )),
		updatePost: post => dispatch( updatePost( post ))
	});

export default connect( mapStateToProps, mapDispatchToProps )( Post );
