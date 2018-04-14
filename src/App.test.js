import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import App from "./App";

Enzyme.configure({ adapter: new Adapter() });

describe( "< App />", () => {
	var wrapper;

	beforeEach(() => {
		wrapper = shallow( <App/> );
	});

	it( "checks that app renders", () => {
		expect( wrapper ).to.have.length( 1 );
	});

	it( "checks that app renders all the children. With Switch should be only 1", () => {
		expect( wrapper.children()).to.have.length( 1 );
	});
});
