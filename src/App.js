import React, { Component } from "react";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import UserRoute from "./utils/routes/UserRoute";
import NewUserRoute from "./utils/routes/NewUserRoute";
import WelcomePage from "./pages/WelcomePage";
import ExplorePage from "./pages/ExplorePage";
import GuestRoute from "./utils/routes/GuestRoute";
import { Switch } from "react-router";
import MediaPicture from "./containers/MediaPicture";

// Switch will render the first match. /:username must be last
class App extends Component {
	render() {
		return (
			<div>
				<Switch>
					<UserRoute exact path="/" component={HomePage}/>
					<GuestRoute path="/login" component={AuthPage} />
					<UserRoute path="/settings" component={SettingsPage}/>
					<NewUserRoute path="/welcome" component={WelcomePage} />
					<UserRoute path="/explore" component={ExplorePage} />
					<UserRoute path="/mediaPicture" component={MediaPicture} />

					<UserRoute path="/:username" component={ProfilePage} />
				</Switch>
			</div>
		);
	}
}

export default App;
