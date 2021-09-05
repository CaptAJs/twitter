import React, { useEffect, useState } from "react";
import axios from "axios";
import { useHistory, useLocation } from "react-router-dom";
import setAuthToken from "../common/setAuthToken";
import { useDispatch } from "react-redux";
import "./post.css";
import { SET_ERROR } from "../../actions/types";

const Post = () => {
  const [post, setPost] = useState([]);
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  useEffect(() => {
    const postId = location?.state;
    (async () => {
      if (localStorage.jwtToken) setAuthToken(localStorage.getItem("jwtToken"));
      else {
        history.push("/login");
        return;
      }
      try {
        const response = await axios.get("/api/posts/post/" + postId);
        if (response?.data?.success) {
          setPost(response?.data?.post);
        } else
          dispatch({ type: SET_ERROR, payload: response?.data?.errorMessage });
      } catch (e) {
        dispatch({ type: SET_ERROR, payload: e?.response?.data?.errorMessage });
      }
    })();
  }, [dispatch, history, location?.state]);

  const seeProfile = (profileHandle) => {
    history.push("/profile/" + profileHandle);
    return;
  };
  return (
    <div className="post-container">
      <div className="image-container">
        <div className="image">{post?.handle?.charAt(0)?.toUpperCase()}</div>
        <h5
          className="username"
          onClick={() => {
            seeProfile(post?.handle);
          }}
        >
          {post?.handle}
        </h5>
      </div>
      <h4 className="title">{post?.title}</h4>
      <h6 className="description">{post?.description}</h6>
    </div>
  );
};

export default Post;
