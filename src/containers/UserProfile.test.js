import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import UserProfile from "./UserProfile";
import sinon from "sinon";

Enzyme.configure({ adapter: new Adapter() });

describe( "<UserProfile/>", () => {
	var
		wrapper = shallow(
			<UserProfile socket={{}} username={"test"}/>
		);

	it( "Checks that <UserProfile/> renders", () => {
		expect( wrapper ).to.have.length( 1 );
	});
});
