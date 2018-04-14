import React, { Component } from "react";
import api from "../services/api";
import Step2 from "../components/WelcomeStep2";
import Step3 from "../components/WelcomeStep3";
import Step4 from "../components/WelcomeStep4";


class WelcomePage extends Component {
	constructor() {
		super();
		this.state = {
			username: "",
			description: "",
			userImage: null,
			step: 1
		};
	}

	handleChange = e =>
		this.setState({ [ e.target.name ]: e.target.value })

	handleFileChange = e => {
		this.setState({
			[ e.target.name ]: e.target.files[ 0 ]
		});
	}

	handleNext = () =>
		this.setState({ step: this.state.step + 1 })

	handlePrev = () =>
		this.setState({ step: this.state.step - 1 })

	render() {
		return (
			<div>
				{ this.state.step === 1 &&
					<Step2
						handleNext={this.handleNext}
						handleChange={this.handleChange}
						handleFileChange={this.handleFileChange}
					/>
				}

				{ this.state.step === 2 &&
					<Step3
						handleNext={this.handleNext}
						handlePrev={this.handlePrev}
						handleChange={this.handleChange}
					/>
				}

				{ this.state.step === 3 &&
					<Step4
						handleNext={this.handleNext}
						handlePrev={this.handlePrev}
						handleChange={this.handleChange}
					/>
				}

			</div>
		);
	}
}

export default WelcomePage;
