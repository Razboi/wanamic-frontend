import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import ProfileOptions from "./ProfileOptions";
import sinon from "sinon";

Enzyme.configure({ adapter: new Adapter() });

describe( "<ProfileOptions/>", () => {
	var
		addFriendSpy = sinon.spy(),
		followSpy = sinon.spy(),
		acceptReqSpy = sinon.spy(),
		deleteReqSpy = sinon.spy(),
		deleteFriendSpy = sinon.spy(),
		wrapper = shallow(
			<ProfileOptions
				user={{ friends: [] }}
				handleAddFriend={addFriendSpy}
				handleFollow={followSpy}
				handleReqAccept={acceptReqSpy}
				handleReqDelete={deleteReqSpy}
				handleDeleteFriend={deleteFriendSpy}
				requested={false}
			/>
		),
		wrapper2 = shallow(
			<ProfileOptions
				user={{ friends: [] }}
				handleAddFriend={addFriendSpy}
				handleFollow={followSpy}
				handleReqAccept={acceptReqSpy}
				handleReqDelete={deleteReqSpy}
				handleDeleteFriend={deleteFriendSpy}
				requested={true}
			/>
		);

	it( "Checks that <ProfileOptions/> renders", () => {
		expect( wrapper ).to.have.length( 1 );
	});

	it( "Checks that <ProfileOptions/> children renders", () => {
		expect( wrapper.children()).to.have.length( 2 );
		expect( wrapper.children().children()).to.have.length( 3 );
	});

	it( "Checks that dropdownReqButton renders when requested is true", () => {
		expect( wrapper.find( ".dropdownReqButton" )).to.have.length( 0 );
		expect( wrapper2.find( ".dropdownReqButton" )).to.have.length( 1 );
	});
});
