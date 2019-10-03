import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect, Link } from "react-router-dom";
import { onLoginUser } from "../../actions/login/login";
import "./login.css";

class Login extends Component {
  state = {
    username: "",
    password: ""
  };
  validateForm() {
    return this.state.username.length > 0 && this.state.password.length > 0;
  }
  handleChange = event => {
    this.setState({ [event.target.id]: event.target.value });
  };

  onLoginClick = () => {
    if (this.validateForm()) {
      let username = this.state.username;
      let password = this.state.password;
      this.props.onLoginUser(username, password);
    }
  };

  handleSubmit = event => {
    event.preventDefault();
  };
  render() {
    if (!this.props.user_name) {
      return (
        <div>
          <div className="login-bg ">
            <div className="mx-auto shadow login-card">
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
                  <div className="login-input-title card-title mt-2">
                    Username
                  </div>
                  <input
                    className="login-input"
                    id="username"
                    value={this.state.username}
                    onChange={this.handleChange}
                    type="text"
                    placeholder="username"
                    autoFocus
                    required
                  />
                  <div className="login-input-title card-title mt-2">
                    Password
                  </div>
                  <input
                    className="login-input"
                    id="password"
                    value={this.state.password}
                    onChange={this.handleChange}
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
                      login
                    </button>
                  </div>
                  <p className="login-text">
                    Don't have an account? <Link to="register">Sign Up</Link>!
                  </p>
                </form>
              </div>
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
    user_name: state.auth.username
  };
};

export default connect(
  mapStateToProps,
  { onLoginUser }
)(Login);
