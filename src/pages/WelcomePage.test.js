import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import WelcomePage from "./WelcomePage";
import sinon from "sinon";

Enzyme.configure({ adapter: new Adapter() });

describe( "<WelcomePage/>", () => {
	const wrapper = shallow( <WelcomePage /> );

	it( "Checks that <WelcomePage/> renders", () => {
		expect( wrapper ).to.have.length( 1 );
	});
});
