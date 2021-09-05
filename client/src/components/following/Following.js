import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";

import "./following.css";
import axios from "axios";
const Following = () => {
  const [following, setFollowing] = useState([]);
  const history = useHistory();
  const locationRoute = useLocation();
  useEffect(() => {
    const userId = locationRoute.state;
    if (userId) {
      (async () => {
        try {
          const response = await axios.get("/api/profile/following/" + userId);
          if (response?.data?.success) {
            setFollowing(response?.data?.following);
          }
        } catch (e) {}
      })();
    } else {
      history.push("/");
    }
  }, [history, locationRoute.state]);

  const unfollowUser = async (e) => {
    const userId = e.target?.dataset["id"];
    if (userId) {
      try {
        const response = await axios.post("/api/profile/unfollow/", {
          unfollowing_user: userId,
        });
        if (response?.data?.success) {
          const followingIndex = following.findIndex(
            (follow) => follow.user === userId
          );
          setFollowing([
            ...following.slice(0, followingIndex),
            ...following.slice(followingIndex + 1, following.length),
          ]);
        } else {
        }
      } catch (e) {}
    }
  };
  return (
    <div className="following-container" onClick={unfollowUser}>
      {following?.map((follow, index) => {
        return (
          <div className="following" key={index}>
            <div className="handle-name">
              <b>{follow.handle}</b>
            </div>
            <button
              type="button"
              data-id={follow.user}
              className="btn btn-primary"
            >
              Following
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Following;
