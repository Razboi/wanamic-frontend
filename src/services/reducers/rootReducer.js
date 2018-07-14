import { combineReducers } from "redux";
import authenticated from "./auth";
import posts from "./posts";
import notifications from "./notifications";
import conversations from "./conversations";
import user from "./user";

export default combineReducers({
	authenticated,
	posts,
	notifications,
	conversations,
	user
});
