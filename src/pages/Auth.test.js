import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import Auth from "./Auth";
import configureStore from "redux-mock-store";
import createBrowserHistory from "history/createBrowserHistory";
import sinon from "sinon";

const mockStore = configureStore();
Enzyme.configure({ adapter: new Adapter() });

describe( "< Auth />", () => {
	var
		wrapper,
		history,
		spyLogin,
		spySignup,
		store;

	beforeEach(() => {
		store = mockStore();
		history = createBrowserHistory();
		wrapper = shallow(
			<Auth
				store={store}
				history={history}
			/>
		).dive();
		spyLogin = sinon.spy( wrapper.instance(), "handleLogin" );
		spySignup = sinon.spy( wrapper.instance(), "handleSignup" );
	});

	// elements render
	it( "checks that Auth renders", () => {
		expect( wrapper ).to.have.length( 1 );
	});

	it( "checks that the form renders", () => {
		expect( wrapper.children()).to.have.length( 1 );
	});
});
