import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
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
import Axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";

const urlApi = "http://localhost:3001/";

class NavBar extends Component {
  state = {
    toggleBurger: false,
    dropdownOpen: false,
    notificationOpen: false,
    notifications: []
  };
  toggleDropdown = () => {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }));
  };
  toggleNotification = () => {
    this.setState(prevState => ({
      notificationOpen: !prevState.notificationOpen
    }));
  };
  timeSince(date) {
    var seconds = Math.floor((new Date() - date) / 1000);
    var interval = Math.floor(seconds / 31536000);
    if (interval >= 1) {
      return interval + " years ago";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) {
      return interval + " months ago";
    }
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) {
      return interval + " days ago";
    }
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) {
      return interval + " hours ago";
    }
    interval = Math.floor(seconds / 60);
    if (interval >= 1) {
      return interval + " minutes ago";
    } else {
      return "just now";
    }
  }
  getNotificationData = () => {
    Axios.get(urlApi + `getnotifications/${this.props.id}`).then(res => {
      if (res.data.length > 0) {
        this.setState({ notifications: res.data });
      } else {
        this.setState({ notifications: "no notification" });
      }
    });
  };
  mapNotification = () => {
    if (this.state.notifications === "no notification") {
      return <div className="text-center">No notifications to show</div>;
    } else if (this.state.notifications.length > 0) {
      let render = this.state.notifications.map(val => {
        var t = val.timestamp.split(/[- T Z :]/);
        var d = new Date(Date.UTC(t[0], t[1] - 1, t[2], t[3], t[4], t[5]));
        var date = this.timeSince(d);
        return (
          <Link to={`/${val.link}`} className="notification-content">
            <div>
              {val.content}
              <div className="notification-time">{date}</div>
            </div>
          </Link>
        );
      });
      return render;
    } else {
      return <div className="text-center">loading notifications</div>;
    }
  };
  renderNotification = () => {
    return (
      <Dropdown
        isOpen={this.state.notificationOpen}
        toggle={this.toggleNotification}
        className="mr-2"
        onClick={this.getNotificationData}
      >
        <DropdownToggle
          tag="span"
          data-toggle="dropdown"
          aria-expanded={this.state.notificationOpen}
        >
          <div className="userIcon">
            <FontAwesomeIcon icon={faBell} className="notificationIcon" />
          </div>
        </DropdownToggle>
        <DropdownMenu right className="notifications">
          {this.mapNotification()}
        </DropdownMenu>
      </Dropdown>
    );
  };
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
              to={`/user/${this.props.username}`}
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
                src={this.props.profilepict}
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
              to={`/user/${this.props.username}`}
              className="text-decoration-none text-dark"
            >
              <DropdownItem tag="div">Profile</DropdownItem>
            </Link>
            <Link
              to={`/user/${this.props.username}/manageuploads`}
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
              to={`/user/${this.props.username}`}
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
        <div className="navBar">
          <div className=" nav1">
            <Link className="judul" to="/">
              Bagi Bakat
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
            {!this.props.username || this.props.role === "user" ? (
              <Link
                className="tautan active"
                onClick={() => this.setState({ toggleBurger: false })}
                to="/becomeateacher
                "
              >
                Become a Teacher
              </Link>
            ) : null}
          </div>
          <div className="nav3">
            {this.props.username ? this.renderNotification() : null}
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
    profilepict: state.auth.profilepict,
    id: state.auth.id
  };
};
export default withRouter(
  connect(
    mapStateToProps,
    { onLogOutUser }
  )(NavBar)
);
