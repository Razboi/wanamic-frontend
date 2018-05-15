import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import Messages from "./Messages";
import configureStore from "redux-mock-store";
import sinon from "sinon";

const mockStore = configureStore();
Enzyme.configure({ adapter: new Adapter() });

describe( "<Messages/>", () => {
	const
		messages = [],
		store = mockStore({ messages: messages }),
		wrapper = shallow(
			<Messages store={store} />
		).dive();

	it( "Checks that <Messages/> renders", () => {
		expect( wrapper ).to.have.length( 1 );
	});

	it( "Checks that every children renders", () => {
		expect( wrapper.children()).to.have.length( 3 );
	});
});
