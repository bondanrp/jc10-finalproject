import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import styles from "./navbar.module.css";
import "./navbar.css";
import { connect } from "react-redux";
import swal from 'sweetalert2'
import { onLogOutUser } from "../../actions/login/login";

//TODO Web Template Studio: Add a new link in the NavBar for your page here.
// A skip link is included as an accessibility best practice. For more information visit https://www.w3.org/WAI/WCAG21/Techniques/general/G1.
class NavBar extends Component {
logOut = () => {
  console.log('halo');
    this.props.onLogOutUser();
    swal.fire("Success!", "User successfuly logged out", "success");
    this.props.history.push("/");
  };
  render() {
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
            <div className="navbar-nav">
              <Link className="tautan nav-item nav-link active" to="Home">
                Home
              </Link>
              <Link className="tautan nav-item nav-link active" to="Products">
                Products
              </Link>
              <Link className="tautan nav-item nav-link active" to="Register">
                Register
              </Link>
              <Link className="tautan nav-item nav-link active" to="Login">
                Login
              </Link>
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
            <Link className="judul navbar-brand" to="/">
              Logo Perusahaan
            </Link>
            <div className="navbar-nav">
              <Link className="tautan nav-item nav-link active" to="Home">
                Home
              </Link>
              <Link className="tautan nav-item nav-link active" to="Products">
                Products
              </Link>
              <Link className="tautan nav-item nav-link active" to="Profile">
                Profile
              </Link>
              <span
                onClick={this.logOut}
                className="tautan nav-item nav-link active"
              >
                Logout
              </span>
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
