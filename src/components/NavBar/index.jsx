import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import styles from "./navbar.module.css";
import "./navbar.css";
import { connect } from "react-redux";
import swal from "sweetalert2";
import { onLogOutUser } from "../../actions/login/login";

class NavBar extends Component {
  state = { toggleBurger: false };

  logOut = () => {
    console.log("halo");
    this.props.onLogOutUser();
    swal.fire("Success!", "User successfuly logged out", "success");
    this.props.history.push("/");
  };

  burgerToggle = () => {
    console.log("hai");
    this.setState({ toggleBurger: !this.state.toggleBurger });
  };

  render() {
    const burger = this.state.toggleBurger ? "hilang hilang-active" : "hilang";
    const anim = this.state.toggleBurger ? "burger change" : "burger";

    if (!this.props.username) {
      return (
        <React.Fragment>
          <div className={styles.skipLink}>
            <a href="#mainContent">Skip to Main Content</a>
          </div>
          <nav className="navbar navbar-expand-sm navbar-light border-bottom justify-content-between shadow">
            <Link className="judul navbar-brand" to="/">
              Logo Perusahaan
            </Link>

            <div className={burger}>
              <Link
                className="tautan active"
                onClick={this.burgerToggle}
                to="Home"
              >
                Home
              </Link>
              <Link
                className="tautan active"
                onClick={this.burgerToggle}
                to="Products"
              >
                Products
              </Link>
              <Link
                className="tautan active"
                onClick={this.burgerToggle}
                to="Register"
              >
                Register
              </Link>
              <Link
                className="tautan active"
                onClick={this.burgerToggle}
                to="Login"
              >
                Login
              </Link>
            </div>
            <div className={anim} onClick={this.burgerToggle}>
              <div className="bar1"></div>
              <div className="bar2"></div>
              <div className="bar3"></div>
            </div>
          </nav>
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          <div className={styles.skipLink}>
            <a href="#mainContent">Skip to Main Content</a>
          </div>
          <nav className="navbar navbar-expand-sm navbar-light border-bottom justify-content-between shadow">
            <Link
              className="judul navbar-brand"
              onClick={this.burgerToggle}
              to="/"
            >
              Logo Perusahaan
            </Link>
            <div className={burger}>
              <Link
                className="tautan active"
                onClick={this.burgerToggle}
                to="Home"
              >
                Home
              </Link>
              <Link
                className="tautan active"
                onClick={this.burgerToggle}
                to="Products"
              >
                Products
              </Link>
              <Link
                className="tautan active"
                onClick={this.burgerToggle}
                to="Profile"
              >
                Profile
              </Link>
              <span onClick={this.logOut} className="tautan active">
                Logout
              </span>
            </div>
            <div className={anim} onClick={this.burgerToggle}>
              <div className="bar1"></div>
              <div className="bar2"></div>
              <div className="bar3"></div>
            </div>
          </nav>
        </React.Fragment>
      );
    }
  }
}
const mapStateToProps = state => {
  return {
    username: state.auth.username
  };
};
export default withRouter(
  connect(
    mapStateToProps,
    { onLogOutUser }
  )(NavBar)
);
