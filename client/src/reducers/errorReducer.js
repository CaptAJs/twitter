import { SET_ERROR, REMOVE_ERROR } from "../actions/types";

const initialState = { error: "", hasError: false };

export const ErrorReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ERROR:
      return {
        ...state,
        error: action.payload ?? "Something went wrong...",
        hasError: true,
      };
    case REMOVE_ERROR:
      return {
        ...state,
        error: action.payload,
        hasError: false,
      };
    default:
      return state;
  }
};
