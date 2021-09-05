import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import setAuthToken from "../common/setAuthToken";
import { TITLE, DESCRIPTION } from "../../constants";
import "./createPost.css";
import { SET_ERROR, SET_SUCCESS } from "../../actions/types";

const CreatePost = () => {
  const [title, setTitle] = useState({ value: "", error: false });
  const [description, setDescription] = useState({ value: "", error: false });
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    if (localStorage.jwtToken) setAuthToken(localStorage.getItem("jwtToken"));
    else {
      history.push("/login");
      return;
    }
  }, [history]);

  const handleChangeInput = (e) => {
    let { target } = e;

    switch (target.name) {
      case TITLE:
        setTitle({ ...title, value: target.value });
        break;
      case DESCRIPTION:
        setDescription({ ...description, value: target.value });
        break;
      default:
      // error_modal("wrong input");
    }
  };
  const validateFields = () => {
    if (!title.value) {
      setTitle({ ...title, error: "title is required" });
      return false;
    }
    if (!description.value) {
      setDescription({ ...description, error: "description is required" });
      return false;
    }
    return true;
  };
  const submitPost = async (e) => {
    e.preventDefault();
    if (validateFields()) {
      const data = {
        [TITLE]: title.value,
        [DESCRIPTION]: description.value,
      };
      try {
        const response = await axios.post("/api/posts/", data);
        if (response?.data?.success) {
          // post created
          dispatch({ type: SET_SUCCESS, payload: response?.data?.msg });
        } else {
          dispatch({ type: SET_ERROR, payload: response?.data?.errorMessage });
          if (response?.data?.create_profile) history.push("/profile");
        }
      } catch (e) {
        dispatch({ type: SET_ERROR });
      }
    }
  };

  return (
    <div className="post-container">
      <form onSubmit={submitPost}>
        <div className="form-group">
          <label>Title: </label>
          <input
            className="form-control"
            name={TITLE}
            value={title.value}
            onChange={handleChangeInput}
          />
          {title.error && <small className="error-msg">{title.error}</small>}
        </div>
        <div className="form-group">
          <label>Description: </label>
          <textarea
            rows="7"
            className="form-control"
            name={DESCRIPTION}
            value={description.value}
            onChange={handleChangeInput}
          />
          {description.error && (
            <small className="error-msg">{description.error}</small>
          )}
        </div>
        <button type="submit" className="btn btn-success">
          Post
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
