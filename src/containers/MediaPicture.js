import React, { Component } from "react";
import PropTypes from "prop-types";
import MediaStep2 from "../components/MediaStep2";
import MediaStep3 from "../components/MediaStep3";


class MediaPicture extends Component {
	constructor() {
		super();
		this.state = {
			description: "",
			mediaData: {},
			step: 1,
			privacyRange: 1,
			checkNsfw: false,
			checkSpoiler: false
		};
	}

	static getDerivedStateFromProps( nextProps, prevState ) {
		if ( nextProps.mediaData ) {
			return { mediaData: nextProps.mediaData };
		}
	}

	nextStep = description => {
		this.setState({
			step: this.state.step + 1,
			description: description
		});
	}

	prevStep = () => {
		if ( this.state.step === 1 ) {
			this.props.switchPicture();
		} else {
			this.setState({ step: this.state.step - 1 });
		}
	}

	setPrivacyRange = range => {
		this.setState({ privacyRange: range });
	}

	handleCheck = ( e, semanticUiProps ) => {
		this.setState({ [ semanticUiProps.name ]: semanticUiProps.checked });
	}

	handleSubmit = () => {
		this.props.submitPicture( this.state.description );
	}

	render() {
		if ( this.state.step === 2 ) {
			return (
				<MediaStep3
					handleCheck={this.handleCheck}
					setPrivacyRange={this.setPrivacyRange}
					prevStep={this.prevStep}
					handleSubmit={this.handleSubmit}
					mediaData={this.state.mediaData}
					privacyRange={this.state.privacyRange}
				/>
			);
		}
		return (
			<MediaStep2
				socialCircle={this.props.socialCircle}
				prevStep={this.prevStep}
				nextStep={this.nextStep}
				mediaData={this.state.mediaData}
			/>
		);
	}
}

MediaPicture.propTypes = {
	mediaData: PropTypes.object.isRequired,
	socialCircle: PropTypes.array.isRequired,
	switchPicture: PropTypes.func.isRequired,
	submitPicture: PropTypes.func.isRequired
};

export default MediaPicture;
