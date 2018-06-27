import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import ShareLink from "./ShareLink";
import sinon from "sinon";

Enzyme.configure({ adapter: new Adapter() });

describe( "<ShareLink/>", () => {
	var
		wrapper,
		spySubmitLink;
	beforeEach(() => {
		spySubmitLink = sinon.spy();
		wrapper = shallow(
			<ShareLink
				submitLink={spySubmitLink}
				socialCircle={[]}
			/>
		);
	});

	it( "Checks that <ShareLink/> renders", () => {
		expect( wrapper ).to.have.length( 1 );
	});

	it( "Checks that <ShareLink/> children renders", () => {
		expect( wrapper.children()).to.have.length( 3 );
	});
});
