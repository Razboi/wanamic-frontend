import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import SearchMedia from "./SearchMedia";
import configureStore from "redux-mock-store";

const mockStore = configureStore();
Enzyme.configure({ adapter: new Adapter() });

describe( "<SearchMedia/>", () => {
	var
		results = [
			{ trackName: "test", artistName: "tester", artworkUrl100: "" },
			{ trackName: "test2", artistName: "tester2", artworkUrl100: "" }
		],
		store,
		wrapper;

	beforeEach(() => {
		store = mockStore({}),
		wrapper = shallow(
			<SearchMedia store={store} />
		).dive();
	});

	it( "Checks that <SearchMedia/> renders", () => {
		expect( wrapper ).to.have.length( 1 );
	});

	it( "Checks that every children renders", () => {
		expect( wrapper.children().children()).to.have.length( 3 );
	});

	it( "Checks that every children renders when state.selected", () => {
		wrapper.setState({ selected: true });
		expect( wrapper.children().children()).to.have.length( 3 );
	});

	it( "Expects the length of mediaResults to equal state.results", () => {
		wrapper.setState({ results: results });
		const mediaResults = wrapper.find( ".mediaResults" );
		expect( mediaResults.children()).to.have.length( results.length );
	});
});
