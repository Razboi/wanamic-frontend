import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import ExploreContent from "./ExploreContent";
import sinon from "sinon";

Enzyme.configure({ adapter: new Adapter() });

describe( "<ExploreContent/>", () => {
	const posts = [ {}, {}, {}, {} ],
		wrapper = shallow(
			<ExploreContent
				posts={posts}
			/>
		);

	it( "Checks that <ExploreContent/> renders", () => {
		expect( wrapper ).to.have.length( 1 );
	});

	it( "Checks that every <ExploreContent/> post renders", () => {
		expect( wrapper.children()).to.have.length( posts.length );
	});
});
