import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import NavBar from "./NavBar";
import configureStore from "redux-mock-store";
import { MemoryRouter } from "react-router-dom";

const mockStore = configureStore();
Enzyme.configure({ adapter: new Adapter() });

describe( "<NavBar/>", () => {
	var
		store = mockStore({}),
		wrapper = shallow(
			<MemoryRouter>
				<NavBar
					store={store}
					mediaOptions={false}
				/>
			</MemoryRouter>
		).dive();

	it( "Checks that <NavBar/> renders", () => {
		expect( wrapper ).to.have.length( 1 );
	});
});
