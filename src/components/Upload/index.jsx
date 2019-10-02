import React, { Component } from "react";
import "./upload.css";
import { connect } from "react-redux";
import Axios from "axios";
import { Redirect } from "react-router-dom";
let urlApi = "http://localhost:3001/";

export class Upload extends Component {
  state = { userVid: [] };
  componentDidMount() {
    this.getUserVideo();
  }
  getUserVideo() {
    Axios.get(urlApi + "getuservideos", {
      params: { username: this.props.username }
    }).then(res => {
      this.setState({ userVid: res.data });
    });
  }
  renderUserVideos = () => {
    let render = this.state.userVid.map(val => {
      return (
        <React.Fragment>
          <div>
            <img
              src={val.thumbnail}
              className="user-video-thumb"
              alt="thumbnail"
            />
            <p className="text-capitalize user-vid-title">
              {val.title} #{val.episode}
            </p>
            <div className="text-center mt-2 pr-2">
              <button className="edit">Edit</button>|
              <button className="delete">Delete</button>
            </div>
          </div>
        </React.Fragment>
      );
    });

    return render;
  };
  render() {
    if (this.props.role === "teacher") {
      return (
        <div className="gray-background py-5">
          <div className="upload-container">
            <div className="upload-nav">helo</div>
            <div className="user-video-container">
              <div className="uploads-title">
                <h2>Your Uploads</h2>
              </div>
              {this.renderUserVideos()}
            </div>
          </div>
        </div>
      );
    } else {
      return <Redirect to="/"></Redirect>;
    }
  }
}

const mapStateToProps = state => {
  return {
    username: state.auth.username,
    role: state.auth.role
  };
};

export default connect(
  mapStateToProps,
  null
)(Upload);
