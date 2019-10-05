import React, { Component } from "react";
import { Link } from "react-router-dom";

export class LoginModal extends Component {
  onLoginClick = () => {
    if (this.validateForm()) {
      let username = this.props.username;
      let password = this.props.password;
      this.props.onLoginUser(username, password);
      this.props.history.push("/");
    }
  };
  handleSubmit = event => {
    event.preventDefault();
  };
  validateForm() {
    return this.props.username.length > 0 && this.props.password.length > 0;
  }
  render() {
    return (
      <div className="loginModal-bg">
        <div className="loginModal-container">
          <div className="loginModal-close" onClick={this.props.loginModal}>
            close
          </div>
          <div className="login-image text-center">
            <img
              className="user-icon"
              src="http://icons.iconarchive.com/icons/custom-icon-design/silky-line-user/128/user-icon.png"
              alt="user"
            />
          </div>
          <h3 className="login-title text-center mt-5">ACCOUNT LOGIN</h3>
          <div>
            <form className="form-group" onSubmit={this.handleSubmit}>
              <div className="login-input-title card-title mt-2">Username</div>
              <input
                className="login-input"
                id="username"
                value={this.props.username}
                onChange={this.props.handleChange}
                type="text"
                placeholder="username"
                autoFocus
                required
              />
              <div className="login-input-title card-title mt-2">Password</div>
              <input
                className="login-input"
                id="password"
                value={this.props.password}
                onChange={this.props.handleChange}
                placeholder="********"
                type="password"
                required
              />
              <br />
              <div className="text-center">
                <button
                  className="login-btn mb-5"
                  type="submit"
                  onClick={this.onLoginClick}
                >
                  Login
                </button>
              </div>
              <p className="login-text">
                Don't have an account? <Link to="register">Sign Up</Link>!
              </p>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default LoginModal;
