import React, { Component } from "react";
import Post from "../containers/Post";
import MediaPost from "../containers/MediaPost";
import styled from "styled-components";
import PropTypes from "prop-types";

const
	Wrapper = styled.div`
		height: 100%;
	`;

class NewsFeed extends Component {
	goToProfile = user => {
		if ( this.props.history ) {
			this.props.history.push( "/" + user.username );
		}
	}
	render() {
		return (
			<Wrapper>
				{this.props.posts.map(( post, index ) =>
					post.media ?
						<MediaPost
							newsFeed
							key={index}
							index={index}
							post={post}
							socket={this.props.socket}
							goToProfile={() => this.goToProfile( post.author )}
						/>
						:
						<Post
							key={index}
							index={index}
							post={post}
							socket={this.props.socket}
							goToProfile={() => this.goToProfile( post.author )}
						/>
				)}
			</Wrapper>
		);
	}
}

NewsFeed.propTypes = {
	posts: PropTypes.array.isRequired,
	socket: PropTypes.object.isRequired,
	history: PropTypes.object,
};

export default NewsFeed;
