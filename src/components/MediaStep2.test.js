import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import MediaStep2 from "./MediaStep2";
import sinon from "sinon";

Enzyme.configure({ adapter: new Adapter() });

describe( "<MediaStep2/>", () => {
	var
		prevStepSpy = sinon.spy(),
		nextStepSpy = sinon.spy(),
		wrapper = shallow(
			<MediaStep2
				mediaData={{}}
				userInput={""}
				DefaultCover={""}
				prevStep={prevStepSpy}
				nextStep={nextStepSpy}
				socialCircle={[]}
			/>
		);

	it( "Checks that <MediaStep2/> renders", () => {
		expect( wrapper ).to.have.length( 1 );
	});

	it( "Checks that <MediaStep2/> children renders", () => {
		expect( wrapper.children()).to.have.length( 3 );
	});

	it( "Checks that nextButton calls nextStep", () => {
		expect( nextStepSpy.called ).to.equal( false );
		wrapper.find( ".nextButton" ).simulate( "click" );
		expect( nextStepSpy.called ).to.equal( true );
	});

	it( "Checks that prevButton calls prevStep", () => {
		expect( prevStepSpy.called ).to.equal( false );
		wrapper.find( ".prevButton" ).simulate( "click" );
		expect( prevStepSpy.called ).to.equal( true );
	});
});
