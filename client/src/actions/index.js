import {
  REGISTER_USER,
  LOGIN_USER,
  CURRENT_USER,
  LOGOUT_USER,
  SET_ERROR,
  SET_SUCCESS,
} from "./types";
import axios from "axios";
import jwt_decode from "jwt-decode";
import setAuthToken from "../components/common/setAuthToken";

export const register = (data) => async (dispatch) => {
  try {
    const res = await axios.post("/api/users/register", data);
    if (res?.data?.success) {
      dispatch({ type: REGISTER_USER, payload: {} });
      dispatch({ type: SET_SUCCESS, payload: res?.data?.msg });
    } else {
      dispatch({ type: SET_ERROR, payload: res?.data?.errorMessage });
    }
  } catch (error) {
    dispatch({ type: SET_ERROR, payload: "Something went wrong..." });
  }
};

export const login = (data) => async (dispatch) => {
  try {
    const res = await axios.post("/api/users/login/", data);
    if (res?.data?.success) {
      const { token } = res.data;
      localStorage.setItem("jwtToken", token);
      setAuthToken(token);
      const decoded = await jwt_decode(token);
      dispatch({ type: LOGIN_USER, payload: decoded?.user });
    } else {
      dispatch({ type: SET_ERROR, payload: res?.data?.errorMessage });
    }
    return;
  } catch (error) {
    dispatch({ type: SET_ERROR });
  }
};

export const isLoggedIn = () => {
  return async function (dispatch) {
    const token = localStorage.getItem("jwtToken");
    setAuthToken(token);
    try {
      const res = await axios.get("/api/users/current");
      dispatch({ type: CURRENT_USER, payload: res.data });
    } catch (error) {}
  };
};

export const logout = () => {
  return function (dispatch) {
    localStorage.removeItem("jwtToken");
    setAuthToken();
    dispatch({ type: LOGOUT_USER });
  };
};
