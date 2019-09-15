import React, { Component } from "react";
import axios from "axios";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import swal from "sweetalert2";
import "./register.css";

class Register extends Component {
  state = { modal: false, username: "", email: "", password: "" };
  validateForm() {
    return (
      this.state.username.length > 0 &&
      this.state.email.length > 0 &&
      this.state.password.length > 0
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
    if (this.validateForm()) {
      let username = this.state.username;
      let email = this.state.email;
      axios
        .get("http://localhost:2019/users", {
          params: {
            username: username
          }
        })
        .then(res => {
          if (res.data.length === 0) {
            axios
              .get("http://localhost:2019/users", {
                params: {
                  email: email
                }
              })
              .then(res => {
                if (res.data.length === 0) {
                  this.toggle();
                } else {
                  swal.fire("Sorry", "Email already registered", "error");
                }
              });
          } else {
            swal.fire("Sorry!", "Username already taken!", "error");
          }
        });
    }
  };
  handleRegistration = () => {
    let username = this.state.username;
    let email = this.state.email;
    let password = this.state.password;
    this.props.history.push("/");
    axios
      .post("http://localhost:2019/users", {
        username: username,
        email: email,
        password: password,
        addedItems: [],
        total: 0
      })
      .then(res => {
        this.toggle();
        swal.fire(
          "Account Created!",
          `Please <a href='/login'>Log In</a> to continue shopping`,
          "success"
        );
      });
  };

  render() {
    if (!this.props.username) {
      return (
        <div>
          <div className="py-5 register-title-div">
            <div className="mx-auto my-5 shadow register-card">
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
              <div>
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
                  <div className="text-center mt-5">
                    <button
                      className="btn btn-outline-success mb-5"
                      type="submit"
                      onClick={this.onRegisterClick}
                    >
                      Register
                    </button>
                    <Modal
                      isOpen={this.state.modal}
                      toggle={this.toggle}
                      className={this.props.className}
                    >
                      <ModalHeader toggle={this.toggle}>
                        Terms of service
                      </ModalHeader>
                      <ModalBody>
                        Lorem ipsum dolor sit amet, consectetur adipisicing
                        elit, sed do eiusmod tempor incididunt ut labore et
                        dolore magna aliqua. Ut enim ad minim veniam, quis
                        nostrud exercitation ullamco laboris nisi ut aliquip ex
                        ea commodo consequat. Duis aute irure dolor in
                        reprehenderit in voluptate velit esse cillum dolore eu
                        fugiat nulla pariatur. Excepteur sint occaecat cupidatat
                        non proident, sunt in culpa qui officia deserunt mollit
                        anim id est laborum.
                      </ModalBody>
                      <ModalFooter>
                        <Button
                          onClick={this.handleRegistration}
                          color="success"
                        >
                          Accept
                        </Button>
                        <Button color="secondary" onClick={this.toggle}>
                          Cancel
                        </Button>
                      </ModalFooter>
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
