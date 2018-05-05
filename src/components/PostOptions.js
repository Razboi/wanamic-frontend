import React, { Component } from "react";
import { Icon } from "semantic-ui-react";
import styled from "styled-components";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { switchComments, switchShare } from "../services/actions/posts";

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
		if ( this.props.fakeOptions ) {
			return null;
		}
		return (
			<Wrapper>
				{this.props.liked ?
					<Option className="dislikeOption"
						onClick={() => this.props.handleDislike()}
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
						this.props.switchComments( this.props.id, this.props.index )
					}
				>
					<Icon
						name="comment outline"
						size="large"
					/>
					<b>{this.props.numComments}</b>
				</Option>

				<Option className="shareOption"
					onClick={() => this.props.switchShare( this.props.index )}
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
	liked: PropTypes.bool.isRequired,
	numLiked: PropTypes.number.isRequired,
	numComments: PropTypes.number.isRequired,
	numShared: PropTypes.number.isRequired,
	switchComments: PropTypes.func.isRequired,
	switchShare: PropTypes.func.isRequired
};

const
	mapStateToProps = state => ({
	}),

	mapDispatchToProps = dispatch => ({
		switchComments: ( id, index ) => dispatch( switchComments( id, index )),
		switchShare: postIndex => dispatch( switchShare( postIndex ))
	});

export default connect( mapStateToProps, mapDispatchToProps )( PostOptions );
