import React, { Component } from "react";
import styled from "styled-components";
import { Button, Input } from "semantic-ui-react";
import api from "../services/api";

const
	Wrapper = styled.div`
		position: absolute;
		height: 100vh;
		width: 100%;
		z-index: 3;
		background: #fff;
		display: grid;
		grid-template-columns: 100%;
		grid-template-rows: 93% 7%;
		grid-template-areas:
			"com"
			"inp"
	`,
	CommentsWrapper = styled.div`
		grid-area: com;
	`,
	StyledInput = styled( Input )`
		grid-area: inp;
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
			.catch( err => console.log( err ));
		this.props.switchComments;
	}

	render() {
		return (
			<Wrapper>
				<CommentsWrapper>
					<Button secondary content="Back" onClick={this.props.switchComments} />
					<h4>Comments</h4>
					{this.state.comments.map(( comment, index ) =>
						<div key={index}>
							<h4>{comment.author}</h4>
							<p>{comment.content}</p>
						</div>
					)}
				</CommentsWrapper>
				<StyledInput
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
