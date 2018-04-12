import React, { Component } from "react";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import UserRoute from "./utils/routes/UserRoute";
import GuestRoute from "./utils/routes/GuestRoute";
import { Switch } from "react-router";

// Switch will render the first match. /:username must be last
class App extends Component {
	render() {
		return (
			<div>
				<Switch>
					<UserRoute exact path="/" component={HomePage} />
					<GuestRoute path="/login" component={AuthPage} />
					<SettingsPage path="/settings" component={SettingsPage} />

					<UserRoute path="/:username" component={ProfilePage} />
				</Switch>
			</div>
		);
	}
}

export default App;
