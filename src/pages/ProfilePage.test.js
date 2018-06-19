import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import ProfilePage from "./ProfilePage";

Enzyme.configure({ adapter: new Adapter() });

describe( "<ProfilePage/>", () => {
	const wrapper = shallow(
		<ProfilePage
			match={{ params: { username: "test@gmail.com" } }}
		/>
	);

	it( "Checks that <ProfilePage/> renders", () => {
		expect( wrapper ).to.have.length( 1 );
	});
});
