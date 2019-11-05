import React, { Component } from "react";
import axios from "axios";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import swal from "sweetalert2";
import "./register.css";
import { encrypt } from "../../functions/index";

const urlApiUser = "http://localhost:3001/";

class Register extends Component {
  state = {
    modal: false,
    username: "",
    email: "",
    password: "",
    repeatpassword: "",
    firstname: "",
    lastname: "",
    terms: false,
    matchPass: false
  };
  validateForm() {
    if (this.state.password !== this.state.repeatpassword) {
      this.setState({ matchPass: true });
    }
    return (
      this.state.username.length > 0 &&
      this.state.email.length > 0 &&
      this.state.password.length > 0 &&
      this.state.firstname.length > 0 &&
      this.state.lastname.length > 0 &&
      this.state.password === this.state.repeatpassword
    );
  }

  toggle = () => {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  };
  handleChange = event => {
    this.setState({ [event.target.id]: event.target.value });
  };
  handleSubmit = event => {
    event.preventDefault();
  };
  onRegisterClick = () => {
    let { username, email, lastname, firstname } = this.state;
    let password = encrypt(this.state.password);
    let input = {
      username: username,
      email: email,
      password: password,
      firstname: firstname,
      lastname: lastname
    };
    if (this.validateForm()) {
      axios
        .post(urlApiUser + "registeruser", input)
        .then(res => {
          if (res.data.status === "400") {
            let errMsg = res.data.message;
            swal.fire("Error", errMsg, "error");
          } else if (res.data.status === "201") {
            console.log(res);
            swal.fire("Account Created!", `${res.data.message}`, "success");
            this.props.history.push("/login");
          }
        })
        .catch(err => {
          alert("Server Error");
        });
    }
  };

  render() {
    if (!this.props.username) {
      return (
        <div>
          <div className="register-bg">
            <div className="mx-auto shadow register-card">
              <div className="register-image text-center">
                <img
                  className="user-icon"
                  src="http://icons.iconarchive.com/icons/custom-icon-design/silky-line-user/128/user-icon.png"
                  alt="user"
                />
              </div>
              <h3 className="register-title text-center mt-5">
                REGISTER ACCOUNT
              </h3>
              <div className="register-form">
                <form className="form-group" onSubmit={this.handleSubmit}>
                  <div className="register-input-title mt-2">Username</div>
                  <input
                    onChange={this.handleChange}
                    id="username"
                    value={this.state.username}
                    className="register-input mt-2"
                    type="text"
                    required
                    autoFocus
                  />
                  <div className="row">
                    <div className="col-6 justify-content-around">
                      <div className="mt-2 register-input-title">
                        First Name
                      </div>
                      <input
                        onChange={this.handleChange}
                        id="firstname"
                        value={this.state.firstname}
                        className="name-input mt-2"
                        type="text"
                        required
                      />
                    </div>
                    <div className="col-6 justify-content-around">
                      <div className="mt-2 register-input-title">Last Name</div>
                      <input
                        onChange={this.handleChange}
                        id="lastname"
                        value={this.state.lastmame}
                        className="name-input mt-2"
                        type="text"
                        required
                      />
                    </div>
                  </div>
                  <div className="register-input-title mt-2">Email</div>
                  <input
                    onChange={this.handleChange}
                    value={this.state.email}
                    id="email"
                    className="register-input mt-2"
                    type="email"
                    required
                  />
                  <div className="register-input-title mt-5">Password</div>
                  <input
                    onChange={this.handleChange}
                    value={this.state.password}
                    id="password"
                    className="register-input mb-3"
                    type="password"
                    required
                  />
                  <div className="register-input-title mt-5">
                    Repeat Password
                  </div>
                  <input
                    onChange={this.handleChange}
                    onFocus={() => {
                      this.setState({ matchPass: false });
                    }}
                    value={this.state.repeatpassword}
                    id="repeatpassword"
                    className="register-input mb-3"
                    type="password"
                    required
                  />
                  {this.state.matchPass ? (
                    <div className="alert alert-danger text-center">
                      Passwords does not match
                    </div>
                  ) : null}
                  <input
                    type="checkbox"
                    className="form-check-inline"
                    required
                    onClick={() => {
                      this.setState(prevState => ({
                        terms: !prevState.terms
                      }));
                    }}
                  />
                  <span className="text-justify">
                    I have read and agree to the
                    <button className="terms" onClick={this.toggle}>
                      terms and conditions
                    </button>
                  </span>
                  <div className="text-center mt-5">
                    <button
                      className="login-btn mb-5"
                      type="submit"
                      onClick={this.onRegisterClick}
                      disabled={!this.state.terms}
                    >
                      register
                    </button>
                    <Modal
                      style={{
                        position: "absolute",
                        left: "50%",
                        top: "50%",
                        transform: "translate(-50%, -50%)"
                      }}
                      isOpen={this.state.modal}
                      toggle={this.toggle}
                      className={this.props.className}
                    >
                      <ModalHeader toggle={this.toggle}>
                        Terms and Conditions
                      </ModalHeader>
                      <ModalBody className="text-justify">
                        I. Lorem ipsum dolor sit.
                        <br />
                        Lorem ipsum dolor sit amet, consectetur adipisicing
                        elit, sed do eiusmod tempor incididunt ut labore et
                        dolore magna aliqua. Ut enim ad minim veniam, quis
                        nostrud exercitation ullamco laboris nisi ut aliquip ex
                        ea commodo consequat. Duis aute irure dolor in
                        reprehenderit in voluptate velit esse cillum dolore eu
                        fugiat nulla pariatur. Excepteur sint occaecat cupidatat
                        non proident, sunt in culpa qui officia deserunt mollit
                        anim id est laborum.
                        <br />
                        <br />
                        II. Lorem, ipsum dolor.
                        <br />
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Eligendi praesentium non, voluptatum quis dignissimos
                        necessitatibus repudiandae placeat deserunt esse amet.
                      </ModalBody>
                    </Modal>
                  </div>
                  <p className="text-center mb-5">
                    Already have an account? <Link to="/login">Login</Link>!
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
    username: state.auth.username
  };
};
export default connect(
  mapStateToProps,
  null
)(Register);
