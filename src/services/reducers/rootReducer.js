import { combineReducers } from "redux";
import authenticated from "./user";
import posts from "./posts";

export default combineReducers({
	authenticated,
	posts
});
