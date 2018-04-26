import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import ExploreUsers from "./ExploreUsers";
import sinon from "sinon";

Enzyme.configure({ adapter: new Adapter() });

describe( "<ExploreUsers/>", () => {
	var
		wrapper,
		sugestedSpy,
		randomSpy,
		changeSpy;
	beforeEach(() => {
		sugestedSpy = sinon.spy();
		changeSpy = sinon.spy();
		randomSpy = sinon.spy();
		wrapper = shallow(
			<ExploreUsers
				handleChange={changeSpy}
				getSugested={sugestedSpy}
				getRandom={randomSpy}
			/>
		);
	});

	it( "Checks that <ExploreUsers/> renders", () => {
		expect( wrapper ).to.have.length( 1 );
	});

	it( "Checks that <ExploreUsers/> children renders", () => {
		expect( wrapper.children()).to.have.length( 4 );
	});

	it( "Checks that changing interestsSearch calls handleChange", () => {
		const event = { target: { name: "keywords", value: "test" } };
		expect( changeSpy.called ).to.equal( false );
		wrapper.find( ".interestsSearch" ).simulate( "change", event );
		expect( changeSpy.called ).to.equal( true );
	});

	it( "Checks that changing usernameSearch calls handleChange", () => {
		const event = { target: { name: "usernameSearch", value: "test" } };
		expect( changeSpy.called ).to.equal( false );
		wrapper.find( ".usernameSearch" ).simulate( "change", event );
		expect( changeSpy.called ).to.equal( true );
	});

	it( "Checks that clicking sugestedButton button calls getSugested", () => {
		expect( sugestedSpy.called ).to.equal( false );
		wrapper.find( ".sugestedButton" ).simulate( "click" );
		expect( sugestedSpy.called ).to.equal( true );
	});

	it( "Checks that clicking randomButton button calls getRandom", () => {
		expect( randomSpy.called ).to.equal( false );
		wrapper.find( ".randomButton" ).simulate( "click" );
		expect( randomSpy.called ).to.equal( true );
	});
});
