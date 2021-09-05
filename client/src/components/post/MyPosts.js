import axios from "axios";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import setAuthToken from "../common/setAuthToken";
import Post from "../feed/Post";
import "../feed/Feed.css";

const MyPosts = () => {
  const [posts, setPosts] = useState([]);
  const history = useHistory();

  useEffect(() => {
    if (localStorage.jwtToken) setAuthToken(localStorage.getItem("jwtToken"));
    else {
      history.push("/login");
      return;
    }
    try {
      (async () => {
        const response = await axios.get("/api/posts/my_posts");
        if (response?.data?.success) {
          setPosts(response?.data?.posts);
        } else {
        }
      })();
    } catch (e) {}
  }, [history]);

  const seePost = async (e) => {
    let postId = e.target?.dataset?.id;
    if (!postId) {
      const postContainerDiv = e.target?.closest(".post-container");
      if (postContainerDiv) postId = postContainerDiv?.dataset?.id;
    }
    if (postId) {
      history.push({ pathname: "/post", state: postId });
    }
  };
  return (
    <div className="posts-container" onClick={seePost}>
      {posts?.length > 0 && <h2 className="post-heading">My Posts</h2>}
      {posts?.map((post, index) => (
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

export default MyPosts;
