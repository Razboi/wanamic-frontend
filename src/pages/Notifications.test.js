import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import Notifications from "./Notifications";
import configureStore from "redux-mock-store";
import { MemoryRouter } from "react-router-dom";

const mockStore = configureStore();
Enzyme.configure({ adapter: new Adapter() });

describe( "<Notifications/>", () => {
	var
		store = mockStore({}),
		notifications = [],
		wrapper = shallow(
			<MemoryRouter>
				<Notifications
					store={store}
					notifications={notifications}
				/>
			</MemoryRouter>
		).dive();

	it( "Checks that <Notifications/> renders", () => {
		expect( wrapper ).to.have.length( 1 );
	});
});
