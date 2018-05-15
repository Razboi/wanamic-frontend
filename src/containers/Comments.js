import React, { Component } from "react";
import styled from "styled-components";
import { Icon, Input } from "semantic-ui-react";
import api from "../services/api";
import Comment from "./Comment";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
	switchComments, setComments, setNewsfeed, addComment, deleteComment, updatePost
} from "../services/actions/posts";

const
	Wrapper = styled.div`
		position: absolute;
		height: 100vh;
		width: 100%;
		z-index: 4;
		background: #fff;
		display: grid;
		grid-template-columns: 100%;
		grid-template-rows: 7% 86% 7%;
		grid-template-areas:
			"hea"
			"com"
			"inp"
	`,
	HeaderWrapper = styled.div`
		grid-area: hea;
		display: flex;
		align-items: center;
		padding-left: 10px;
		border-bottom: 1px solid rgba(0, 0, 0, .5);
	`,
	CommentsWrapper = styled.div`
		grid-area: com;
		padding: 10px;
	`,
	StyledInput = styled( Input )`
		grid-area: inp;
	`,
	HeaderTxt = styled.span`
		margin-left: 15px;
		font-weight: bold;
		font-size: 16px;
	`;

class Comments extends Component {
	constructor() {
		super();
		this.state = {
			comment: ""
		};
	}

	componentDidMount() {
		api.getPostComments( this.props.postId, 0 )
			.then( res => this.props.setComments( res.data ))
			.catch( err => console.log( err ));
	}

	handleChange = e => {
		this.setState({ [ e.target.name ]: e.target.value });
	}

	handleKeyPress = e => {
		if ( e.key === "Enter" ) {
			this.handleComment();
		}
	}

	handleComment = () => {
		api.createComment( this.state.comment, this.props.postId )
			.then( res => {
				this.setState({ comment: "" });
				this.props.addComment( res.data.newComment );
				this.props.updatePost( res.data.updatedPost );
			}).catch( err => console.log( err ));
	}

	handleDelete = ( commentIndex, updatedPost ) => {
		this.props.deleteComment( commentIndex );
		this.props.updatePost( updatedPost );
	};

	render() {
		return (
			<Wrapper>
				<HeaderWrapper>
					<Icon name="arrow left" onClick={() => this.props.switchComments()} />
					<HeaderTxt>Comments</HeaderTxt>
				</HeaderWrapper>
				<CommentsWrapper className="commentsWrapper">
					{this.props.comments.map(( comment, index ) =>
						<Comment
							key={index}
							index={index}
							comment={comment}
							handleDelete={this.handleDelete}
						/>
					)}
				</CommentsWrapper>
				<StyledInput
					className="commentInput"
					name="comment"
					value={this.state.comment}
					placeholder="Comment..."
					onChange={this.handleChange}
					onKeyPress={this.handleKeyPress}
				/>
			</Wrapper>
		);
	}
}

Comments.propTypes = {
	switchComments: PropTypes.func.isRequired,
	setComments: PropTypes.func.isRequired,
	setNewsfeed: PropTypes.func.isRequired,
	postId: PropTypes.string.isRequired,
	newsfeed: PropTypes.array.isRequired,
	comments: PropTypes.array
};

const
	mapStateToProps = state => ({
		postId: state.posts.postDetailsId,
		newsfeed: state.posts.newsfeed,
		comments: state.posts.comments
	}),

	mapDispatchToProps = dispatch => ({
		switchComments: ( id ) => dispatch( switchComments( id )),
		setComments: comments => dispatch( setComments( comments )),
		setNewsfeed: posts => dispatch( setNewsfeed( posts )),
		addComment: comment => dispatch( addComment( comment )),
		deleteComment: commentIndex => dispatch( deleteComment( commentIndex )),
		updatePost: post => dispatch( updatePost( post ))
	});

export default connect( mapStateToProps, mapDispatchToProps )( Comments );
