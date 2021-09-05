import {
  REGISTER_USER,
  CURRENT_USER,
  LOGOUT_USER,
  LOGIN_USER,
} from "../actions/types";

const initialState = {
  isAuthenticated: false,
  userData: {},
  isLoading: true,
  isRegistered: false,
};

export const AuthReducer = (state = initialState, action) => {
  switch (action.type) {
    case REGISTER_USER:
      return {
        ...state,
        isLoading: false,
        isRegistered: true,
      };
    case CURRENT_USER:
      return {
        ...state,
        isAuthenticated: action.payload ? true : false,
        userData: action.payload,
        isLoading: false,
      };
    case LOGIN_USER:
      return {
        ...state,
        isAuthenticated: action.payload ? true : false,
        userData: action.payload,
        isLoading: false,
      };
    case LOGOUT_USER:
      return {
        ...state,
        isAuthenticated: false,
        userData: {},
        isLoading: false,
        isRegistered: false,
      };
    default:
      return state;
  }
};
