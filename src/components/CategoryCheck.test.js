import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import CategoryCheck from "./CategoryCheck";
import sinon from "sinon";

Enzyme.configure({ adapter: new Adapter() });

describe( "<CategoryCheck/>", () => {
	var
		wrapper,
		checkedSpy,
		category;
	beforeEach(() => {
		checkedSpy = sinon.spy();
		category = "test";
		wrapper = shallow(
			<CategoryCheck
				checked={checkedSpy}
				category={category}
			/>
		);
	});

	it( "Checks that <CategoryCheck/> renders", () => {
		expect( wrapper ).to.have.length( 1 );
	});

	it( "Checks that <CategoryCheck/> children renders", () => {
		expect( wrapper.children()).to.have.length( 1 );
	});

	it( "Checks that the button contains the category name", () => {
		expect( wrapper.children().prop( "content" )).to.equal( category );
	});

	it( "Checks that clicking the button calls checked prop", () => {
		expect( checkedSpy.called ).to.equal( false );
		wrapper.children().simulate( "click" );
		expect( checkedSpy.called ).to.equal( true );
	});

	it( "Checks that clicking the button changes the state", () => {
		const originalState = wrapper.state( "checked" );
		wrapper.children().simulate( "click" );
		expect( wrapper.state( "checked" )).to.equal( !originalState );
	});
});
