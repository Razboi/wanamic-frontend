import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import Comment from "./Comment";
import sinon from "sinon";

Enzyme.configure({ adapter: new Adapter() });

describe( "<Comment/>", () => {
	const
		handleDeleteSpy = sinon.spy(),
		wrapper = shallow(
			<Comment
				handleDelete={handleDeleteSpy}
				comment={{ author: "" }}
			/>
		);

	it( "Checks that <Comment/> renders", () => {
		expect( wrapper ).to.have.length( 1 );
	});

	it( "Checks that <Comment/> children render", () => {
		expect( wrapper.children()).to.have.length( 3 );
	});
});
