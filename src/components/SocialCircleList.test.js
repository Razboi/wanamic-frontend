import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import SocialCircleList from "./SocialCircleList";
import sinon from "sinon";

Enzyme.configure({ adapter: new Adapter() });

describe( "<SocialCircleList/>", () => {
	var
		socialCircle = [ "hi", "sup" ],
		backSpy = sinon.spy(),
		handleNewConversationSpy = sinon.spy(),
		wrapper = shallow(
			<SocialCircleList
				back={backSpy}
				handleNewConversation={handleNewConversationSpy}
				socialCircle={socialCircle}
			/>
		);

	it( "Checks that <SocialCircleList/> renders", () => {
		expect( wrapper ).to.have.length( 1 );
	});

	it( "Checks that <SocialCircleList/> children renders", () => {
		expect( wrapper.children()).to.have.length( 2 );
	});

	it( "Checks that all the friends render", () => {
		const renderedMessages = wrapper.find( ".socialCircleList" ).children();
		expect( renderedMessages ).to.have.length( socialCircle.length );
	});

	it( "Checks that clicking arrowBack calls back", () => {
		expect( backSpy.called ).to.equal( false );
		wrapper.find( ".arrowBack" ).simulate( "click" );
		expect( backSpy.called ).to.equal( true );
	});

	it( "Checks that clicking friend calls handleNewConversation", () => {
		expect( handleNewConversationSpy.called ).to.equal( false );
		wrapper.find( ".friend" ).first().simulate( "click" );
		expect( handleNewConversationSpy.called ).to.equal( true );
	});
});
