import React, { Component } from "react";
import styled from "styled-components";
import { Header, Image } from "semantic-ui-react";

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
	`;


class MediaPost extends Component {

	render() {
		return (
			<Wrapper>
				<PostHeader>
					<Author className="postAuthor">{this.props.author}</Author>
					<DateTime className="postDate">{this.props.date}</DateTime>
				</PostHeader>
				<Image src={this.props.mediaContent.image} />
				<p className="postContent">
					{this.props.content}
				</p>
			</Wrapper>
		);
	}
}

export default MediaPost;
