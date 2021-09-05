import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import "../following/following.css";
import axios from "axios";
const Followers = () => {
  const [followers, setFollowers] = useState([]);
  const history = useHistory();
  const locationRoute = useLocation();
  useEffect(() => {
    const userId = locationRoute.state;
    if (userId) {
      (async () => {
        const response = await axios.get("/api/profile/followers/" + userId);
        if (response?.data?.success) {
          setFollowers(response?.data?.followers);
        } else {
        }
      })();
    } else {
      history.push("/");
    }
  }, [history, locationRoute.state]);

  const followUser = async (e) => {
    const userId = e.target?.dataset["id"];
    if (userId) {
      try {
        await axios.post("/api/profile/follow", {
          following_user: userId,
        });
      } catch (e) {}
    }
  };
  return (
    <div className="follower-container">
      {followers?.map((follower, index) => {
        return (
          <div className="follower" key={index} onClick={followUser}>
            <div className="handle-name">
              <b>{follower.handle}</b>
            </div>
            <button
              type="button"
              data-id={follower.user}
              className="btn btn-primary"
            >
              Follow
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Followers;
