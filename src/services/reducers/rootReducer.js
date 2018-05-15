import { combineReducers } from "redux";
import authenticated from "./user";
import posts from "./posts";
import notifications from "./notifications";
import messages from "./messages";

export default combineReducers({
	authenticated,
	posts,
	notifications,
	messages
});
