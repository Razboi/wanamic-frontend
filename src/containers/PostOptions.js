import React, { Component } from "react";
import { Icon } from "semantic-ui-react";
import styled from "styled-components";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { switchPostDetails, switchShare } from "../services/actions/posts";

const
	Wrapper = styled.div`
		height: 52px;
		width: 100%;
		display: flex;
		justify-content: space-around;
		align-items: center;
	`,
	Option = styled.div`
		:hover {
			cursor: pointer;
		}
		color: #111;
	`;

class PostOptions extends Component {
	render() {
		if ( this.props.fakeOptions ) {
			return null;
		}
		return (
			<Wrapper>
				{this.props.post.likedBy.includes( localStorage.getItem( "username" )) ?
					<Option className="dislikeOption"
						onClick={() => this.props.handleDislike()}
					>
						<Icon
							name="heart"
							color="red"
							size="large"
						/>
						<b>{this.props.post.likedBy.length}</b>
					</Option>
					:
					<Option className="likeOption"
						onClick={() => this.props.handleLike()}
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
						this.props.switchPostDetails( this.props.post )
					}
				>
					<Icon
						name="comment outline"
						size="large"
					/>
					<b>{this.props.numComments}</b>
				</Option>

				<Option className="shareOption"
					onClick={() => this.props.switchShare( this.props.post )}
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

PostOptions.propTypes = {
	fakeOptions: PropTypes.bool,
	numComments: PropTypes.number.isRequired,
	numShared: PropTypes.number.isRequired,
	switchShare: PropTypes.func.isRequired,
	handleLike: PropTypes.func.isRequired,
	handleDislike: PropTypes.func.isRequired,
	post: PropTypes.object.isRequired
};

const
	mapStateToProps = state => ({
	}),

	mapDispatchToProps = dispatch => ({
		switchPostDetails: post => dispatch( switchPostDetails( post )),
		switchShare: post => dispatch( switchShare( post ))
	});

export default connect( mapStateToProps, mapDispatchToProps )( PostOptions );
