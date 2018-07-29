import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import Settings from "./Settings";
import configureStore from "redux-mock-store";
import sinon from "sinon";

const mockStore = configureStore();

Enzyme.configure({ adapter: new Adapter() });

describe( "<Settings/>", () => {
	const
		store = mockStore({}),
		wrapper = shallow(
			<Settings store={store} />
		).dive();

	it( "Checks that <Settings/> renders", () => {
		expect( wrapper ).to.have.length( 1 );
	});

	it( "Checks that every children inside the form renders", () => {
		expect( wrapper.children().children().children()).to.have.length( 7 );
	});
});
