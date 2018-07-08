import React, { Component } from "react";
import { Button, Image } from "semantic-ui-react";
import styled from "styled-components";
import PropTypes from "prop-types";

const
	Wrapper = styled.div`
		padding: 1rem;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	`,
	HeaderWrapper = styled.header`
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 3.5rem;
	`,
	Step = styled.h2`
	`,
	Subheader = styled.span`
		font-size: 1rem;
		color: rgba( 0,0,0,0.4);
		text-align: center;
	`,
	MatchesWrapper = styled.div`
	`,
	Match = styled.div`
		display: flex;
		position: relative;
		flex-direction: column;
		margin-bottom: 2.5rem;
	`,
	MatchFullname = styled.h3`
		margin: 0px;
	`,
	MatchUsername = styled.span`
		color: #808080;
	`,
	MatchDescription = styled.p`
		margin: 0.5rem 0 0 0 !important;
		font-size: 1.02rem !important;
	`,
	ButtonsFooter = styled.footer`
		display: flex;
		justify-content: space-between;
		margin-top: auto;
	`,
	FollowButton = styled( Button )`
		position: absolute !important;
		top: 0 !important;
		right: 0 !important;
		margin: 0 !important;
	`,
	UserImg = styled( Image )`
		width: 40px !important;
		height: 40px !important;
		margin-right: 0.5rem !important;
	`,
	UserInfo = styled.div`
		display: flex;
		flex-direction: row;
	`,
	TextInfo = styled.div`
		display: flex;
		flex-direction: column;
	`;

class Step4 extends Component {
	render() {
		return (
			<Wrapper>
				<HeaderWrapper>
					<Step>Sugested users</Step>
					<Subheader>
						This users have interests similar to yours.
					</Subheader>
				</HeaderWrapper>
				<MatchesWrapper className="matchesWrapper">
					{this.props.matchedUsers.map(( user, index ) =>
						<Match key={index}>
							<UserInfo>
								<UserImg
									circular
									src={user.profileImage ?
										require( "../images/" + user.profileImage )
										:
										require( "../images/defaultUser.png" )
									}
								/>
								<TextInfo>
									<MatchFullname>{user.fullname}</MatchFullname>
									<MatchUsername>@{user.username}</MatchUsername>
								</TextInfo>
							</UserInfo>
							<MatchDescription>{user.description}</MatchDescription>
							<FollowButton
								size="tiny"
								onClick={() =>
									this.props.handleFollow( user.username )}
								content="Follow"
								primary={this.props.toFollow.includes( user.username )}
							/>
						</Match>
					)}
				</MatchesWrapper>
				<ButtonsFooter>
					<Button
						className="prevButton"
						secondary
						floated="left"
						content="Prev"
						onClick={this.props.handlePrev}
					/>
					<Button
						className="nextButton"
						disabled={this.props.toFollow.length === 0}
						primary
						floated="right"
						content="Next"
						onClick={this.props.finish}
					/>
				</ButtonsFooter>
			</Wrapper>
		);
	}
}

Step4.propTypes = {
	handlePrev: PropTypes.func.isRequired,
	finish: PropTypes.func.isRequired,
	handleFollow: PropTypes.func.isRequired,
	matchedUsers: PropTypes.array.isRequired,
	toFollow: PropTypes.array.isRequired
};

export default Step4;
