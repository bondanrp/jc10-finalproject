import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import styles from "./navbar.module.css";
import "./navbar.css";
import { connect } from "react-redux";
import swal from "sweetalert2";
import { onLogOutUser } from "../../actions/login/login";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";

class NavBar extends Component {
  state = { toggleBurger: false, dropdownOpen: false };

  toggleDropdown = () => {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }));
  };
  logOut = () => {
    this.props.onLogOutUser();
    swal.fire("Success!", "User successfuly logged out", "success");
    this.props.history.push("/");
  };

  burgerToggle = () => {
    this.setState({ toggleBurger: !this.state.toggleBurger });
  };

  render() {
    const hilang = this.state.toggleBurger ? "hilang hilang-active" : "hilang";
    const anim = this.state.toggleBurger ? "burger change" : "burger";

    if (!this.props.role) {
      return (
        <React.Fragment>
          <div className={styles.skipLink}>
            <a href="#mainContent">Skip to Main Content</a>
          </div>
          <div className="navbar">
            <div>
              <Link className="judul" to="/">
                Logo Perusahaan
              </Link>
            </div>
            <div className={hilang}>
              <Link
                className="tautan active"
                onClick={() => this.setState({ toggleBurger: false })}
                to="Home"
              >
                Home
              </Link>
              <Link
                className="tautan active"
                onClick={() => this.setState({ toggleBurger: false })}
                to="About"
              >
                About
              </Link>
              <Link
                className="tautan active"
                onClick={() => this.setState({ toggleBurger: false })}
                to="Contact"
              >
                Contact
              </Link>
              <Link
                className="tautan active"
                onClick={() => this.setState({ toggleBurger: false })}
                to="Login"
              >
                <div className="userIcon"></div>
              </Link>
            </div>
            <div className={anim} onClick={this.burgerToggle}>
              <div className="bar1"></div>
              <div className="bar2"></div>
              <div className="bar3"></div>
            </div>
          </div>
        </React.Fragment>
      );
    } else if (this.props.role === "user") {
      return (
        <React.Fragment>
          <div className={styles.skipLink}>
            <a href="#mainContent">Skip to Main Content</a>
          </div>
          <div className="navbar">
            <Link
              className="judul"
              onClick={() => this.setState({ toggleBurger: false })}
              to="/"
            >
              Logo Perusahaan
            </Link>
            <div className={hilang}>
              <Link
                className="tautan active"
                onClick={() => this.setState({ toggleBurger: false })}
                to="Home"
              >
                Home
              </Link>
              <Link
                className="tautan active"
                onClick={() => this.setState({ toggleBurger: false })}
                to="About"
              >
                About
              </Link>
              <Link
                className="tautan active"
                onClick={() => this.setState({ toggleBurger: false })}
                to="Contact"
              >
                Contact
              </Link>
              <Dropdown
                isOpen={this.state.dropdownOpen}
                toggle={this.toggleDropdown}
              >
                <DropdownToggle
                  tag="span"
                  data-toggle="dropdown"
                  aria-expanded={this.state.dropdownOpen}
                >
                  <div className="userIcon tautan"></div>
                </DropdownToggle>
                <DropdownMenu right className="text-right">
                  <DropdownItem header className="text-capitalize">
                    Hello, {this.props.username}!
                  </DropdownItem>
                  <Link
                    to="/profile"
                    className="text-decoration-none text-dark"
                  >
                    <DropdownItem tag="div">Profile</DropdownItem>
                  </Link>
                  <Link to="#" className="text-decoration-none text-dark">
                    <DropdownItem tag="div">Manage Subscription</DropdownItem>
                  </Link>
                  <DropdownItem divider />
                  <DropdownItem onClick={this.logOut}>Logout</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
            <div className={anim} onClick={this.burgerToggle}>
              <div className="bar1"></div>
              <div className="bar2"></div>
              <div className="bar3"></div>
            </div>
          </div>
        </React.Fragment>
      );
    } else if (this.props.role === "user") {
      return (
        <React.Fragment>
          <div className={styles.skipLink}>
            <a href="#mainContent">Skip to Main Content</a>
          </div>
          <div className="begron"></div>
          <div className="navbar">
            <Link
              className="judul"
              onClick={() => this.setState({ toggleBurger: false })}
              to="/"
            >
              Logo Perusahaan
            </Link>
            <div className={hilang}>
              <Link
                className="tautan active"
                onClick={() => this.setState({ toggleBurger: false })}
                to="Home"
              >
                Home
              </Link>
              <Link
                className="tautan active"
                onClick={() => this.setState({ toggleBurger: false })}
                to="About"
              >
                About
              </Link>
              <Link
                className="tautan active"
                onClick={() => this.setState({ toggleBurger: false })}
                to="Contact"
              >
                Contact
              </Link>
              <Dropdown
                isOpen={this.state.dropdownOpen}
                toggle={this.toggleDropdown}
              >
                <DropdownToggle
                  tag="span"
                  data-toggle="dropdown"
                  aria-expanded={this.state.dropdownOpen}
                >
                  <div className="userIcon tautan"></div>
                </DropdownToggle>
                <DropdownMenu right className="text-right">
                  <DropdownItem header className="text-capitalize">
                    Hello, {this.props.username}!
                  </DropdownItem>
                  <Link
                    to="/profile"
                    className="text-decoration-none text-dark"
                  >
                    <DropdownItem tag="div">Profile</DropdownItem>
                  </Link>
                  <Link to="#" className="text-decoration-none text-dark">
                    <DropdownItem tag="div">Manage Subscription</DropdownItem>
                  </Link>
                  <DropdownItem divider />
                  <DropdownItem onClick={this.logOut}>Logout</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
            <div className={anim} onClick={this.burgerToggle}>
              <div className="bar1"></div>
              <div className="bar2"></div>
              <div className="bar3"></div>
            </div>
          </div>
        </React.Fragment>
      );
    } else if (this.props.role === "teacher") {
      return (
        <React.Fragment>
          <div className={styles.skipLink}>
            <a href="#mainContent">Skip to Main Content</a>
          </div>
          <div className="begron"></div>
          <div className="navbar">
            <Link
              className="judul"
              onClick={() => this.setState({ toggleBurger: false })}
              to="/"
            >
              Logo Perusahaan
            </Link>
            <div className={hilang}>
              <Link
                className="tautan active"
                onClick={() => this.setState({ toggleBurger: false })}
                to="Home"
              >
                Home
              </Link>
              <Link
                className="tautan active"
                onClick={() => this.setState({ toggleBurger: false })}
                to="About"
              >
                About
              </Link>
              <Link
                className="tautan active"
                onClick={() => this.setState({ toggleBurger: false })}
                to="Contact"
              >
                Contact
              </Link>
              <Dropdown
                isOpen={this.state.dropdownOpen}
                toggle={this.toggleDropdown}
              >
                <DropdownToggle
                  tag="span"
                  data-toggle="dropdown"
                  aria-expanded={this.state.dropdownOpen}
                >
                  <div className="userIcon tautan"></div>
                </DropdownToggle>
                <DropdownMenu right className="text-right">
                  <DropdownItem header className="text-capitalize">
                    Hello, {this.props.username}!
                  </DropdownItem>
                  <Link
                    to="/profile"
                    className="text-decoration-none text-dark"
                  >
                    <DropdownItem tag="div">Profile</DropdownItem>
                  </Link>
                  <Link to="/upload" className="text-decoration-none text-dark">
                    <DropdownItem tag="div">Manage Uploads</DropdownItem>
                  </Link>
                  <DropdownItem divider />
                  <DropdownItem onClick={this.logOut}>Logout</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
            <div className={anim} onClick={this.burgerToggle}>
              <div className="bar1"></div>
              <div className="bar2"></div>
              <div className="bar3"></div>
            </div>
          </div>
        </React.Fragment>
      );
    }
  }
}
const mapStateToProps = state => {
  return {
    username: state.auth.username,
    role: state.auth.role
  };
};
export default withRouter(
  connect(
    mapStateToProps,
    { onLogOutUser }
  )(NavBar)
);
