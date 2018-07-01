import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import FriendsList from "./FriendsList";
import sinon from "sinon";

Enzyme.configure({ adapter: new Adapter() });

describe( "<FriendsList/>", () => {
	var
		friends = [ "hi", "sup" ],
		switchFriendsListSpy = sinon.spy(),
		handleNewConversationSpy = sinon.spy(),
		wrapper = shallow(
			<FriendsList
				switchFriendsList={switchFriendsListSpy}
				handleNewConversation={handleNewConversationSpy}
				friends={friends}
			/>
		);

	it( "Checks that <FriendsList/> renders", () => {
		expect( wrapper ).to.have.length( 1 );
	});

	it( "Checks that <FriendsList/> children renders", () => {
		expect( wrapper.children()).to.have.length( 2 );
	});

	it( "Checks that all the friends render", () => {
		const renderedMessages = wrapper.find( ".friendsList" ).children();
		expect( renderedMessages ).to.have.length( friends.length );
	});

	it( "Checks that clicking arrowBack calls switchFriendsList", () => {
		expect( switchFriendsListSpy.called ).to.equal( false );
		wrapper.find( ".arrowBack" ).simulate( "click" );
		expect( switchFriendsListSpy.called ).to.equal( true );
	});

	it( "Checks that clicking friend calls handleNewConversation", () => {
		expect( handleNewConversationSpy.called ).to.equal( false );
		wrapper.find( ".friend" ).first().simulate( "click" );
		expect( handleNewConversationSpy.called ).to.equal( true );
	});
});
