import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import Message from "./Message";
import sinon from "sinon";

Enzyme.configure({ adapter: new Adapter() });

describe( "<Message/>", () => {
	var
		wrapper = shallow(
			<Message
				message={{ author: "me", content: "sup" }}
			/>
		);

	it( "Checks that <Message/> renders", () => {
		expect( wrapper ).to.have.length( 1 );
	});

	it( "Checks that <Message/> children renders", () => {
		expect( wrapper.children()).to.have.length( 3 );
	});
});
