import { combineReducers } from "redux";
import { AuthReducer } from "./authReducer";
import { ErrorReducer } from "./errorReducer";
import { SuccessReducer } from "./successReducer";

export const reducers = combineReducers({
  auth: AuthReducer,
  error: ErrorReducer,
  success: SuccessReducer,
});
