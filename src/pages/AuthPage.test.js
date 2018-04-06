import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import React from "react";
import { expect } from "chai";
import { shallow, render, mount } from "enzyme";
import AuthPage from "./AuthPage";
import configureStore from "redux-mock-store";
import createBrowserHistory from "history/createBrowserHistory";
import sinon from "sinon";

const mockStore = configureStore();
Enzyme.configure({ adapter: new Adapter() });

describe( "< AuthPage />", () => {
	var
		wrapper,
		history,
		spyLogin,
		spySignup,
		store;

	beforeEach(() => {
		store = mockStore();
		history = createBrowserHistory();
		wrapper = shallow(
			<AuthPage
				store={store}
				history={history}
			/>
		).dive();
		spyLogin = sinon.spy( wrapper.instance(), "handleLogin" );
		spySignup = sinon.spy( wrapper.instance(), "handleSignup" );
	});

	// elements render
	it( "checks that AuthPage renders", () => {
		expect( wrapper ).to.have.length( 1 );
	});

	it( "checks that the AuthFormContainer and it's children renders", () => {
		expect( wrapper.find( "#AuthFormContainer" )).to.have.length( 1 );
		expect( wrapper.find( "#AuthFormContainer" ).children()).to.have.length( 3 );
	});

	it( "checks that the children of the AuthForm render", () => {
		expect( wrapper.find( "#AuthForm" ).children()).to.have.length( 3 );
	});

	// swap button
	it( "checks that the swap button changes state.signup", () => {
		expect( wrapper.state( "signup" )).to.equal( false );
		wrapper.find( ".swapButton" ).simulate( "click" );
		expect( wrapper.state( "signup" )).to.equal( true );
	});

	// form data
	it( "checks that the content of the elements changes when state.signup changes", () => {
		expect( wrapper.find( ".swapButton" ).props().content ).to.equal( "Sign Up" );
		expect( wrapper.find( ".formHeader" ).props().content ).to.equal( "Log In" );
		expect( wrapper.find( ".authFormButton" ).props().content ).to.equal( "Log In" );
		wrapper.find( ".swapButton" ).simulate( "click" );
		expect( wrapper.find( ".swapButton" ).props().content ).to.equal( "Log In" );
		expect( wrapper.find( ".formHeader" ).props().content ).to.equal( "Sign Up" );
		expect( wrapper.find( ".authFormButton" ).props().content ).to.equal( "Sign Up" );
	});

	// form inputs
	it( "checks that changing the email input changes the state.email", () => {
		const event = { target: { name: "email", value: "test" } };
		wrapper.find( ".emailInput" ).simulate( "change", event );
		expect( wrapper.state( "email" )).to.equal( "test" );
	});

	it( "checks that changing the password input changes the state.password", () => {
		const event = { target: { name: "password", value: "123" } };
		wrapper.find( ".passwordInput" ).simulate( "change", event );
		expect( wrapper.state( "password" )).to.equal( "123" );
	});

	// login and signup methods
	it( "checks that handleLogin is called", () => {
		expect( spyLogin.called ).to.equal( false );
		wrapper.find( ".swapButton" ).simulate( "click" );
		wrapper.find( ".swapButton" ).simulate( "click" );
		wrapper.find( ".authFormButton" ).simulate( "click" );
		expect( spyLogin.called ).to.equal( true );
	});

	it( "checks that handleSignup is called", () => {
		expect( spySignup.called ).to.equal( false );
		wrapper.find( ".swapButton" ).simulate( "click" );
		wrapper.find( ".authFormButton" ).simulate( "click" );
		expect( spySignup.called ).to.equal( true );
	});
});
