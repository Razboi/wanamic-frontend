import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import SettingsPage from "./SettingsPage";

Enzyme.configure({ adapter: new Adapter() });

describe( "<SettingsPage/>", () => {
	const wrapper = shallow(
		<SettingsPage />
	);

	it( "Checks that <SettingsPage/> renders", () => {
		expect( wrapper ).to.have.length( 1 );
	});

	it( "Checks that every children inside the form renders", () => {
		expect( wrapper.children().children()).to.have.length( 8 );
	});

	it( "Checks that changing fullname input changes the state", () => {
		const event = { target: { name: "fullname", value: "test" } };
		wrapper.find( ".fullnameInput" ).simulate( "change", event );
		expect( wrapper.state( "fullname" )).to.equal( "test" );
	});

	it( "Checks that changing username input changes the state", () => {
		const event = { target: { name: "username", value: "test" } };
		wrapper.find( ".usernameInput" ).simulate( "change", event );
		expect( wrapper.state( "username" )).to.equal( "test" );
	});

	it( "Checks that changing description input changes the state", () => {
		const event = { target: { name: "description", value: "test" } };
		wrapper.find( ".descriptionArea" ).simulate( "change", event );
		expect( wrapper.state( "description" )).to.equal( "test" );
	});

	it( "Checks that changing keywords input changes the state", () => {
		const event = { target: { name: "keywords", value: "test" } };
		wrapper.find( ".keywordsInput" ).simulate( "change", event );
		expect( wrapper.state( "keywords" )).to.equal( "test" );
	});

	it( "Checks that changing userImage input changes the state", () => {
		const event = { target: { name: "userImage", files: [ 123 ] } };
		wrapper.find( ".profileImageInput" ).simulate( "change", event );
		expect( wrapper.state( "userImage" )).to.equal( 123 );
	});

	it( "Checks that changing headerImage input changes the state", () => {
		const event = { target: { name: "headerImage", files: [ 123 ] } };
		wrapper.find( ".headerImageInput" ).simulate( "change", event );
		expect( wrapper.state( "headerImage" )).to.equal( 123 );
	});
});
