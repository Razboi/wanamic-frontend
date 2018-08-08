import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import MediaPicture from "./MediaPicture";

Enzyme.configure({ adapter: new Adapter() });

describe( "<MediaPicture/>", () => {
	var
		wrapper;

	wrapper = shallow(
		<MediaPicture/>
	);

	it( "Checks that <MediaPicture/> renders", () => {
		expect( wrapper ).to.have.length( 1 );
	});
});
