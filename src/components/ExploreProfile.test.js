import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import ExploreProfile from "./ExploreProfile";
import sinon from "sinon";

Enzyme.configure({ adapter: new Adapter() });

describe( "<ExploreProfile/>", () => {
	var
		wrapper,
		nextSpy,
		backSpy,
		user;
	beforeEach(() => {
		nextSpy = sinon.spy();
		backSpy = sinon.spy();
		user = {
			keywords: [ "test" ],
			description: "testing",
			fullname: "test user",
			username: "test"
		};
		wrapper = shallow(
			<ExploreProfile
				user={user}
				next={nextSpy}
				backToMenu={backSpy}
			/>
		);
	});

	it( "Checks that <ExploreProfile/> renders", () => {
		expect( wrapper ).to.have.length( 1 );
	});

	it( "Checks that <ExploreProfile/> children renders", () => {
		expect( wrapper.children()).to.have.length( 4 );
	});

	it( "Checks that clicking nextButton button calls next", () => {
		expect( nextSpy.called ).to.equal( false );
		wrapper.find( ".nextButton" ).simulate( "click" );
		expect( nextSpy.called ).to.equal( true );
	});

	it( "Checks that clicking backButton button calls backToMenu", () => {
		expect( backSpy.called ).to.equal( false );
		wrapper.find( ".backButton" ).simulate( "click" );
		expect( backSpy.called ).to.equal( true );
	});
});
