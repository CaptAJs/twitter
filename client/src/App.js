import "./App.css";
import { useDispatch } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import Header from "./components/header/Header";
import React, { useEffect } from "react";
import setAuthToken from "./components/common/setAuthToken";
import jwt_decode from "jwt-decode";
import { CURRENT_USER, SET_ERROR } from "./actions/types";
import { logout } from "./actions/index";

import Routes from "./components/route/Routes";
import ErrorHandler from "./components/common/ErrorHandler";
import SuccessHandler from "./components/common/SuccessHandler";

if (localStorage.jwtToken) setAuthToken(localStorage.getItem("jwtToken"));

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      if (localStorage.jwtToken) {
        setAuthToken(localStorage.getItem("jwtToken"));
        try {
          const decoded = await jwt_decode(localStorage.jwtToken);
          dispatch({ type: CURRENT_USER, payload: decoded });
          const currentTime = Date.now() / 1000;
          if (decoded.exp < currentTime) {
            dispatch(logout());
          } else {
          }
        } catch (error) {
          dispatch({ type: SET_ERROR });
        }
      }
    })();
  }, [dispatch]);

  return (
    <BrowserRouter>
      <SuccessHandler />
      <ErrorHandler />
      <Header />
      <Routes />
    </BrowserRouter>
  );
}

export default App;
