﻿import React, { Component } from "react";
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
import { timeSince } from "../../functions/index";

const urlApi = "http://localhost:3001/";

class NavBar extends Component {
  state = {
    toggleBurger: false,
    dropdownOpen: false,
    notificationOpen: false,
    notifications: [],
    premiumToggle: true,
    newNotif: 0
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

  getNotificationData = () => {
    Axios.get(urlApi + `getnotifications/${this.props.id}`).then(res => {
      if (res.data.length > 0) {
        this.setState({ notifications: res.data });
        for (let i = 0; i < res.data.length; i++) {
          if (!res.data[i].seen) {
            this.setState({ newNotif: "!" });
          }
        }
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
        var date = timeSince(val.timestamp);
        return (
          <div>
            <Link to={`/${val.link}`} className="notification-content">
              <p>{val.content}</p>
            </Link>
            <div className="notification-time">{date}</div>
            <button
              className="notification-delete"
              onClick={() => {
                Axios.delete(urlApi + "deletenotification/" + val.id).then(
                  res => {
                    this.getNotificationData();
                  }
                );
              }}
            >
              x
            </button>
          </div>
        );
      });
      return render;
    } else {
      return <div className="text-center">loading notifications</div>;
    }
  };
  clearNotif = () => {
    Axios.patch(urlApi + "clearseen", { id: this.props.id }).then(res => {
      this.setState({ newNotif: 0 });
    });
  };

  renderNotification = () => {
    return (
      <Dropdown
        isOpen={this.state.notificationOpen}
        toggle={this.toggleNotification}
        className="nav3-2"
        onClick={() => {
          this.getNotificationData();
          this.clearNotif();
        }}
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
        <div className={this.state.newNotif ? "new-notification" : "d-none"}>
          {this.state.newNotif}
        </div>
      </Dropdown>
    );
  };
  dropDown = () => {
    if (this.props.username) {
      return (
        <Dropdown
          isOpen={this.state.dropdownOpen}
          toggle={this.toggleDropdown}
          className="nav3-3"
        >
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
              to={`/browse/user/${this.props.username}`}
              className="text-decoration-none text-dark"
            >
              <DropdownItem tag="div">Profile</DropdownItem>
            </Link>
            {this.props.premium ? null : (
              <Link to={`/premium`} className="text-decoration-none text-dark">
                <DropdownItem tag="div">Get Premium</DropdownItem>
              </Link>
            )}
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
          to="/Login"
        >
          <div className="nav3-3">
            <img
              src={userIcon}
              style={{
                width: "32px",
                height: "32px",
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
        <div
          className="navBar"
          onClick={() => {
            if (this.props.username) {
              this.getNotificationData();
            }
            this.setState({ premiumToggle: true });
          }}
        >
          <div className=" nav1">
            <Link className="judul" to="/">
              Bagi Bakat
            </Link>
          </div>
          <div className={hilang}>
            <Link
              className="tautan active"
              onClick={() => {
                this.setState({ toggleBurger: false });
              }}
              exact
              to={{ pathname: "/browse", state: "percobaan" }}
            >
              Browse
            </Link>
            {!this.props.username || this.props.role === "user" ? (
              <Link
                className="tautan active"
                onClick={() => this.setState({ toggleBurger: false })}
                to="/becomeateacher"
              >
                Become a Teacher
              </Link>
            ) : this.props.role === "admin" ? (
              <Link
                className="tautan active"
                onClick={() => this.setState({ toggleBurger: false })}
                to="/admindashboard"
              >
                Admin Dashboard
              </Link>
            ) : (
              <Link
                className="tautan active"
                onClick={() => this.setState({ toggleBurger: false })}
                to="/manageuploads"
              >
                Manage Uploads
              </Link>
            )}
            <Link
              className="tautan active"
              onClick={() => this.setState({ toggleBurger: false })}
              to="/Contact"
            >
              Contact
            </Link>
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
        {this.props.premium ? null : (
          <React.Fragment>
            <div
              className={this.state.premiumToggle ? "nav-premium" : "d-none"}
            >
              {this.props.username ? (
                "Upgrade to "
              ) : (
                <>
                  <Link to="/login" className="text-white">
                    Sign In
                  </Link>{" "}
                  and get{" "}
                </>
              )}
              <Link to="/premium" className="text-white">
                premium
              </Link>{" "}
              and get full access to unlimited classes!
            </div>
            <button
              onClick={() => this.setState({ premiumToggle: false })}
              className={
                this.state.premiumToggle ? "nav-premium-button" : "d-none"
              }
            >
              X
            </button>
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    username: state.auth.username,
    role: state.auth.role,
    profilepict: state.auth.profilepict,
    id: state.auth.id,
    premium: state.auth.premium
  };
};
export default withRouter(connect(mapStateToProps, { onLogOutUser })(NavBar));
