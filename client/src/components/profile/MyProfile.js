import React, { useState, useEffect } from "react";
import { HANDLE_NAME, LOCATION, BIO } from "../../constants";
import { useHistory } from "react-router-dom";
import setAuthToken from "../common/setAuthToken";
import axios from "axios";
import MyPosts from "../post/MyPosts";
import { useDispatch } from "react-redux";
import { SET_ERROR } from "../../actions/types";
const MyProfile = () => {
  const [name, setName] = useState("");
  const [handleName, setHandleName] = useState({
    value: "",
    error: false,
  });
  const [location, setLocation] = useState({
    value: "",
    error: false,
  });
  const [bio, setBio] = useState({
    value: "",
    error: false,
  });
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      if (localStorage.jwtToken) setAuthToken(localStorage.getItem("jwtToken"));
      else {
        history.push("/login");
        return;
      }
      try {
        const response = await axios.get("/api/profile/me");
        if (response?.data?.success) {
          setHandleName({
            value: response?.data?.profile?.handle,
            error: false,
          });
          setLocation({
            value: response?.data?.profile?.location,
            error: false,
          });
          setBio({ value: response?.data?.profile?.bio, error: false });
          setFollowers(response?.data?.profile?.followers);
          setFollowing(response?.data?.profile?.following);
          setName(response?.data?.name);
        } else {
          dispatch({ type: SET_ERROR, payload: response?.data?.errorMessage });
        }
      } catch (e) {}
    })();
  }, [dispatch, history]);

  const handleChangeInput = (e) => {
    let { target } = e;

    switch (target.name) {
      case HANDLE_NAME:
        setHandleName({ ...handleName, value: target.value });
        break;
      case LOCATION:
        setLocation({ ...location, value: target.value });
        break;
      case BIO:
        setBio({ ...bio, value: target.value });
        break;
      default:
      // error_modal("wrong input");
    }
  };
  const validateHandle = (handle) => {
    if (handle.indexOf(" ") >= 0) return "Handle can't have white space";
    return false;
  };
  const handleBlurInput = (e) => {
    const { target } = e;
    if (target.name === HANDLE_NAME)
      setHandleName({ ...handleName, error: validateHandle(handleName.value) });
  };
  const submitProfileForm = async (e) => {
    e.preventDefault();
    if (!validateHandle(handleName.value)) {
      const data = {
        [HANDLE_NAME]: handleName.value,
        [LOCATION]: location.value,
        [BIO]: bio.value,
      };
      try {
        const response = await axios.post("/api/profile/", data);
        if (response?.data?.success) {
          // post created
        } else {
          dispatch({ type: SET_ERROR, payload: response?.data?.errorMessage });
        }
      } catch (e) {
        dispatch({ type: SET_ERROR });
      }
    }
  };

  return (
    <div>
      <div className="profile-container">
        {name && (
          <>
            <div className="name-container">
              <div className="user-info">
                <div className="image-container">
                  {name?.charAt(0)?.toUpperCase()}
                </div>
                <h3 className="name">{name}</h3>
              </div>
            </div>
            <div className="follow-container">
              <div className="followers-container">
                <b>{followers?.length}</b> Followers
              </div>
              <div className="following-container">
                <b>{following?.length}</b> Following
              </div>
            </div>
          </>
        )}
        <div className="profile-form">
          <form onSubmit={submitProfileForm}>
            <div className="form-group">
              <label>Handle Name: </label>
              <input
                className="form-control"
                name={HANDLE_NAME}
                value={handleName.value}
                onChange={handleChangeInput}
                onBlur={handleBlurInput}
              />
              {handleName.error && (
                <small className="error-msg">{handleName.error}</small>
              )}
            </div>
            <div className="form-group">
              <label>Location: </label>
              <input
                className="form-control"
                name={LOCATION}
                value={location.value}
                onChange={handleChangeInput}
                onBlur={handleBlurInput}
              />
              {location.error && (
                <small className="error-msg">{location.error}</small>
              )}
            </div>
            <div className="form-group">
              <label>Bio: </label>
              <textarea
                className="form-control"
                name={BIO}
                value={bio.value}
                onChange={handleChangeInput}
                onBlur={handleBlurInput}
              />
              {bio.error && <small className="error-msg">{bio.error}</small>}
            </div>
            <button type="submit" className="btn btn-info">
              Save
            </button>
          </form>
        </div>
      </div>
      <div className="my-posts-container">
        <MyPosts />
      </div>
    </div>
  );
};

export default MyProfile;
