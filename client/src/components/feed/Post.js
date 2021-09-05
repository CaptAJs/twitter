import React from "react";
import "./post.css";
const Post = ({ username, title, description, id }) => {
  return (
    <div className="post-container" data-id={id}>
      <div className="image-container">
        <div className="image">{username?.charAt(0)?.toUpperCase()}</div>
        <h5 className="username">@{username}</h5>
      </div>
      <h4 className="title">{title}</h4>
      <h6 className="description">{description}</h6>
    </div>
  );
};

export default Post;
