import React, { Component } from "react";
import { Icon } from "semantic-ui-react";
import styled from "styled-components";

const
	Wrapper = styled.div`
		padding: 15px 0px;
		width: 100%;
		display: flex;
		justify-content: space-around;
	`,
	Option = styled( Icon )`
	`;

class PostOptions extends Component {
	render() {
		return (
			<Wrapper>
				{this.props.liked ?
					<Option
						name="heart"
						color="red"
						size="large"
						onClick={this.props.handleDislike}
					/>
					:
					<Option
						name="empty heart"
						size="large"
						onClick={this.props.handleLike}
					/>
				}
				<Option
					name="comment outline"
					size="large"
					onClick={this.props.handleComment}
				/>
				<Option
					name="share"
					size="large"
					onClick={this.props.handleShare}
				/>
			</Wrapper>
		);
	}
}

export default PostOptions;
