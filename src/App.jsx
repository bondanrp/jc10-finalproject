import React, { Component } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import "./App.css";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import { connect } from "react-redux";

import Home from "./components/Home";
import About from "./components/About";
import Contact from "./components/Contact";
import Register from "./components/Register";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Todo from "./components/Todo/Todo";
import Upload from "./components/Upload/index";
import Video from "./components/Video/video";

const keepLogin = objUser => {
  return {
    type: "LOGIN_SUCCESS",
    payload: {
      id: objUser.id,
      username: objUser.username,
      role: objUser.role
    }
  };
};

class App extends Component {
  state = {
    check: false
  };

  componentDidMount() {
    // check local storage
    let userStorage = JSON.parse(localStorage.getItem("userData"));

    if (userStorage) {
      // kirim ke redux
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
          <Route path="/Contact" component={Contact} />
          <Route path="/Register" component={Register} />
          <Route path="/Login" component={Login} />
          <Route path="/Profile/:username" component={Profile} />
          <Route path="/Todo" component={Todo} />
          <Route path="/Upload" component={Upload} />
          <Route path="/Video/:id" component={Video} />
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
