import React, { useEffect } from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";

import MyProfile from "./MyProfile";
import Profile from "./Profile";
import "./profile.css";
const ProfilePostContainer = () => {
  const history = useHistory();
  const locationRoute = useLocation();
  const { userId } = useParams();

  useEffect(() => {
    if (!locationRoute.state && !userId && !localStorage.jwtToken) {
      history.push("/");
      return;
    }
  }, [history, locationRoute.state, userId]);
  return (
    <div className="profile-post-container">
      {locationRoute.state || userId ? (
        <Profile />
      ) : (
        localStorage.jwtToken && <MyProfile />
      )}
    </div>
  );
};

export default ProfilePostContainer;
