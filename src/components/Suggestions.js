import React, { Component } from "react";
import styled from "styled-components";
import { Header, Image } from "semantic-ui-react";
import PropTypes from "prop-types";

const
	Wrapper = styled.div`
		z-index: 3;
		height: ${props => props.media ? "100%" : "auto"};
		display: ${props => props.showSuggestions ? "flex" : "none"};
		flex-direction: column;
		flex-grow: 1;
		width: 100vw;
		background: #fff;
		padding: 10px;
		overflow-y: scroll;
	`,
	Suggestion = styled( Header )`
		display: flex;
		flex-direction: row;
		margin-top: 0px !important;
	`,
	SugestionImg = styled( Image )`
		width: 35px !important;
		height: 35px !important;
	`,
	SugestionData = styled.div`
		display: flex;
		flex-direction: column;
		margin-left: 0.5rem;
	`,
	SugestionFullname = styled.span`
	`,
	SugestionUsername = styled( Header.Subheader )`
	`;

class Suggestions extends Component {
	render() {
		return (
			<Wrapper
				showSuggestions={this.props.showSuggestions}
				media={this.props.media}
			>
				{this.props.socialCircle
					.filter( user =>
						user.fullname.toLowerCase().indexOf(
							this.props.mentionInput.toLowerCase()) !== -1
						||
						user.username.indexOf( this.props.mentionInput ) !== -1
					)
					.map(( user, index ) => (
						<Suggestion
							key={index}
							index={index}
							onClick={() => this.props.selectFromMentions( user )}
						>
							<SugestionImg
								circular
								src={user.profileImage ?
									require( "../images/" + user.profileImage )
									:
									require( "../images/defaultUser.png" )
								}
							/>
							<SugestionData>
								<SugestionFullname>
									{user.fullname}
								</SugestionFullname>
								<SugestionUsername>
									@{user.username}
								</SugestionUsername>
							</SugestionData>
						</Suggestion>
					))}
			</Wrapper>
		);
	}
}

Suggestions.propTypes = {
	socialCircle: PropTypes.array.isRequired,
	showSuggestions: PropTypes.bool.isRequired,
	mentionInput: PropTypes.string.isRequired,
};

export default Suggestions;
