import React, { useState, useEffect } from "react";
import {
  validateName,
  validateEmail,
  validatePassword,
  validateMobile,
} from "../common/formValidation";
import { NAME, EMAIL, PASSWORD, MOBILE_NUMBER } from "../../constants";
import { LOGOUT_USER } from "../../actions/types";
import { register } from "../../actions/index";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, Link } from "react-router-dom";
import { Redirect } from "react-router";

import "./register.css";

const RegistrationForm = () => {
  const [name, setName] = useState({
    value: "",
    error: false,
  });
  const [email, setEmail] = useState({
    value: "",
    error: false,
  });
  const [password, setPassword] = useState({
    value: "",
    error: false,
  });
  const [mobileNumber, setMobileNumber] = useState({
    value: "",
    error: false,
  });
  let history = useHistory();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { isRegistered } = useSelector((state) => state.auth);

  const validateAllFields = () => {
    return (
      !validateName(name.value) &&
      !validateEmail(email.value) &&
      !validatePassword(password.value) &&
      !validateMobile(mobileNumber.value)
    );
  };

  const handleChangeInput = (e) => {
    let { target } = e;
    switch (target.name) {
      case NAME:
        setName({ ...name, value: target.value });
        break;
      case EMAIL:
        setEmail({ ...email, value: target.value });
        break;
      case PASSWORD:
        setPassword({ ...password, value: target.value });
        break;
      case MOBILE_NUMBER:
        setMobileNumber({ ...mobileNumber, value: target.value });
        break;
      default:
      // error_modal("wrong input");
    }
  };

  const handleBlurInput = (e) => {
    const { target } = e;
    switch (target.name) {
      case NAME:
        setName({ ...name, error: validateName(name.value) });
        break;
      case EMAIL:
        setEmail({ ...email, error: validateEmail(email.value) });
        break;
      case PASSWORD:
        setPassword({ ...password, error: validatePassword(password.value) });
        break;
      case MOBILE_NUMBER:
        setMobileNumber({
          ...mobileNumber,
          error: validateMobile(mobileNumber.value),
        });
        break;
      default:
    }
  };

  useEffect(() => {
    if (isRegistered) {
      history.push("/");
      dispatch({ type: LOGOUT_USER });
    }
  }, [dispatch, history, isRegistered]);

  const submitForm = (e) => {
    e.preventDefault();
    if (validateAllFields()) {
      const data = {
        [NAME]: name.value,
        [EMAIL]: email.value,
        [PASSWORD]: password.value,
        [MOBILE_NUMBER]: mobileNumber.value,
      };
      dispatch(register(data));
    }
  };

  if (isAuthenticated) {
    return <Redirect to="/" />;
  }

  return (
    <div className="register-form">
      <form onSubmit={submitForm}>
        <h2 className="container-heading">Register your account now!</h2>
        <div className="form-group">
          <label>Name: </label>
          <input
            className="form-control"
            type="text"
            name={NAME}
            value={name.value}
            onChange={handleChangeInput}
            onBlur={handleBlurInput}
          />
          {name.error && <small className="error-msg">{name.error}</small>}
        </div>
        <div className="form-group">
          <label>Email: </label>
          <input
            className="form-control"
            name={EMAIL}
            value={email.value}
            type="email"
            onChange={handleChangeInput}
            onBlur={handleBlurInput}
          />
          {email.error && <small className="error-msg">{email.error}</small>}
        </div>
        <div className="form-group">
          <label>Password: </label>
          <input
            className="form-control"
            type="password"
            name={PASSWORD}
            value={password.value}
            onChange={handleChangeInput}
            onBlur={handleBlurInput}
          />
          {password.error && (
            <small className="error-msg">{password.error}</small>
          )}
        </div>
        <div className="form-group">
          <label> Mobile Number: </label>
          <input
            className="form-control"
            type="text"
            name={MOBILE_NUMBER}
            value={mobileNumber.value}
            onChange={handleChangeInput}
            onBlur={handleBlurInput}
          />
          {mobileNumber.error && (
            <small className="error-msg">{mobileNumber.error}</small>
          )}
        </div>
        <button className="btn btn-primary">Register</button>
      </form>
      <div className="already-registered">
        Already registered? <Link to="/login">Login</Link>
      </div>
    </div>
  );
};

export default RegistrationForm;
