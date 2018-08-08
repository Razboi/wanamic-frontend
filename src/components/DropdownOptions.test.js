import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import DropdownOptions from "./DropdownOptions";
import sinon from "sinon";

Enzyme.configure({ adapter: new Adapter() });

describe( "<DropdownOptions/>", () => {
	const
		updateSpy = sinon.spy(),
		deleteSpy = sinon.spy(),
		wrapper = shallow(
			<DropdownOptions
				author={""}
				handleDelete={deleteSpy}
				handleUpdate={updateSpy}
			/>
		);

	it( "Checks that <DropdownOptions/> renders", () => {
		expect( wrapper ).to.have.length( 1 );
	});

	it( "Checks that <DropdownOptions/> children render", () => {
		expect( wrapper.children()).to.have.length( 1 );
	});
});
