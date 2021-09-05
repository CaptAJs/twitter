import React, { useEffect } from "react";
import RegistrationForm from "../register/RegistrationForm";
import LoginForm from "../login/LoginForm";
import Feed from "../feed/Feed";
import { Route, useHistory, Switch, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../actions/index";
import Post from "../post/Post";
import Followers from "../followers/Followers";
import Following from "../following/Following";
import CreatePost from "../post/CreatePost";
import ProfilePostContainer from "../profile/ProfilePostContainer";
import My404Component from "../common/My404Component";
import PrivateRoute from "./PrivateRoute";
const Routes = () => {
  const Logout = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    useEffect(() => {
      dispatch(logout());
      history.push("/");
    });
    return <div></div>;
  };
  return (
    <div className="container">
      <Switch>
        <PrivateRoute path="/" exact component={Feed} />
        <Route path="/register" exact component={RegistrationForm} />
        <Route path="/login" exact component={LoginForm} />
        <Route path="/logout" exact component={Logout} />
        <Route path="/profile" exact component={ProfilePostContainer} />
        <PrivateRoute
          path="/profile/:userId"
          exact
          component={ProfilePostContainer}
        />
        <Route path="/post" exact component={Post} />
        <PrivateRoute path="/create_post" exact component={CreatePost} />
        <Route path="/followers" exact component={Followers} />
        <Route path="/following" exact component={Following} />
        <Route path="*" exact={true} component={My404Component} />
      </Switch>
      <Link className="btn post-button" to="/create_post">
        +
      </Link>
    </div>
  );
};

export default Routes;
