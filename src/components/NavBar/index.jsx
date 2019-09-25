import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import styles from "./navbar.module.css";
import "./navbar.css";
import { connect } from "react-redux";
import swal from "sweetalert2";
import { onLogOutUser } from "../../actions/login/login";
import userIcon from "../../images/user.png";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";

class NavBar extends Component {
  state = { toggleBurger: false, dropdownOpen: false };

  dropDown = () => {
    if (this.props.role === "user") {
      return (
        <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggleDropdown}>
          <DropdownToggle
            tag="span"
            data-toggle="dropdown"
            aria-expanded={this.state.dropdownOpen}
          >
            <div className="userIcon">
              <img
                src={userIcon}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  overflow: "hidden",
                  borderRadius: "50%"
                }}
                alt=""
              />
            </div>
          </DropdownToggle>
          <DropdownMenu right className="text-right">
            <DropdownItem header className="text-capitalize">
              Hello, {this.props.username}!
            </DropdownItem>
            <Link
              to={`/${this.props.username}`}
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
      );
    } else if (this.props.role === "teacher") {
      return (
        <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggleDropdown}>
          <DropdownToggle
            tag="span"
            data-toggle="dropdown"
            aria-expanded={this.state.dropdownOpen}
          >
            <div className="userIcon">
              <img
                src={userIcon}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  overflow: "hidden",
                  borderRadius: "50%"
                }}
                alt=""
              />
            </div>
          </DropdownToggle>
          <DropdownMenu right className="text-right">
            <DropdownItem header className="text-capitalize">
              Hello, {this.props.username}!
            </DropdownItem>
            <Link
              to={`/${this.props.username}`}
              className="text-decoration-none text-dark"
            >
              <DropdownItem tag="div">Profile</DropdownItem>
            </Link>
            <Link
              to={`/${this.props.username}/manageuploads`}
              className="text-decoration-none text-dark"
            >
              <DropdownItem tag="div">Manage Uploads</DropdownItem>
            </Link>
            <DropdownItem divider />
            <DropdownItem onClick={this.logOut}>Logout</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      );
    } else if (this.props.role === "admin") {
      return (
        <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggleDropdown}>
          <DropdownToggle
            tag="span"
            data-toggle="dropdown"
            aria-expanded={this.state.dropdownOpen}
          >
            <div className="userIcon">
              <img
                src={userIcon}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  overflow: "hidden",
                  borderRadius: "50%"
                }}
                alt=""
              />
            </div>
          </DropdownToggle>
          <DropdownMenu right className="text-right">
            <DropdownItem header className="text-capitalize">
              Hello, {this.props.username}!
            </DropdownItem>
            <Link
              to={`/${this.props.username}`}
              className="text-decoration-none text-dark"
            >
              <DropdownItem tag="div">Profile</DropdownItem>
            </Link>
            <Link to="#" className="text-decoration-none text-dark">
              <DropdownItem tag="div">Admin Dashboard</DropdownItem>
            </Link>
            <DropdownItem divider />
            <DropdownItem onClick={this.logOut}>Logout</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      );
    } else {
      return (
        <Link
          className="active"
          onClick={() => this.setState({ toggleBurger: false })}
          to="Login"
        >
          <div className="userIcon">
            <img
              src={userIcon}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                overflow: "hidden",
                borderRadius: "50%"
              }}
              alt=""
            />
          </div>
        </Link>
      );
    }
  };

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
    const hilang = this.state.toggleBurger
      ? "hilang hilang-active"
      : "hilang nav2";
    const anim = this.state.toggleBurger ? "burger change" : "burger";
    return (
      <React.Fragment>
        <div className={styles.skipLink}>
          <a href="#mainContent">Skip to Main Content</a>
        </div>
        <div className="navBar">
          <div className=" nav1">
            <Link className="judul" to="/">
              Kursus Lah
            </Link>
          </div>
          <div className={hilang}>
            <Link
              className="tautan active"
              onClick={() => this.setState({ toggleBurger: false })}
              to="/"
            >
              Home
            </Link>
            <Link
              className="tautan active"
              onClick={() => this.setState({ toggleBurger: false })}
              to="/browse"
            >
              Browse
            </Link>
            <Link
              className="tautan active"
              onClick={() => this.setState({ toggleBurger: false })}
              to="/Contact"
            >
              Contact
            </Link>
          </div>
          <div className="nav3">
            {this.dropDown()}
            <div className={anim} onClick={this.burgerToggle}>
              <div className="bar1"></div>
              <div className="bar2"></div>
              <div className="bar3"></div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    username: state.auth.username,
    role: state.auth.role,
    profilepict: state.auth.profilepict
  };
};
export default withRouter(
  connect(
    mapStateToProps,
    { onLogOutUser }
  )(NavBar)
);
