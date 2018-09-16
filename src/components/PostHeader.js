import React from "react";
import { Header, Image, Icon } from "semantic-ui-react";
import PropTypes from "prop-types";
import styled from "styled-components";
import DropdownOptions from "../components/DropdownOptions";
import moment from "moment";

const
	Wrapper = styled( Header )`
		min-height: 60px;
		display: flex;
		flex-wrap: wrap;
		flex-direction: row;
		padding: 1rem !important;
		margin: 0 !important;
		font-family: inherit !important;
	`,
	HeaderInfo = styled.div`
		display: flex;
		flex-direction: column;
		margin: 0 0 0 0.5rem;
		:hover {
			cursor: pointer;
		}
	`,
	ClubInfo = styled.div`
		display: flex;
		margin-right: 25px;
		a {
			font-size: 1.1rem;
			color: rgb(133,217,191);
		}
		i {
			margin: 0 1rem !important;
		}
		:hover {
			cursor: pointer;
		}
		@media (max-width: 420px) {
			margin-right: 100%;
		}
	`,
	AuthorImg = styled( Image )`
		overflow: visible !important;
		width: 40px !important;
		height: 40px !important;
		margin: 0 !important;
		:hover {
			cursor: pointer;
		}
	`,
	StyledOptions = {
		position: "absolute",
		right: "1rem",
		top: "1rem",
	},
	AuthorFullname = styled.span`
		font-size: 1.05rem !important;
		color: #111 !important;
		word-break: break-word !important;
		:hover {
			cursor: pointer;
		}
	`,
	AuthorUsername = styled.span`
		font-size: 1rem;
		color: rgba(0,0,0,0.65);
		font-weight: normal;
		margin-left: 0.25rem;
		word-break: break-word !important;
	`,
	DateTime = styled( Header.Subheader )`
		color: rgba(0,0,0,0.85) !important;
		font-size: 1rem !important;
		font-weight: 200 !important;
	`,


	PostHeader = ( props ) => {
		let {
			userPicture, post, fakeOptions, socket
		} = props;
		return (
			<Wrapper>
				<a href={`/${post.author.username}`}>
					<AuthorImg
						circular
						src={userPicture}
					/>
				</a>
				<a href={`/${post.author.username}`}>
					<HeaderInfo>
						<AuthorFullname className="postAuthor">
							{post.author.fullname}
							<AuthorUsername>
								@{post.author.username}
							</AuthorUsername>
						</AuthorFullname>
						<DateTime className="postDate">
							{moment( post.createdAt ).fromNow()}
						</DateTime>
					</HeaderInfo>
				</a>

				{post.club && post.club.name &&
					<ClubInfo>
						<Icon name="long arrow alternate right" />
						<a href={`/c/${post.club.name}`}>{post.club.name}</a>
					</ClubInfo>
				}
				{ !fakeOptions &&
					<DropdownOptions
						style={StyledOptions}
						postOrComment={post}
						socket={socket}
						clubAdmin={post.club &&
							post.club.president === localStorage.getItem( "id" )}
					/>
				}
			</Wrapper>
		);
	};

PostHeader.propTypes = {
	post: PropTypes.object.isRequired,
	userPicture: PropTypes.object.isRequired,
	fakeOptions: PropTypes.bool
};

export default PostHeader;
