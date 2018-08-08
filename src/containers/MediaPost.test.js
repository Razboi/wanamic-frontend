import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import MediaPost from "./MediaPost";
import configureStore from "redux-mock-store";

const mockStore = configureStore();
Enzyme.configure({ adapter: new Adapter() });

describe( "<MediaPost/>", () => {
	var
		store = mockStore({}),
		alerts = { nsfw: false, spoiler: false },
		post = {
			author: "tester", content: "testing", mediaContent: { image: "defaultbg.png" },
			createdAt: "123", "likedBy": [], alerts: { nsfw: false, spoiler: false },
			comments: [], sharedBy: [], picture: true
		},
		postLink = {
			author: "tester", content: "testing", mediaContent: { image: "defaultbg.png" },
			linkContent: { embeddedUrl: "123" }, createdAt: "123", "likedBy": [],
			link: true, alerts: { nsfw: false, spoiler: false }, comments: [],
			sharedBy: []
		},
		wrapper = shallow(
			<MediaPost
				store={store}
				post={post}
			/>
		).dive(),
		linkWrapper = shallow(
			<MediaPost
				store={store}
				post={postLink}
			/>
		).dive();

	it( "Checks that <MediaPost/> renders", () => {
		expect( wrapper ).to.have.length( 1 );
	});

	it( "Checks that <MediaPost/> children renders", () => {
		expect( wrapper.children()).to.have.length( 2 );
	});

	it( "Checks that mediaPostHeader children renders when link is false", () => {
		expect( wrapper.find( ".mediaPostHeader" ).children()).to.have.length( 3 );
	});

	it( "Expect mediaPicture to render instead of mediaArtwork", () => {
		expect( wrapper.find( ".mediaArtwork" )).to.have.length( 0 );
		expect( wrapper.find( ".mediaPicture" )).to.have.length( 1 );
	});

	it( "Checks that <MediaPost/> children render when link is true", () => {
		expect( linkWrapper.children()).to.have.length( 2 );
	});

	it( "Checks that mediaPostHeader children renders when link is true", () => {
		expect( linkWrapper.find( ".mediaPostHeader" ).children()).to.have.length( 3 );
	});
});
