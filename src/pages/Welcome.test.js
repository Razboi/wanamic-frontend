import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import Welcome from "./Welcome";
import sinon from "sinon";

Enzyme.configure({ adapter: new Adapter() });

describe( "<Welcome/>", () => {
	const wrapper = shallow( <Welcome /> );

	it( "Checks that <Welcome/> renders", () => {
		expect( wrapper ).to.have.length( 1 );
	});
});
