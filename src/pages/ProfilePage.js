import React, { Component } from "react";
import styled from "styled-components";
import { Button } from "semantic-ui-react";


const
	Wrapper = styled.div`
		@media (max-width: 420px) {
			height: 100vh;
			width: 100%;
			display: grid;
			grid-template-columns: 100%;
			grid-template-rows: 25% 45% auto;
			grid-template-areas:
				"h"
				"i"
				"p"
		}
	`,
	Header = styled.div`
		@media (max-width: 420px) {
			grid-area: h;
			border-bottom: 1px solid #000;
			background: #808080;
		}
	`,
	Information = styled.div`
		@media (max-width: 420px) {
			grid-area: i;
			border-bottom: 1px solid #000;
			display: grid;
			grid-template-columns: 45% 55%;
			grid-template-rows: 50% 50%;
			grid-template-areas:
				"i o"
				"d d"
		}
	`,
	BasicInfo = styled.div`
		@media (max-width: 420px) {
			grid-area: i;
			border: 1px solid #D3D3D3;
			position: relative;
			display: grid;
		}
	`,
	UserImage = styled.div`
		@media (max-width: 420px) {
			width: 90%;
			height: 95%;
			position: absolute;
			top: -50%;
			left: 10px;
			background: #D3D3D3;
		}
	`,
	UserName = styled.h2`
		@media (max-width: 420px) {
			align-self: end;
		}
	`,
	NickName = styled.span`
		@media (max-width: 420px) {
			align-self: end;
			color: #D3D3D3;
		}
	`,
	Options = styled.div`
		@media (max-width: 420px) {
			grid-area: o;
			border: 1px solid #D3D3D3;
		}
	`,
	Description = styled.div`
		@media (max-width: 420px) {
			grid-area: d;
			border: 1px solid #D3D3D3;
		}
	`,
	Timeline = styled.div`
		@media (max-width: 420px) {
			grid-area: p;
			border-bottom: 1px solid #000;
			background: #D3D3D3;
		}
	`;


class ProfilePage extends Component {
	render() {
		return (
			<Wrapper>
				<Header></Header>
				<Information>
					<BasicInfo>
						<UserImage></UserImage>
						<UserName>Username</UserName>
						<NickName>@username</NickName>
					</BasicInfo>
					<Options>
						<Button primary content="Friend request" />
						<Button secondary content="Follow" />
						<Button content="Message" />
						<p>
							#keyword #keyword #keyword #keyword #keyword
						</p>
					</Options>
					<Description>
						<p>
								Bla bla bla bla bla bla Bla bla bla bla bla bla Bla bla bla bla bla bla
								Bla bla bla bla bla blaBla bla bla bla bla blaBla bla bla bla bla bla
								Bla bla bla bla bla blaBla bla bla bla bla blaBla bla bla bla bla bla
						</p>
					</Description>
				</Information>
				<Timeline></Timeline>
			</Wrapper>
		);
	}
}

export default ProfilePage;
