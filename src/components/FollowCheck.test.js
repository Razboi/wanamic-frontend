import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import FollowCheck from "./FollowCheck";
import sinon from "sinon";

Enzyme.configure({ adapter: new Adapter() });

describe( "<FollowCheck/>", () => {
	var
		wrapper,
		followSpy;
	beforeEach(() => {
		followSpy = sinon.spy();
		wrapper = shallow(
			<FollowCheck
				handleFollow={followSpy}
			/>
		);
	});

	it( "Checks that <FollowCheck/> renders", () => {
		expect( wrapper ).to.have.length( 1 );
	});

	it( "Checks that <FollowCheck/> children renders", () => {
		expect( wrapper.children()).to.have.length( 1 );
	});

	it( "Checks that clicking the button calls handleFollow prop", () => {
		expect( followSpy.called ).to.equal( false );
		wrapper.children().simulate( "click" );
		expect( followSpy.called ).to.equal( true );
	});

	it( "Checks that clicking the button changes the state", () => {
		const originalState = wrapper.state( "checked" );
		wrapper.children().simulate( "click" );
		expect( wrapper.state( "checked" )).to.equal( !originalState );
	});
});
