import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import LoginForm from "./LoginForm";
import sinon from "sinon";

Enzyme.configure({ adapter: new Adapter() });

describe( "<LoginForm/>", () => {
	var
		wrapper,
		swapSpy,
		loginSpy,
		changeSpy;
	beforeEach(() => {
		swapSpy = sinon.spy();
		changeSpy = sinon.spy();
		loginSpy = sinon.spy();
		wrapper = shallow(
			<LoginForm
				swapForm={swapSpy}
				handleChange={changeSpy}
				handleLogin={loginSpy} />
		);
	});

	it( "Checks that <LoginForm/> renders", () => {
		expect( wrapper ).to.have.length( 1 );
	});

	it( "Checks that <LoginForm/> children renders", () => {
		expect( wrapper.children()).to.have.length( 3 );
	});

	it( "Checks that clicking swap button calls swapForm", () => {
		expect( swapSpy.called ).to.equal( false );
		wrapper.find( ".swapButton" ).simulate( "click" );
		expect( swapSpy.called ).to.equal( true );
	});

	it( "Checks that clicking login button calls handleLogin", () => {
		expect( loginSpy.called ).to.equal( false );
		wrapper.find( ".loginButton" ).simulate( "click" );
		expect( loginSpy.called ).to.equal( true );
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
