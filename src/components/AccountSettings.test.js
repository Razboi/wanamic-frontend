import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import AccountSettings from "./AccountSettings";
import sinon from "sinon";

Enzyme.configure({ adapter: new Adapter() });

describe( "<AccountSettings/>", () => {
	var
		wrapper,
		handleChangeSpy,
		handleFileChangeSpy;
	beforeEach(() => {
		handleChangeSpy = sinon.spy();
		handleFileChangeSpy = sinon.spy();
		wrapper = shallow(
			<AccountSettings
				handleChange={handleChangeSpy}
				handleFileChange={handleFileChangeSpy}
			/>
		);
	});

	it( "Checks that <AccountSettings/> renders", () => {
		expect( wrapper ).to.have.length( 1 );
	});

	it( "Checks that every children inside the form renders", () => {
		expect( wrapper.children().children()).to.have.length( 4 );
	});

	it( "Checks that changing fullname input calls handleChange", () => {
		const event = { target: { name: "fullname", value: "test" } };
		expect( handleChangeSpy.called ).to.equal( false );
		wrapper.find( ".fullnameInput" ).simulate( "change", event );
		expect( handleChangeSpy.called ).to.equal( true );
	});

	it( "Checks that changing username input calls handleChange", () => {
		const event = { target: { name: "username", value: "test" } };
		expect( handleChangeSpy.called ).to.equal( false );
		wrapper.find( ".usernameInput" ).simulate( "change", event );
		expect( handleChangeSpy.called ).to.equal( true );
	});

	it( "Checks that changing description input calls handleChange", () => {
		const event = { target: { name: "description", value: "test" } };
		expect( handleChangeSpy.called ).to.equal( false );
		wrapper.find( ".descriptionArea" ).simulate( "change", event );
		expect( handleChangeSpy.called ).to.equal( true );
	});

	it( "Checks that changing keywords input calls handleChange", () => {
		const event = { target: { name: "keywords", value: "test" } };
		expect( handleChangeSpy.called ).to.equal( false );
		wrapper.find( ".keywordsInput" ).simulate( "change", event );
		expect( handleChangeSpy.called ).to.equal( true );
	});

	it( "Checks that changing userImage input changes the state", () => {
		const event = { target: { name: "userImage", files: [ 123 ] } };
		expect( handleFileChangeSpy.called ).to.equal( false );
		wrapper.find( ".profileImageInput" ).simulate( "change", event );
		expect( handleFileChangeSpy.called ).to.equal( true );
	});

	it( "Checks that changing headerImage input changes the state", () => {
		const event = { target: { name: "headerImage", files: [ 123 ] } };
		expect( handleFileChangeSpy.called ).to.equal( false );
		wrapper.find( ".headerImageInput" ).simulate( "change", event );
		expect( handleFileChangeSpy.called ).to.equal( true );
	});
});
