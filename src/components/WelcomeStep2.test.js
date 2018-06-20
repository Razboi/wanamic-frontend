import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import WelcomeStep2 from "./WelcomeStep2";
import sinon from "sinon";

Enzyme.configure({ adapter: new Adapter() });

describe( "<WelcomeStep2/>", () => {
	var
		wrapper,
		nextSpy,
		fileChangeSpy,
		changeSpy;
	beforeEach(() => {
		nextSpy = sinon.spy();
		changeSpy = sinon.spy();
		fileChangeSpy = sinon.spy();
		wrapper = shallow(
			<WelcomeStep2
				handleChange={changeSpy}
				handleNext={nextSpy}
				handleFileChange={fileChangeSpy}
			/>
		);
	});

	it( "Checks that <WelcomeStep2/> renders", () => {
		expect( wrapper ).to.have.length( 1 );
	});

	it( "Checks that <WelcomeStep1/> children renders", () => {
		expect( wrapper.children()).to.have.length( 5 );
	});

	it( "Checks that changing descriptionArea calls handleChange", () => {
		const event = { target: { name: "description", value: "test" } };
		expect( changeSpy.called ).to.equal( false );
		wrapper.find( ".descriptionArea" ).simulate( "change", event );
		expect( changeSpy.called ).to.equal( true );
	});

	it( "Checks that changing profileImageInput calls handleChange", () => {
		const event = { target: { name: "userImage", value: "test" } };
		expect( fileChangeSpy.called ).to.equal( false );
		wrapper.find( ".profileImageInput" ).simulate( "change", event );
		expect( fileChangeSpy.called ).to.equal( true );
	});

	it( "Checks that clicking next button calls handleNext", () => {
		expect( nextSpy.called ).to.equal( false );
		wrapper.find( ".nextButton" ).simulate( "click" );
		expect( nextSpy.called ).to.equal( true );
	});
});
