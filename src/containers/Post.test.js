import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import Post from "./Post";
import sinon from "sinon";

Enzyme.configure({ adapter: new Adapter() });

describe( "<Post/>", () => {
	var
		wrapper;

	wrapper = shallow( <Post likedBy={[]} comments={[]} /> );


	it( "Checks that <Post/> renders", () => {
		expect( wrapper ).to.have.length( 1 );
	});

	it( "Checks that every postDropdown option renders", () => {
		expect( wrapper.find( ".postDropdown" ).children()).to.have.length( 2 );
	});
});
