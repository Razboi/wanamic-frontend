import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import MediaOptions from "./MediaOptions";
import sinon from "sinon";
import configureStore from "redux-mock-store";

const mockStore = configureStore();
Enzyme.configure({ adapter: new Adapter() });

describe( "<MediaOptions/>", () => {
	const
		store = mockStore({}),
		PictureSelectSpy = sinon.spy(),
		wrapper = shallow(
			<MediaOptions
				handlePictureSelect={PictureSelectSpy}
				store={store}
			/>
		).dive();

	it( "Checks that <MediaOptions/> renders", () => {
		expect( wrapper ).to.have.length( 1 );
	});

	it( "Checks that <MediaOptions/> children render", () => {
		expect( wrapper.children()).to.have.length( 2 );
	});

	it( "Checks that <MediaOptions/> children render with state.searchMedia", () => {
		wrapper.setState({ searchMedia: true });
		expect( wrapper.children()).to.have.length( 2 );
	});

	it( "Checks that <MediaOptions/> children render with state.shareLink", () => {
		wrapper.setState({ shareLink: true });
		expect( wrapper.children()).to.have.length( 2 );
	});
});
