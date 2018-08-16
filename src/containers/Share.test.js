import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import Share from "./Share";
import sinon from "sinon";
import configureStore from "redux-mock-store";

const mockStore = configureStore();
Enzyme.configure({ adapter: new Adapter() });

describe( "<Share/>", () => {
	var
		store = mockStore({ posts: { postToShare: {} } }),
		swapSpy,
		wrapper;

	beforeEach(() => {
		swapSpy = sinon.spy(),
		wrapper = shallow(
			<Share postToShare={{}} switchShare={swapSpy} store={store}/>
		).dive();
	});

	it( "Checks that <Share/> renders", () => {
		expect( wrapper ).to.have.length( 1 );
	});

	it( "Checks that every children renders", () => {
		expect( wrapper.children()).to.have.length( 3 );
	});
});
