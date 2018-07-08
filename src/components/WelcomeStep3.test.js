import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import WelcomeStep3 from "./WelcomeStep3";
import sinon from "sinon";

Enzyme.configure({ adapter: new Adapter() });

describe( "<WelcomeStep3/>", () => {
	var
		wrapper,
		prevSpy,
		categories = [ "test", "test2", "test3" ],
		checkedCategories = [ "test" ],
		nextSpy;
	beforeEach(() => {
		nextSpy = sinon.spy();
		prevSpy = sinon.spy();
		wrapper = shallow(
			<WelcomeStep3
				categories={categories}
				categoriesNext={nextSpy}
				checkedCategories={checkedCategories}
				handlePrev={prevSpy}
			/>
		);
	});

	it( "Checks that <WelcomeStep3/> renders", () => {
		expect( wrapper ).to.have.length( 1 );
	});

	it( "Checks that <WelcomeStep3/> children renders", () => {
		expect( wrapper.children()).to.have.length( 3 );
	});

	it( "Checks that categoriesWrapper renders all the categories", () => {
		expect( wrapper.find( ".categoriesWrapper" ).children()
		).to.have.length( categories.length );
	});

	it( "Checks that next button is disabled if checkedCategories === 0", () => {
		const disabledProp = wrapper.find( ".nextButton" ).prop( "disabled" );
		expect( disabledProp ).to.equal( checkedCategories.length === 0 );
	});

	it( "Checks that clicking next button calls categoriesNext", () => {
		expect( nextSpy.called ).to.equal( false );
		wrapper.find( ".nextButton" ).simulate( "click" );
		expect( nextSpy.called ).to.equal( true );
	});

	it( "Checks that clicking prev button calls handlePrev", () => {
		expect( prevSpy.called ).to.equal( false );
		wrapper.find( ".prevButton" ).simulate( "click" );
		expect( prevSpy.called ).to.equal( true );
	});
});
