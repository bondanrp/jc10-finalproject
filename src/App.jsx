import React, { Component } from "react";
import { withRouter, Route, Switch, Redirect } from "react-router-dom";
import "./App.css";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import { connect } from "react-redux";

import Home from "./components/Home";
import About from "./components/About";
import Browse from "./components/Browse/browse";
import Contact from "./components/Contact";
import BecomeATeacher from "./components/BecomeATeacher";
import RegisterTeacher from "./components/BecomeATeacher/RegisterTeacher/index";
import Register from "./components/Register";
import Premium from "./components/Premium";
import Payment from "./components/Premium/Payment";
import Login from "./components/Login";
import Upload from "./components/Upload/index";

const keepLogin = objUser => {
  return {
    type: "LOGIN_SUCCESS",
    payload: {
      id: objUser.id,
      username: objUser.username,
      role: objUser.role,
      profilepict: objUser.profilepict,
      premium: objUser.premium
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
          <Route exact path="/" render={() => <Redirect to="/Home" />} />
          <Route path="/Home" component={Home} />
          <Route path="/About" component={About} />
          <Route exact path="/Browse" component={Browse} />
          <Route exact path="/Browse/user/:username" component={Browse} />
          <Route
            exact
            path="/Browse/user/:username/video/:class/:episode"
            component={Browse}
          />
          <Route path="/Contact" component={Contact} />
          <Route exact path="/BecomeATeacher" component={BecomeATeacher} />
          <Route exact path="/BecomeATeacher/register" component={RegisterTeacher} />
          <Route path="/Register" component={Register} />
          <Route exact path="/Premium" component={Premium} />
          <Route exact path="/Premium/payment" component={Payment} />
          <Route path="/Login" component={Login} />
          <Route path="/manageuploads" component={Upload} />
        </Switch>
        <Footer />
      </React.Fragment>
    );
  }
}

export default withRouter(
  connect(
    null,
    { keepLogin }
  )(App)
);
