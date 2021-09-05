import React, { useState, useEffect, useRef } from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FOLLOW, FOLLOWING } from "../../constants";
import axios from "axios";
import Posts from "../post/Posts";
import "./profile.css";
import { SET_ERROR } from "../../actions/types";

const Profile = () => {
  const [id, setId] = useState("");
  const [handleName, setHandleName] = useState("");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [follow, setFollow] = useState(FOLLOW);
  const [profileNotFound, setProfileNotFound] = useState("");
  const history = useHistory();
  const dispatch = useDispatch();
  const locationRoute = useLocation();
  const { userId } = useParams();
  const profileUser = useRef();
  profileUser.current = useSelector((state) => state?.auth?.userData?.user?.id);
  useEffect(() => {
    const userInfo = locationRoute.state;
    if (userInfo || userId) {
      const key = userId ?? userInfo;
      (async () => {
        try {
          const response = await axios.get("/api/profile/handle/" + key);

          if (response?.data?.success) {
            if (response?.data?.profile?.user === profileUser.current) {
              history.push("/profile");
              return;
            }
            const followers = response?.data?.profile?.followers;
            const followerIndex = followers?.findIndex(
              (follow) => follow.user === profileUser.current
            );
            if (followerIndex !== -1) {
              setFollow(FOLLOWING);
            }
            setId(response?.data?.profile?.user);
            setHandleName(response?.data?.profile?.handle);
            setLocation(response?.data?.profile?.location);
            setBio(response?.data?.profile?.bio);
            setFollowers(followers);
            setFollowing(response?.data?.profile?.following);
            setProfileNotFound("");
          } else {
            setProfileNotFound(response?.data?.errorMessage);
            dispatch({
              type: SET_ERROR,
              payload: response?.data?.errorMessage,
            });
          }
        } catch (e) {
          dispatch({
            type: SET_ERROR,
            payload: e?.response?.data?.errorMessage,
          });
        }
      })();
    } else {
      history.push("/");
    }
  }, [dispatch, history, locationRoute.state, userId]);

  const followUser = async () => {
    const keys = { api: "follow", input: "following_user" };
    if (follow === FOLLOWING) {
      keys.api = "unfollow";
      keys.input = "unfollowing_user";
    }

    try {
      const response = await axios.post("/api/profile/" + keys.api, {
        [keys.input]: id,
      });
      if (response?.data?.success) {
        if (keys.api === "follow") setFollow(FOLLOWING);
        else setFollow(FOLLOW);
        window.location.reload();
      } else {
        dispatch({ type: SET_ERROR, payload: response?.data?.errorMessage });
        if (response?.data?.create_profile) history.push("/profile");
      }
    } catch (e) {
      dispatch({ type: SET_ERROR, payload: e?.response?.data?.errorMessage });
      history.push("/login");
    }
  };
  return (
    <React.Fragment>
      {profileNotFound && (
        <h2 className="text-center mt-5">{profileNotFound}</h2>
      )}
      {id && (
        <>
          <div className="profile-container">
            <div className="name-container">
              <div className="user-info">
                <div className="image-container">
                  {handleName?.charAt(0)?.toUpperCase()}
                </div>
                <h3 className="name">@{handleName}</h3>
              </div>
              <button className="btn btn-info ml-32" onClick={followUser}>
                {follow}
              </button>
            </div>
            <div className="follow-container">
              <div className="followers-container">
                <b>{followers?.length}</b> Followers
              </div>
              <div className="following-container">
                <b>{following?.length}</b> Following
              </div>
            </div>
            <div className="profile-form">
              <div className="form-group">
                <b>Location:</b> {location}
              </div>
              <div className="form-group">
                <b>Bio:</b> {bio}
              </div>
            </div>
          </div>
          <div className="my-posts-container">
            <h2>Posts</h2>
            <Posts userId={id} />
          </div>
        </>
      )}
    </React.Fragment>
  );
};

export default Profile;
