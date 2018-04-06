import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import NewsFeed from "./NewsFeed";

Enzyme.configure({ adapter: new Adapter() });

describe( "<NewsFeed/>", () => {
	var
		posts,
		wrapper;

	beforeEach(() => {
		posts = [ { test: "test" }, { test2: "test2" } ];
		wrapper = shallow( <NewsFeed posts={posts}/> );
	});

	it( "Checks that <NewsFeed/> renders", () => {
		expect( wrapper ).to.have.length( 1 );
	});

	it( "Checks that every post renders", () => {
		expect( wrapper.children()).to.have.length( posts.length );
	});

});
