import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import LinkPreview from "./LinkPreview";

Enzyme.configure({ adapter: new Adapter() });

describe( "<LinkPreview/>", () => {
	var
		wrapper = shallow(
			<LinkPreview linkContent={{}} />
		),
		wrapper2 = shallow(
			<LinkPreview linkContent={{ embeddedUrl: "123asd" }} />
		);

	it( "Checks that <LinkPreview/> renders", () => {
		expect( wrapper ).to.have.length( 1 );
	});

	it( "Checks that <LinkPreview/> children renders", () => {
		expect( wrapper.children()).to.have.length( 1 );
		expect( wrapper.children().children()).to.have.length( 2 );
	});

	it( "Checks that .linkPreviewIframe renders on wrapper2 only", () => {
		expect( wrapper2.find( ".linkPreviewIframe" )).to.have.length( 1 );
		expect( wrapper.find( ".linkPreviewIframe" )).to.have.length( 0 );
	});

	it( "Checks that .linkPreviewImage renders on wrapper only", () => {
		expect( wrapper.find( ".linkPreviewImage" )).to.have.length( 1 );
		expect( wrapper2.find( ".linkPreviewImage" )).to.have.length( 0 );
	});

});
