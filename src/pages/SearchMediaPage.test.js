import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import SearchMediaPage from "./SearchMediaPage";

Enzyme.configure({ adapter: new Adapter() });

describe( "<SearchMediaPage/>", () => {
	var
		results = [
			{ trackName: "test", artistName: "tester" },
			{ trackName: "test2", artistName: "tester2" }
		],
		wrapper;

	beforeEach(() => {
		wrapper = shallow(
			<SearchMediaPage />
		);
	});

	it( "Checks that <SearchMediaPage/> renders", () => {
		expect( wrapper ).to.have.length( 1 );
	});

	it( "Checks that every children renders", () => {
		expect( wrapper.children()).to.have.length( 3 );
	});

	it( "Checks that every children renders when state.selected", () => {
		wrapper.setState({ selected: true });
		expect( wrapper.children()).to.have.length( 4 );
	});

	it( "Expects the length of mediaResults to equal state.results", () => {
		wrapper.setState({ results: results });
		const mediaResults = wrapper.find( ".mediaResults" );
		expect( mediaResults.children()).to.have.length( results.length );
	});
});
