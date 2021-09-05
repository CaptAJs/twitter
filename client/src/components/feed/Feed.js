import axios from "axios";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import setAuthToken from "../common/setAuthToken";
import { useDispatch } from "react-redux";
import Post from "./Post";
import "./Feed.css";
import { SET_ERROR } from "../../actions/types";
const Feed = () => {
  const [feeds, setFeeds] = useState([]);
  const [showAllPosts, setShowAllPost] = useState(false);
  const [posts, setPosts] = useState([]);
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    if (localStorage.jwtToken) setAuthToken(localStorage.getItem("jwtToken"));
    else {
      history.push("/login");
      return;
    }
    try {
      (async () => {
        const response = await axios.get("/api/posts/feed");

        if (response?.data?.success) {
          setFeeds(response?.data?.posts);
        } else {
          dispatch({ type: SET_ERROR, payload: response?.data?.errorMessage });
          if (response?.data?.create_profile) history.push("/profile");
        }
      })();
    } catch (e) {
      dispatch({ type: SET_ERROR });
    }
  }, [history, dispatch]);

  const seePost = (e) => {
    let postId = e.target?.dataset?.id;
    if (!postId) {
      const postContainerDiv = e.target?.closest(".post-container");
      if (postContainerDiv) postId = postContainerDiv?.dataset?.id;
    }
    if (postId) {
      history.push({ pathname: "/post", state: postId });
    }
  };
  const getAllPosts = (url) => {
    try {
      (async () => {
        const response = await axios.get("/api/posts/" + url);

        if (response?.data?.success) {
          if (url === "feed") {
            setShowAllPost(false);
            setFeeds(response?.data?.posts);
          } else {
            setShowAllPost(true);
            setPosts(response?.data?.posts);
          }
          return response?.data?.posts;
        }
      })();
    } catch (e) {
      // dispatch
    }
  };
  return (
    <div className="posts-container" onClick={seePost}>
      {!showAllPosts ? (
        <div className="heading-section">
          <button
            type="button"
            className="btn btn-link"
            onClick={() => {
              getAllPosts("");
            }}
          >
            See All Posts
          </button>
          <h2>Feed</h2>
        </div>
      ) : (
        <div className="heading-section">
          <button
            type="button"
            onClick={() => {
              getAllPosts("feed");
            }}
            className="btn btn-link"
          >
            See Feed
          </button>
          <h2>All Posts</h2>
        </div>
      )}
      {!showAllPosts
        ? feeds?.map((feed, index) => (
            <Post
              key={index}
              username={feed?.handle}
              title={feed?.title}
              description={feed?.description}
              id={feed?._id}
            />
          ))
        : posts?.map((post, index) => (
            <Post
              key={index}
              username={post?.handle}
              title={post?.title}
              description={post?.description}
              id={post?._id}
            />
          ))}
    </div>
  );
};

export default Feed;
