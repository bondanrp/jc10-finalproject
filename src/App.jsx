import React, { Component } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import "./App.css";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import { connect } from "react-redux";

import Home from "./components/Home";
import About from "./components/About";
import Browse from "./components/Browse/browse";
import Contact from "./components/Contact";
import Register from "./components/Register";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Upload from "./components/Upload/index";
import Video from "./components/Video/video";

const keepLogin = objUser => {
  return {
    type: "LOGIN_SUCCESS",
    payload: {
      id: objUser.id,
      username: objUser.username,
      role: objUser.role,
      profilepict: objUser.profilepict
    }
  };
};

class App extends Component {
  state = {
    check: false
  };

  componentDidMount() {
    let userStorage = JSON.parse(localStorage.getItem("userData"));
    if (userStorage) {
      this.props.keepLogin(userStorage);
    }

    this.setState({ check: true });
  }
  render() {
    return (
      <React.Fragment>
        <NavBar />
        <Switch>
          <Redirect exact path="/" to="/Home" />
          <Route path="/Home" component={Home} />
          <Route path="/About" component={About} />
          <Route path="/Browse" component={Browse} />
          <Route path="/Contact" component={Contact} />
          <Route path="/Register" component={Register} />
          <Route path="/Login" component={Login} />
          <Route exact path="/:username" component={Profile} />
          <Route path="/:username/manageuploads" component={Upload} />
          <Route path="/:username/:title/:id" component={Video} />
        </Switch>
        <Footer />
      </React.Fragment>
    );
  }
}

export default connect(
  null,
  { keepLogin }
)(App);
