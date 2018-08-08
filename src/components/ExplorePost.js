import React, { Component } from "react";
import styled from "styled-components";
import { Image } from "semantic-ui-react";
import PropTypes from "prop-types";
import LinkPreview from "../components/LinkPreview";
import AlertsFilter from "../components/AlertsFilter";

const
	Wrapper = styled.div`
		overflow: hidden;
		display: grid;
		position: relative;
	`,
	MediaImage = styled( Image )`
		justify-self: center;
	`,
	PostMediaContent = styled.div`
		display: grid;
		position: relative;
		overflow: hidden;
		text-align: center;
		width: 100%;
		height: 100%;
		color: #fff;
		border-radius: 8px;
		font-family: inherit !important;
	`,
	MediaTitle = styled.h4`
		font-family: inherit !important;
	`,
	PostMediaBackground = styled.div`
		z-index: -1;
		width: 100%;
		height: 100%;
		position: absolute;
		background-size: cover;
		background-image: url(${props => props.background});
		filter: blur(17px) brightness(90%);
		transform: scale(1.2);
	`,
	Dimmer = styled.div`
		position: ${props => props.blurFilter && "absolute"};
		min-height: ${props => props.blurFilter && "250px"};
		width: 100%;
		filter: ${props => props.blurFilter ?
		"blur(15px) brightness(50%)" : "blur(0px)"};
		transform: scale(${props => props.blurFilter ? "1.3" : "1"});
	`;

var
	mediaPicture;

class ExplorePost extends Component {
	constructor() {
		super();
		this.state = {
			likedBy: [],
			nsfw: false,
			spoiler: false,
			spoilerDescription: "",
			updatedContent: "",
			id: ""
		};
	}

	static getDerivedStateFromProps( props, state ) {
		const { post } = props;
		if ( post._id === state.id ) {
			return null;
		}
		return {
			nsfw: post.alerts.nsfw,
			spoiler: post.alerts.spoiler,
			spoilerDescription: post.alerts.spoilerDescription,
			id: post._id
		};
	}

	handleFilter = type => {
		this.setState({ [ type ]: false });
	}

	render() {
		const { post } = this.props;
		try {
			if ( post.picture ) {
				mediaPicture =
					require( "../images/" + post.mediaContent.image );
			}
		} catch ( err ) {
			console.log( err );
		}

		return (
			<Wrapper>
				<AlertsFilter
					handleFilter={this.handleFilter}
					nsfw={this.state.nsfw}
					spoiler={this.state.spoiler}
					spoilerDescription={this.state.spoilerDescription}
					explore
				/>
				<Dimmer blurFilter={this.state.nsfw || this.state.spoiler}>
					<div onClick={this.props.handleClick}>
						{post.link ?
							<LinkPreview linkContent={post.linkContent} explore />
							:
							<PostMediaContent>
								<PostMediaBackground background={
									post.picture ?
										mediaPicture : post.mediaContent.image
								}
								/>
								{post.picture ?
									<MediaImage src={mediaPicture} className="mediaPicture" />
									:
									<React.Fragment>
										<MediaTitle>{post.mediaContent.title}</MediaTitle>
										<MediaImage src={post.mediaContent.image}
											className="mediaArtwork"
										/>
									</React.Fragment>
								}
							</PostMediaContent>
						}
					</div>
				</Dimmer>
			</Wrapper>
		);
	}
}

ExplorePost.propTypes = {
	post: PropTypes.object.isRequired,
	handleClick: PropTypes.func.isRequired
};


export default ExplorePost;
