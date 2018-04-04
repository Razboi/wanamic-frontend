import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import authenticated from "./user";
import { userLoggedIn, userLoggedOut } from "../actions/auth";


describe( "User reducer", () => {
	it( "should return false for empty action", () => {
		expect( authenticated( undefined, {})).to.equal( false );
	});

	it( "should return true for login action", () => {
		expect( authenticated( undefined, userLoggedIn())).to.equal( true );
	});

	it( "should return false for logout action", () => {
		expect( authenticated( undefined, userLoggedOut())).to.equal( false );
	});
});
