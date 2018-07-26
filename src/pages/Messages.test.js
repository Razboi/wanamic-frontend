import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import Messages from "./Messages";
import configureStore from "redux-mock-store";
import sinon from "sinon";

const mockStore = configureStore();
Enzyme.configure({ adapter: new Adapter() });

describe( "<Messages/>", () => {
	const
		conversations = [],
		store = mockStore({
			conversations: {
				allConversations: [],
				currentConversation: {}
			}
		}),
		wrapper = shallow(
			<Messages store={store} />
		).dive();

	it( "Checks that <Messages/> renders", () => {
		expect( wrapper ).to.have.length( 1 );
	});
});
