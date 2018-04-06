import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import HomePage from "./HomePage";
import configureStore from "redux-mock-store";
import createBrowserHistory from "history/createBrowserHistory";
import sinon from "sinon";

const mockStore = configureStore();
Enzyme.configure({ adapter: new Adapter() });

describe( "<Homepage/>", () => {
	var
		wrapper,
		history,
		store;

	beforeEach(() => {
		store = mockStore();
		history = createBrowserHistory();
		wrapper = shallow(
			<HomePage
				store={store}
				history={history}
			/>
		).dive();
	});

	it( "Checks that <HomePage/> renders", () => {
		expect( wrapper ).to.have.length( 1 );
	});

	it( "Checks that every children renders", () => {
		expect( wrapper.children()).to.have.length( 3 );
	});
});
