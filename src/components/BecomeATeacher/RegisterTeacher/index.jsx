import React, { Component } from "react";
import { connect } from "react-redux";
import Axios from "axios";
import "./RegisterTeacher.css";

let urlApi = "http://localhost:3001/";
export class RegisterTeacher extends Component {
  state = {
    firstname: "",
    lastname: "",
    refresh: true
  };
  componentDidUpdate() {
    if (this.state.refresh) {
      this.getData();
    }
  }
  getData = () => {
    this.setState({ refresh: false });
    console.log("getdata");
    Axios.get(urlApi + "getusername", {
      params: { username: this.props.username }
    }).then(res => {
      this.setState({
        firstname: res.data[0].firstname,
        lastname: res.data[0].lastname
      });
    });
  };

  render() {
    if (this.props.username) {
      return (
        <div className="gray-background">
          <div className="register-teacher-container">
            <div className="register-teacher-card">
              <div className="register-teacher-content">
                <p>First Name</p>
                <input
                  type="text"
                  value={this.state.firstname}
                  disabled
                  className="text-capitalize"
                />
                <p>Last Name</p>
                <input
                  type="text"
                  value={this.state.lastname}
                  disabled
                  className="text-capitalize"
                />
                <p>Experiences</p>
                <textarea placeholder="tell us your experiences! (200 words)"></textarea>
                <p>Why do you want to join us?</p>
                <textarea></textarea>
              </div>
              <div></div>
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
}
const mapStateToProps = state => {
  return {
    username: state.auth.username,
    id: state.auth.id,
    profilepict: state.auth.profilepict,
    role: state.auth.role
  };
};
export default connect(
  mapStateToProps,
  null
)(RegisterTeacher);
