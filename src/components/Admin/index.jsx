import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import "./admin.css";
import Users from "./components/Users";
import Videos from "./components/Videos";
import Payments from "./components/Payments";
import Applications from "./components/Applications";

export class Admin extends Component {
  state = {
    loading: true,
    nav: "users"
  };
  componentDidMount() {
    this.setState({ loading: false });
  }
  render() {
    if (this.state.loading) {
      return <div className="gray-background">loading</div>;
    } else if (this.props.role === "admin") {
      return (
        <div className="gray-background">
          <div className="admin-container">
            <div className="admin-nav">
              <label>Admin Dahsboard</label>
              <input
                type="radio"
                name="nav-admin"
                id="item1"
                defaultChecked
                onChange={_ => {
                  this.setState({ nav: "users" });
                }}
              />
              <label htmlFor="item1">Users</label>
              <input
                type="radio"
                name="nav-admin"
                id="item2"
                onChange={_ => {
                  this.setState({ nav: "videos" });
                }}
              />
              <label htmlFor="item2">Videos</label>
              <input
                type="radio"
                name="nav-admin"
                id="item3"
                onChange={_ => {
                  this.setState({ nav: "payments" });
                }}
              />
              <label htmlFor="item3">Payments</label>
              <input
                type="radio"
                name="nav-admin"
                id="item4"
                onChange={_ => {
                  this.setState({ nav: "applications" });
                }}
              />
              <label htmlFor="item4">Teacher Applications</label>
            </div>
            <div>
              {this.state.nav === "users" ? (
                <Users />
              ) : this.state.nav === "payments" ? (
                <Payments />
              ) : this.state.nav === "videos" ? (
                <Videos />
              ) : (
                <Applications />
              )}
            </div>
          </div>
        </div>
      );
    } else {
      return <Redirect to="/" />;
    }
  }
}

const mapStateToProps = state => {
  return {
    role: state.auth.role
  };
};
export default connect(
  mapStateToProps,
  null
)(Admin);
