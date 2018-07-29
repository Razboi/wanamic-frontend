import React, { Component } from "react";
import { Button } from "semantic-ui-react";
import styled from "styled-components";
import PropTypes from "prop-types";


const
	Options = styled.div`
		display: flex;
		flex-direction: row;
		width: 100%;
		justify-content: space-evenly;
		margin-top: 2rem;
	`,
	Option = styled.div`
		height: 100%;
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		:hover {
			cursor: pointer;
		}
	`,
	OptionImage = styled.span`
		height: 24px;
		width: 24px;
		display: block;
		background-image: url(${props => props.image});
		background-repeat: no-repeat;
		margin: 0;
		position: relative;
	`,
	OptionText = styled.div`
		color: #444;
		font-size: 0.9rem;
		margin-top: 0.2rem;
	`,
	RequestMessage = styled.div`
		position: absolute;
		top: 0px;
		background: rgba(0,0,0,0.60);
		width: 100%;
		padding: 2.1rem 1rem 0.33rem 1rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		color: #fff;
		font-family: inherit !important;
	`,
	RequestButton = styled( Button )`
		font-family: inherit !important;
		background: rgb(133, 217, 191) !important;
		border-radius: 2px !important;
	`,
	RequestHeader = styled.h4`
		font-family: inherit;
		margin-bottom: 0.5rem;
	`;

class ProfileOptions extends Component {
	render() {
		const { user } = this.props;
		if ( user.friends.includes( localStorage.getItem( "id" ))) {
			return (
				<Options>
					<Option onClick={this.props.unFriend}>
						<OptionImage image={require( "../images/minus.png" )} />
						<OptionText>Unfriend</OptionText>
					</Option>
					<Option onClick={this.props.startChat}>
						<OptionImage image={require( "../images/send.png" )} />
						<OptionText>Message</OptionText>
					</Option>
				</Options>
			);
		}
		if ( user.followers.includes( localStorage.getItem( "id" ))) {
			return (
				<Options>
					<Option onClick={this.props.unFollow}>
						<OptionImage image={require( "../images/minus.png" )} />
						<OptionText>Unfollow</OptionText>
					</Option>
					{this.props.userRequested ?
						<Option>
							<OptionImage image={require( "../images/sandclock.png" )} />
							<OptionText>Request Sent</OptionText>
						</Option>
						:
						this.props.targetRequested ?
							<RequestMessage>
								<RequestHeader>{user.fullname} sent you a friend request.</RequestHeader>
								<RequestButton
									onClick={this.props.acceptRequest}
									content="Accept request"
									size="tiny"
									primary
								/>
							</RequestMessage>
							:
							<Option onClick={this.props.addFriend}>
								<OptionImage image={require( "../images/diamond.png" )} />
								<OptionText>Add Friend</OptionText>
							</Option>
					}
					<Option onClick={this.props.startChat}>
						<OptionImage image={require( "../images/send.png" )} />
						<OptionText>Message</OptionText>
					</Option>
				</Options>
			);
		}
		return (
			<Options>
				{user.username === localStorage.getItem( "username" ) ?
					<Option onClick={this.props.goToUserSettings}>
						<OptionImage image={require( "../images/pen.png" )} />
						<OptionText>Update profile</OptionText>
					</Option>
					:
					<React.Fragment>
						{this.props.userRequested ?
							<Option>
								<OptionImage image={require( "../images/sandclock.png" )} />
								<OptionText>Request Sent</OptionText>
							</Option>
							:
							this.props.targetRequested ?
								<RequestMessage>
									<RequestHeader>
										{user.fullname} sent you a friend request.
									</RequestHeader>
									<RequestButton
										onClick={this.props.acceptRequest}
										content="Accept request"
										size="tiny"
										primary
									/>
								</RequestMessage>
								:
								<Option onClick={this.props.addFriend}>
									<OptionImage image={require( "../images/diamond.png" )} />
									<OptionText>Add Friend</OptionText>
								</Option>
						}
						<Option onClick={this.props.follow}>
							<OptionImage image={require( "../images/binoculars.png" )} />
							<OptionText>Follow</OptionText>
						</Option>
						<Option onClick={this.props.startChat}>
							<OptionImage image={require( "../images/send.png" )} />
							<OptionText>Message</OptionText>
						</Option>
					</React.Fragment>
				}
			</Options>
		);
	}
}

ProfileOptions.propTypes = {
	user: PropTypes.object.isRequired,
	addFriend: PropTypes.func.isRequired,
	acceptRequest: PropTypes.func.isRequired,
	follow: PropTypes.func.isRequired,
	unFriend: PropTypes.func.isRequired,
	unFollow: PropTypes.func.isRequired,
	startChat: PropTypes.func.isRequired,
	requested: PropTypes.bool
};


export default ProfileOptions;
