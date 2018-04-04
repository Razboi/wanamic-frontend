import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import rootReducer from "./services/reducers/rootReducer";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { userLoggedIn } from "./services/actions/auth";
import "semantic-ui-css/semantic.min.css";

const store = createStore( rootReducer, composeWithDevTools(
	applyMiddleware( thunk )
));

if ( localStorage.token ) {
	store.dispatch( userLoggedIn());
}

ReactDOM.render(
	<BrowserRouter>
		<Provider store={store}>
			<App />
		</Provider>
	</BrowserRouter>
	,
	document.getElementById( "root" ));
registerServiceWorker();
