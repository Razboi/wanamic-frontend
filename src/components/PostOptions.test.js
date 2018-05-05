import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import PostOptions from "./PostOptions";
import sinon from "sinon";
import configureStore from "redux-mock-store";

const mockStore = configureStore();
Enzyme.configure({ adapter: new Adapter() });

describe( "<PostOptions/>", () => {
	var
		likeSpy = sinon.spy(),
		dislikeSpy = sinon.spy(),
		commentSpy = sinon.spy(),
		shareSpy = sinon.spy(),
		store = mockStore({}),
		wrapper = shallow(
			<PostOptions
				store={store}
				liked={true}
				handleDislike={dislikeSpy}
			/>
		).dive(),
		wrapper2 = shallow(
			<PostOptions liked={false} handleLike={likeSpy} store={store}/>
		).dive();

	it( "Checks that <PostOptions/> renders", () => {
		expect( wrapper ).to.have.length( 1 );
	});

	it( "Checks that every children renders", () => {
		expect( wrapper.children()).to.have.length( 3 );
	});

	it( "Checks that like option works", () => {
		expect( likeSpy.called ).to.equal( false );
		wrapper2.find( ".likeOption" ).simulate( "click" );
		expect( likeSpy.called ).to.equal( true );
	});

	it( "Checks that dislike option works", () => {
		expect( dislikeSpy.called ).to.equal( false );
		wrapper.find( ".dislikeOption" ).simulate( "click" );
		expect( dislikeSpy.called ).to.equal( true );
	});
});
