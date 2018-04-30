import React, { Component } from "react";
import { Icon } from "semantic-ui-react";
import styled from "styled-components";

const
	Wrapper = styled.div`
		margin: 15px 0px;
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
					<Option className="dislikeOption"
						onClick={() => !this.props.fakeOptions && this.props.handleDislike()}
					>
						<Icon
							name="heart"
							color="red"
							size="large"
						/>
						<b>{this.props.numLiked}</b>
					</Option>
					:
					<Option className="likeOption"
						onClick={() => !this.props.fakeOptions && this.props.handleLike()}
					>
						<Icon
							name="empty heart"
							size="large"
						/>
						<b>{this.props.numLiked}</b>
					</Option>
				}

				<Option className="commentOption"
					onClick={() =>
						!this.props.fakeOptions && this.props.switchComments( this.props.id )
					}
				>
					<Icon
						name="comment outline"
						size="large"
					/>
					<b>{this.props.numComments}</b>
				</Option>

				<Option className="shareOption"
					onClick={() =>
						!this.props.fakeOptions && this.props.switchShare( this.props.index )
					}
				>
					<Icon
						name="share"
						size="large"
					/>
					<b>{this.props.numShared}</b>
				</Option>
			</Wrapper>
		);
	}
}

export default PostOptions;
