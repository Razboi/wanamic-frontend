import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import SettingsPage from "./SettingsPage";

Enzyme.configure({ adapter: new Adapter() });

describe( "<SettingsPage/>", () => {
	const wrapper = shallow(
		<SettingsPage />
	);

	it( "Checks that <SettingsPage/> renders", () => {
		expect( wrapper ).to.have.length( 1 );
	});

	it( "Checks that every children inside the form renders", () => {
		expect( wrapper.children().children()).to.have.length( 7 );
	});
});
