import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import Profile from "./Profile";

Enzyme.configure({ adapter: new Adapter() });

describe( "<Profile/>", () => {
	const wrapper = shallow(
		<Profile
			match={{ params: { username: "test@gmail.com" } }}
		/>
	);

	it( "Checks that <Profile/> renders", () => {
		expect( wrapper ).to.have.length( 1 );
	});
});
