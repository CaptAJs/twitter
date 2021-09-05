import React, { useState, useEffect } from "react";
import { validateEmail, validatePassword } from "../common/formValidation";
import { EMAIL, PASSWORD } from "../../constants";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../actions/index";
import { useHistory, Link } from "react-router-dom";
import { Redirect } from "react-router";

import "./login.css";
import { SET_ERROR } from "../../actions/types";

const LoginForm = () => {
  const [email, setEmail] = useState({
    value: "",
    error: false,
  });
  const [password, setPassword] = useState({
    value: "",
    error: false,
  });
  const dispatch = useDispatch();
  const history = useHistory();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const validateAllFields = () => {
    return (
      !validateEmail(email.value) && !validatePassword(password.value, "login")
    );
  };

  useEffect(() => {
    if (isAuthenticated) {
      history.push("/");
    }
  }, [history, isAuthenticated]);

  const handleChangeInput = (e) => {
    let { target } = e;
    switch (target.name) {
      case EMAIL:
        setEmail({ ...email, value: target.value });
        break;
      case PASSWORD:
        setPassword({ ...password, value: target.value });
        break;
      default:
      // error_modal("wrong input");
    }
  };

  const handleBlurInput = (e) => {
    const { target } = e;
    switch (target.name) {
      case EMAIL:
        setEmail({ ...email, error: validateEmail(email.value) });
        break;
      case PASSWORD:
        setPassword({
          ...password,
          error: validatePassword(password.value, "login"),
        });
        break;
      default:
    }
  };
  const submitForm = (e) => {
    e.preventDefault();
    if (validateAllFields()) {
      let data = {
        email: email.value,
        password: password.value,
      };
      dispatch(login(data));
    } else
      dispatch({ type: SET_ERROR, payload: "Please enter all the fields" });
  };

  if (isAuthenticated) {
    return <Redirect to="/" />;
  }
  return (
    <div className="login-form">
      <form onSubmit={submitForm}>
        <h2 className="container-heading">Login to your account</h2>
        <div className="form-group">
          <label>Email: </label>
          <input
            className="form-control"
            name={EMAIL}
            value={email.value}
            onChange={handleChangeInput}
            onBlur={handleBlurInput}
            type="text"
          />
          {email.error && <small className="error-msg">{email.error}</small>}
        </div>
        <div className="form-group">
          <label>Password: </label>
          <input
            className="form-control"
            name={PASSWORD}
            value={password.value}
            onChange={handleChangeInput}
            onBlur={handleBlurInput}
            type="password"
          />
          {password.error && (
            <small className="error-msg">{password.error}</small>
          )}
        </div>
        <button className="btn btn-primary">Login</button>
      </form>
      <div className="not-registered">
        Not registered yet? <Link to="/register">Register</Link>
      </div>
    </div>
  );
};

export default LoginForm;
