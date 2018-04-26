import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import MediaPicture from "./MediaPicture";

Enzyme.configure({ adapter: new Adapter() });

describe( "<MediaPicture/>", () => {
	var
		wrapper,
		location = {
			state: {
			}
		};

	wrapper = shallow(
		<MediaPicture location={location} />
	);

	it( "Checks that <MediaPicture/> renders", () => {
		expect( wrapper ).to.have.length( 1 );
	});

	it( "Checks that <MediaPicture/> children renders", () => {
		expect( wrapper.children()).to.have.length( 4 );
	});

	it( "Checks that sharePictureForm children renders", () => {
		expect( wrapper.find( ".sharePictureForm" ).children()).to.have.length( 2 );
	});

});
