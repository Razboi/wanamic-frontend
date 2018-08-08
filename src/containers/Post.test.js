import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import Post from "./Post";
import sinon from "sinon";
import configureStore from "redux-mock-store";

const mockStore = configureStore();
Enzyme.configure({ adapter: new Adapter() });

describe( "<Post/>", () => {
	var
		store = mockStore({}),
		wrapper;

	wrapper = shallow(
		<Post likedBy={[]} comments={[]} sharedBy={[]} store={store} />
	);


	it( "Checks that <Post/> renders", () => {
		expect( wrapper ).to.have.length( 1 );
	});
});
