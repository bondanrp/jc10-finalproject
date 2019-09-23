import React, { Component } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import "./App.css";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";

import Home from "./components/Home";
import About from "./components/About";
import Contact from "./components/Contact";
import Register from "./components/Register";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Todo from "./components/Todo/Todo";
import Upload from "./components/Upload/index";
import Video from "./components/Video/video";

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <NavBar />
        <Switch>
          <Redirect exact path="/" to="/Home" />
          <Route exact path="/Home" component={Home} />
          <Route path="/About" component={About} />
          <Route path="/Contact" component={Contact} />
          <Route path="/Register" component={Register} />
          <Route path="/Login" component={Login} />
          <Route path="/Profile" component={Profile} />
          <Route path="/Todo" component={Todo} />
          <Route path="/Upload" component={Upload} />
          <Route path="/Video/:id" component={Video} />
        </Switch>
        <Footer />
      </React.Fragment>
    );
  }
}

export default App;
