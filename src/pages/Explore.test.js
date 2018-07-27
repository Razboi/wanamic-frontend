import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import configureStore from "redux-mock-store";
import Explore from "./Explore";
import sinon from "sinon";

const mockStore = configureStore();
Enzyme.configure({ adapter: new Adapter() });

describe( "<Explore/>", () => {
	var
		wrapper,
		socketSpy = sinon.spy(),
		store;

	beforeEach(() => {
		store = mockStore({
			posts: [],
			notifications: { displayNotifications: false },
			conversations: { displayMessages: false }
		});
		wrapper = shallow(
			<Explore
				socket={{ emit: socketSpy, on: socketSpy }}
				store={store}
			/>
		).dive();
	});

	it( "Checks that <Explore/> renders", () => {
		expect( wrapper ).to.have.length( 1 );
	});
});
