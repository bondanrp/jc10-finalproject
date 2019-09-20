import React, { Component } from "react";
import Axios from "axios";
import { connect } from "react-redux";

const urlApi = "http://localhost:3001/";

export class Profile extends Component {
  state = { data: [] };
  componentDidMount() {
    this.getData();
  }
  getData = () => {
    Axios.get(urlApi + "getusername", {
      params: {
        username: this.props.username
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
        <div className="container shadow my-5">
          <div>
            {val.firstname} {val.lastname}
          </div>
          <div>{val.username}</div>{" "}
        </div>
      );
    });
    return hasil;
  }
  render() {
    return <div>{this.renderProfile()} </div>;
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
