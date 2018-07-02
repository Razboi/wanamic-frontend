import { combineReducers } from "redux";
import authenticated from "./user";
import posts from "./posts";
import notifications from "./notifications";
import conversations from "./conversations";

export default combineReducers({
	authenticated,
	posts,
	notifications,
	conversations
});
