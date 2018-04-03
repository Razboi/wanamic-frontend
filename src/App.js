import React, { Component } from "react";
import { Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";

class App extends Component {
	render() {
		return (
			<div>
				<Route path="/auth" component={AuthPage} />
				<Route exact path="/" component={HomePage} />
			</div>
		);
	}
}

export default App;
