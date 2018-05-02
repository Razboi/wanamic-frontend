import React, { Component } from "react";
import styled from "styled-components";
import { Icon, Input } from "semantic-ui-react";
import api from "../services/api";
import Comment from "./Comment";

const
	Wrapper = styled.div`
		position: absolute;
		height: 100vh;
		width: 100%;
		z-index: 3;
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
			comment: "",
			comments: []
		};
	}

	componentDidMount() {
		api.getPostComments( this.props.id, 0 )
			.then( res => this.setState({ comments: res.data }))
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
		api.createComment( this.state.comment, this.props.id )
			.then( res => this.setState({
				comments: [ res.data, ...this.state.comments ], comment: ""
			}))
			.catch( err => console.log( err ));
		this.props.handleCreateComment();
	}

	handleDelete = commentIndex => {
		var	newComments = this.state.comments;
		newComments.splice( commentIndex, 1 );
		this.setState({ comments: newComments });
		this.props.handleDeleteComment( commentIndex );
	};

	render() {
		return (
			<Wrapper>
				<HeaderWrapper>
					<Icon name="arrow left" onClick={this.props.switchComments} />
					<HeaderTxt>Comments</HeaderTxt>
				</HeaderWrapper>
				<CommentsWrapper className="commentsWrapper">
					{this.state.comments.map(( comment, index ) =>
						<Comment
							key={index}
							comment={comment}
							handleDelete={() => this.handleDelete( index )}
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

export default Comments;
