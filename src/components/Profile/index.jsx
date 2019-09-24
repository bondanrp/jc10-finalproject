import React, { Component } from "react";
import Axios from "axios";
import { connect } from "react-redux";
import "./profile.css";

const urlApi = "http://localhost:3001/";

export class Profile extends Component {
  state = { data: [] };
  componentDidMount() {
    this.getData();
  }
  getData = () => {
    Axios.get(urlApi + "getusername", {
      params: {
        username: this.props.match.params.username
      }
    })
      .then(res => {
        this.setState({ data: res.data });
      })
      .catch(err => {
        alert("System Error");
      });
  };

  renderProfile() {
    let hasil = this.state.data.map(val => {
      return (
        <div className="container shadow my-5 bg-white">
          <div className="profile-name">
            <h1>
              {val.firstname} {val.lastname}
            </h1>
            <div>{val.username}</div>{" "}
          </div>
        </div>
      );
    });
    return hasil;
  }
  render() {
    return <div className="gray-background">{this.renderProfile()} </div>;
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
)(Profile);
