import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import ChatsList from "./ChatsList";
import configureStore from "redux-mock-store";
import sinon from "sinon";

const mockStore = configureStore();
Enzyme.configure({ adapter: new Adapter() });

describe( "<ChatsList/>", () => {
	const
		conversations = [],
		store = mockStore({
			conversations: {
				allConversations: [],
				currentConversation: {}
			}
		}),
		wrapper = shallow(
			<ChatsList store={store} />
		).dive();

	it( "Checks that <ChatsList/> renders", () => {
		expect( wrapper ).to.have.length( 1 );
	});

	it( "Checks that every children renders", () => {
		expect( wrapper.children()).to.have.length( 3 );
	});
});
