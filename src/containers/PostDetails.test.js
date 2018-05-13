import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import PostDetails from "./PostDetails";
import configureStore from "redux-mock-store";

const mockStore = configureStore();
Enzyme.configure({ adapter: new Adapter() });

describe( "<PostDetails/>", () => {
	var
		store = mockStore({}),
		wrapper = shallow(
			<PostDetails
				store={store}
				postId={""}
			/>
		);

	it( "Checks that <PostDetails/> renders", () => {
		expect( wrapper ).to.have.length( 1 );
	});

	it( "Checks that <PostDetails/> children render", () => {
		wrapper.setState({ post: {} });
		expect( wrapper.children()).to.have.length( 1 );
		expect( wrapper.children().children()).to.have.length( 2 );
	});
});
