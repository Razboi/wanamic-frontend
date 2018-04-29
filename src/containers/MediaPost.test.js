import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import MediaPost from "./MediaPost";

Enzyme.configure({ adapter: new Adapter() });

describe( "<MediaPost/>", () => {
	var
		post = {
			author: "tester", content: "testing", mediaContent: { image: "defaultbg.png" },
			linkContent: { embeddedUrl: "123" }, createdAt: "123", "likedBy": []
		},
		wrapper = shallow(
			<MediaPost
				author={post.author}
				content={post.content}
				mediaContent={post.mediaContent}
				linkContent={post.linkContent}
				date={post.createdAt}
				link={post.link}
				likedBy={post.likedBy}
				picture={true}
				comments={[]}
			/>
		),
		linkWrapper = shallow(
			<MediaPost
				author={post.author}
				content={post.content}
				mediaContent={post.mediaContent}
				linkContent={post.linkContent}
				date={post.createdAt}
				link={true}
				picture={post.picture}
				likedBy={post.likedBy}
				comments={[]}
			/>
		);

	it( "Checks that <MediaPost/> renders", () => {
		expect( wrapper ).to.have.length( 1 );
	});

	it( "Checks that <MediaPost/> children renders", () => {
		expect( wrapper.children()).to.have.length( 4 );
	});

	it( "Checks that mediaPostHeader children renders when link is false", () => {
		expect( wrapper.find( ".mediaPostHeader" ).children()).to.have.length( 2 );
	});

	it( "Expect mediaPicture to render instead of mediaArtwork", () => {
		expect( wrapper.find( ".mediaArtwork" )).to.have.length( 0 );
		expect( wrapper.find( ".mediaPicture" )).to.have.length( 1 );
	});

	it( "Checks that <MediaPost/> children render when link is true", () => {
		expect( linkWrapper.children()).to.have.length( 4 );
	});

	it( "Checks that mediaPostHeader children renders when link is true", () => {
		expect( linkWrapper.find( ".mediaPostHeader" ).children()).to.have.length( 2 );
	});

	it( "Checks that linkPreviewWrapper children renders", () => {
		expect( linkWrapper.find( ".linkPreviewWrapper" ).children()).to.have.length( 2 );
	});

	it( "Checks that linkPreviewText children renders", () => {
		expect( linkWrapper.find( ".linkPreviewText" ).children()).to.have.length( 3 );
	});

	it( "Expect linkPreviewIframe to render instead of linkPreviewImage", () => {
		expect( linkWrapper.find( ".linkPreviewImage" )).to.have.length( 0 );
		expect( linkWrapper.find( ".linkPreviewIframe" )).to.have.length( 1 );
	});

});
