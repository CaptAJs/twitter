import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../../actions/index";
import "./header.css";
const Header = () => {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  useEffect(() => {}, [auth]);
  const logoutUser = () => {
    dispatch(logout());
  };
  return (
    <div id="header">
      <div className="header-container">
        <div className="website-name">
          <h2>
            <Link to="/">Twitter</Link>
          </h2>
        </div>
        <div className="nav-btn">
          {auth.isAuthenticated ? (
            <div>
              <Link onClick={logoutUser} className="btn" to="/">
                Logout
              </Link>
              <Link className="btn post-btn" to="/create_post">
                Add Post
              </Link>
              <Link className="btn" to="/profile">
                My Profile
              </Link>
            </div>
          ) : (
            <React.Fragment>
              <button className="btn">
                <Link to="/login">Login</Link>
              </button>
              <button className="btn">
                <Link to="/register">Register</Link>
              </button>
            </React.Fragment>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
