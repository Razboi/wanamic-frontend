import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import ShareBox from "./ShareBox";
import sinon from "sinon";

Enzyme.configure({ adapter: new Adapter() });

describe( "<ShareBox/>", () => {
	var
		spyHandleChange,
		spyHandleShare,
		sharebox,
		wrapper;

	beforeEach(() => {
		spyHandleChange = sinon.spy();
		spyHandleShare = sinon.spy();
		sharebox = "test";
		wrapper = shallow(
			<ShareBox
				handleChange={spyHandleChange}
				sharebox={sharebox}
				handleShare={spyHandleShare}
			/>
		);
	});

	it( "Checks that <ShareBox/> renders", () => {
		expect( wrapper ).to.have.length( 1 );
	});

	it( "Checks that #ShareBox children render", () => {
		expect( wrapper.find( "#ShareBox" ).children()).to.have.length( 2 );
	});

	it( "Checks that when ShareBoxInput changes calls handleChange", () => {
		const event = { target: { name: "sharebox", value: "testing" } };
		wrapper.find( "#ShareBoxInput" ).simulate( "change", event );
		expect( spyHandleChange.called ).to.equal( true );
	});

	it( "Checks that ShareBoxInput value equals the passed prop ", () => {
		expect( wrapper.find( "#ShareBoxInput" ).prop( "value" )).to.equal( sharebox );
	});

	it( "Checks that when ShareBoxButton is clicked calls handleShare", () => {
		wrapper.find( "#ShareBoxButton" ).simulate( "click" );
		expect( spyHandleShare.called ).to.equal( true );
	});
});
