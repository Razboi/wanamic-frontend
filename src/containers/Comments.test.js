import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import Comments from "./Comments";
import configureStore from "redux-mock-store";

const mockStore = configureStore();
Enzyme.configure({ adapter: new Adapter() });

describe( "<Comments/>", () => {
	const
		comments = [],
		store = mockStore({ posts: { postDetailsId: "", comments: comments } }),
		wrapper = shallow(
			<Comments store={store}/>
		).dive();

	it( "Checks that <Comments/> renders", () => {
		expect( wrapper ).to.have.length( 1 );
	});

	it( "Checks that every children renders", () => {
		expect( wrapper.children()).to.have.length( 3 );
	});

	it( "Checks that every comment renders", () => {
		const
			stateCommentsLength = comments.length,
			childComments = wrapper.find( ".commentsWrapper" ).children();
		expect( childComments ).to.have.length( stateCommentsLength );
	});
});
