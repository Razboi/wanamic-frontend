import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import SharedPost from "./SharedPost";
import sinon from "sinon";

Enzyme.configure({ adapter: new Adapter() });

describe( "<SharedPost/>", () => {
	var
		wrapper = shallow(
			<SharedPost post={{}}/>
		);

	it( "Checks that <SharedPost/> renders", () => {
		expect( wrapper ).to.have.length( 1 );
	});

	it( "Checks that every children renders", () => {
		expect( wrapper.children()).to.have.length( 1 );
	});
});
