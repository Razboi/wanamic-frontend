import React, { Component } from "react";
import { Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import UserRoute from "./utils/routes/UserRoute";

class App extends Component {
	render() {
		return (
			<div>
				<Route path="/login" component={AuthPage} />
				<UserRoute exact path="/" component={HomePage} />
			</div>
		);
	}
}

export default App;
