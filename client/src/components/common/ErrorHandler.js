import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { REMOVE_ERROR } from "../../actions/types";
import "./error.css";

const ErrorHandler = () => {
  const errorData = useSelector((state) => state.error);
  const dispatch = useDispatch();
  useEffect(() => {
    let timer;
    if (errorData?.hasError) {
      timer = setTimeout(() => {
        dispatch({ type: REMOVE_ERROR, payload: "" });
      }, 3000);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [dispatch, errorData]);

  return (
    <div>
      {errorData?.hasError && (
        <div className="error-handler">{errorData?.error}</div>
      )}
    </div>
  );
};

export default ErrorHandler;
