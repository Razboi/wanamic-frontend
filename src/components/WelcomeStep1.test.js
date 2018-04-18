import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import WelcomeStep1 from "./WelcomeStep1";
import sinon from "sinon";

Enzyme.configure({ adapter: new Adapter() });

describe( "<WelcomeStep1/>", () => {
	var
		wrapper,
		signupSpy,
		changeSpy;
	beforeEach(() => {
		signupSpy = sinon.spy();
		changeSpy = sinon.spy();
		wrapper = shallow(
			<WelcomeStep1
				handleChange={changeSpy}
				handleSignup={signupSpy} />
		);
	});

	it( "Checks that <WelcomeStep1/> renders", () => {
		expect( wrapper ).to.have.length( 1 );
	});

	it( "Checks that <WelcomeStep1/> children renders", () => {
		expect( wrapper.children()).to.have.length( 4 );
	});

	it( "Checks that changing fullname input calls handleChange", () => {
		const event = { target: { name: "fullname", value: "test" } };
		expect( changeSpy.called ).to.equal( false );
		wrapper.find( ".fullnameInput" ).simulate( "change", event );
		expect( changeSpy.called ).to.equal( true );
	});

	it( "Checks that changing username input calls handleChange", () => {
		const event = { target: { name: "username", value: "test" } };
		expect( changeSpy.called ).to.equal( false );
		wrapper.find( ".usernameInput" ).simulate( "change", event );
		expect( changeSpy.called ).to.equal( true );
	});

	it( "Checks that clicking next button calls handleSignup", () => {
		expect( signupSpy.called ).to.equal( false );
		wrapper.find( ".signupButton" ).simulate( "click" );
		expect( signupSpy.called ).to.equal( true );
	});
});
