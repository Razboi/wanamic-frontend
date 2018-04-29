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
	Option = styled.div`
	`;

class PostOptions extends Component {
	render() {
		return (
			<Wrapper>
				{this.props.liked ?
					<Option onClick={this.props.handleDislike}>
						<Icon
							name="heart"
							color="red"
							size="large"
						/>
						<span>{this.props.numLiked}</span>
					</Option>
					:
					<Option onClick={this.props.handleLike}>
						<Icon
							name="empty heart"
							size="large"
						/>
						<span>{this.props.numLiked}</span>
					</Option>
				}

				<Option onClick={() => this.props.switchComments( this.props.id )}>
					<Icon
						name="comment outline"
						size="large"
					/>
					<span>{this.props.numComments}</span>
				</Option>

				<Option>
					<Icon
						name="share"
						size="large"
						onClick={this.props.handleShare}
					/>
				</Option>
			</Wrapper>
		);
	}
}

export default PostOptions;
