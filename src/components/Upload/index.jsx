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
            <div
              style={{
                background: `url(${val.thumbnail})`
              }}
              className="user-video-thumb"
            ></div>
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
            <div className="upload-card">
              <div className="uploadimg">
                <h1 className="upload-titles">Upload Video :</h1>
              </div>
              <form className="upload-form">
                <h4>Title</h4>
                <h4>Episode</h4>
                <h4>Thumbnail</h4>
                <h4>Video</h4>
                <h4>Description</h4>
                <h4>Category</h4>
                <div></div>
                <input className="upload-input" type="text" />
                <input className="upload-input" type="text" />
                <input className="upload-input" type="text" />
                <input className="upload-input" type="text" />
                <input className="upload-input" type="text" />
                <input className="upload-input" type="text" />
                <button className="upload-button">Upload</button>
              </form>
            </div>
            <div className="your-uploads">
              <div className="uploadimg">
                <h1 className="upload-titles">Your Videos :</h1>
              </div>
            </div>
            <div className="upload-stats">
              <div className="uploadimg">
                <h1 className="upload-titles">Stats:</h1>
              </div>
            </div>
            {this.renderUserVideos()}
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
