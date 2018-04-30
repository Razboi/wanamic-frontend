import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import PostOptions from "./PostOptions";
import sinon from "sinon";

Enzyme.configure({ adapter: new Adapter() });

describe( "<PostOptions/>", () => {
	var
		likeSpy = sinon.spy(),
		dislikeSpy = sinon.spy(),
		commentSpy = sinon.spy(),
		shareSpy = sinon.spy(),
		wrapper = shallow(
			<PostOptions
				liked={true}
				handleDislike={dislikeSpy}
				switchComments={commentSpy}
				switchShare={shareSpy}
			/>
		),
		wrapper2 = shallow(
			<PostOptions liked={false} handleLike={likeSpy}/>
		);

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

	it( "Checks that comment option works", () => {
		expect( commentSpy.called ).to.equal( false );
		wrapper.find( ".commentOption" ).simulate( "click" );
		expect( commentSpy.called ).to.equal( true );
	});

	it( "Checks that share option works", () => {
		expect( shareSpy.called ).to.equal( false );
		wrapper.find( ".shareOption" ).simulate( "click" );
		expect( shareSpy.called ).to.equal( true );
	});
});
