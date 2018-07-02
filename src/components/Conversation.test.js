import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import Conversation from "./Conversation";
import sinon from "sinon";

Enzyme.configure({ adapter: new Adapter() });

describe( "<Conversation/>", () => {
	var
		conversation = { target: {}, messages: [] },
		switchConversationSpy = sinon.spy(),
		wrapper = shallow(
			<Conversation
				switchConversation={switchConversationSpy}
				conversation={conversation}
				messageInput={""}
			/>
		);

	it( "Checks that <Conversation/> renders", () => {
		expect( wrapper ).to.have.length( 1 );
	});

	it( "Checks that <Conversation/> children renders", () => {
		expect( wrapper.children()).to.have.length( 3 );
	});

	it( "Checks that all the messages render", () => {
		const renderedMessages = wrapper.find( ".messagesWrapper" ).children();
		expect( renderedMessages ).to.have.length(
			conversation.messages.length
		);
	});

	it( "Checks that clicking arrowBack calls switchConversation", () => {
		expect( switchConversationSpy.called ).to.equal( false );
		wrapper.find( ".arrowBack" ).simulate( "click" );
		expect( switchConversationSpy.called ).to.equal( true );
	});
});
