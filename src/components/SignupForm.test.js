import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import SignupForm from "./SignupForm";
import sinon from "sinon";

Enzyme.configure({ adapter: new Adapter() });

describe( "<SignupForm/>", () => {
	var
		wrapper,
		swapSpy,
		nextSpy,
		changeSpy;
	beforeEach(() => {
		swapSpy = sinon.spy();
		changeSpy = sinon.spy();
		nextSpy = sinon.spy();
		wrapper = shallow(
			<SignupForm
				swapForm={swapSpy}
				handleChange={changeSpy}
				handleSignupNext={nextSpy} />
		);
	});

	it( "Checks that <SignupForm/> renders", () => {
		expect( wrapper ).to.have.length( 1 );
	});

	it( "Checks that <SignupForm/> children renders", () => {
		expect( wrapper.children()).to.have.length( 2 );
	});

	it( "Checks that clicking swap button calls swapForm", () => {
		expect( swapSpy.called ).to.equal( false );
		wrapper.find( ".swapLink" ).simulate( "click" );
		expect( swapSpy.called ).to.equal( true );
	});

	it( "Checks that clicking next button calls handleSignupNext", () => {
		expect( nextSpy.called ).to.equal( false );
		wrapper.find( ".signupButton" ).simulate( "click" );
		expect( nextSpy.called ).to.equal( true );
	});

	it( "Checks that changing inputs calls handleChange", () => {
		const event = { target: { name: "email", value: "testEmail" } };
		expect( changeSpy.called ).to.equal( false );
		wrapper.find( ".emailInput" ).simulate( "change", event );
		expect( changeSpy.called ).to.equal( true );
	});

	it( "Checks that changing inputs calls handleChange", () => {
		const event = { target: { name: "password", value: "testPassword" } };
		expect( changeSpy.called ).to.equal( false );
		wrapper.find( ".passwordInput" ).simulate( "change", event );
		expect( changeSpy.called ).to.equal( true );
	});
});
