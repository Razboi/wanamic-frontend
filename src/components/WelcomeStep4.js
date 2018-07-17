import React, { Component } from "react";
import { Button } from "semantic-ui-react";
import styled from "styled-components";
import PropTypes from "prop-types";
import UserPreview from "./UserPreview";

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
	ButtonsFooter = styled.footer`
		display: flex;
		justify-content: space-between;
		margin-top: auto;
	`;

class Step4 extends Component {
	render() {
		const {
			toFollow, matchedUsers, handleFollow, handlePrev, finish,
			handleUnfollow
		} = this.props;
		return (
			<Wrapper>
				<HeaderWrapper>
					<Step>Sugested users</Step>
					<Subheader>
						This users have interests similar to yours.
					</Subheader>
				</HeaderWrapper>
				<MatchesWrapper className="matchesWrapper">
					{matchedUsers.map(( user, index ) =>
						<UserPreview
							welcome
							key={index}
							user={user}
							handleFollow={handleFollow}
							handleUnfollow={handleUnfollow}
							alreadyFollowing={toFollow.includes( user.username )}
						/>
					)}
				</MatchesWrapper>
				<ButtonsFooter>
					<Button
						className="prevButton"
						secondary
						floated="left"
						content="Prev"
						onClick={handlePrev}
					/>
					<Button
						className="nextButton"
						disabled={toFollow.length === 0}
						primary
						floated="right"
						content="Finish"
						onClick={finish}
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
	handleUnfollow: PropTypes.func.isRequired,
	matchedUsers: PropTypes.array.isRequired,
	toFollow: PropTypes.array.isRequired
};

export default Step4;
