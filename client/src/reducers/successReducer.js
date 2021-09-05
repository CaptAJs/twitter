import { SET_SUCCESS, REMOVE_SUCCESS } from "../actions/types";

const initialState = { successMsg: "" };

export const SuccessReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SUCCESS:
      return {
        ...state,
        successMsg: action.payload,
      };
    case REMOVE_SUCCESS:
      return {
        ...state,
        successMsg: "",
      };
    default:
      return state;
  }
};
