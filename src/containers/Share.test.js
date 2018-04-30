import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import Share from "./Share";
import sinon from "sinon";

Enzyme.configure({ adapter: new Adapter() });

describe( "<Share/>", () => {
	var
		swapSpy,
		wrapper;

	beforeEach(() => {
		swapSpy = sinon.spy(),
		wrapper = shallow(
			<Share postToShare={{}} switchShare={swapSpy}/>
		);
	});

	it( "Checks that <Share/> renders", () => {
		expect( wrapper ).to.have.length( 1 );
	});

	it( "Checks that every children renders", () => {
		expect( wrapper.children()).to.have.length( 2 );
	});

	it( "Checks that the backIcon calls switchShare", () => {
		expect( swapSpy.called ).to.equal( false );
		wrapper.find( ".backIcon" ).simulate( "click" );
		expect( swapSpy.called ).to.equal( true );
	});

	it( "Checks that the nextIcon calls switchShare", () => {
		expect( swapSpy.called ).to.equal( false );
		wrapper.find( ".nextIcon" ).simulate( "click" );
		expect( swapSpy.called ).to.equal( true );
	});
});
