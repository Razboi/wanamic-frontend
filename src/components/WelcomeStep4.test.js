import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import WelcomeStep4 from "./WelcomeStep4";
import sinon from "sinon";

Enzyme.configure({ adapter: new Adapter() });

describe( "<WelcomeStep4/>", () => {
	var
		wrapper,
		prevSpy,
		matchedUsers = [],
		finishSpy;
	beforeEach(() => {
		finishSpy = sinon.spy();
		prevSpy = sinon.spy();
		wrapper = shallow(
			<WelcomeStep4
				matchedUsers={matchedUsers}
				finish={finishSpy}
				handlePrev={prevSpy}
				toFollow={[]}
			/>
		);
	});

	it( "Checks that <WelcomeStep4/> renders", () => {
		expect( wrapper ).to.have.length( 1 );
	});

	it( "Checks that <WelcomeStep4/> children renders", () => {
		expect( wrapper.children()).to.have.length( 3 );
	});

	it( "Checks that matchesWrapper renders all the matches", () => {
		const matchesWrapperChildren = wrapper.find( ".matchesWrapper" ).children();
		expect( matchesWrapperChildren ).to.have.length( matchedUsers.length );
	});

	it( "Checks that clicking next button calls finish", () => {
		expect( finishSpy.called ).to.equal( false );
		wrapper.find( ".nextButton" ).simulate( "click" );
		expect( finishSpy.called ).to.equal( true );
	});

	it( "Checks that clicking prev button calls handlePrev", () => {
		expect( prevSpy.called ).to.equal( false );
		wrapper.find( ".prevButton" ).simulate( "click" );
		expect( prevSpy.called ).to.equal( true );
	});
});
