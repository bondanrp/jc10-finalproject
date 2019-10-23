import React, { Component } from "react";
import "./upload.css";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Axios from "axios";

import swal from "sweetalert2";

import { Player } from "video-react";
let urlApi = "http://localhost:3001/";

export class Upload extends Component {
  state = {
    didUpdate: false,
    userVid: [],
    class: [],
    video: "",
    thumbnail: ""
  };
  componentDidMount() {
    console.log(this.props.username);
    this.getUserVideo();
    this.getClass();
    console.log("oi");
  }
  componentDidUpdate(prevProps, nextProps) {
    if (this.props.username && this.state.didUpdate === false) {
      this.getUserVideo();
      this.getClass();
      this.setState({ didUpdate: true });
    }
  }
  handleSubmit = () => {
    if (this.state.video.length > 0 && this.state.thumbnail.length > 0) {
    } else {
      swal.fire("Error", "Please fill out all of the forms", "error");
    }
  };
  getUserVideo() {
    Axios.get(urlApi + "getuservideos", {
      params: { username: this.props.username }
    }).then(res => {
      this.setState({ userVid: res.data });
    });
  }
  getClass() {
    Axios.get(urlApi + "getclass", {
      params: { username: this.props.username }
    }).then(res => {
      this.setState({ class: res.data });
      console.log(res.data);
    });
  }
  renderUserVideos = () => {
    let sort = this.state.userVid.sort((a, b) => {
      return a.timestamp < b.timestamp ? 1 : -1;
    });
    let render = sort.map(val => {
      return (
        <React.Fragment>
          <div className="upload-preview">
            <img
              src={val.thumbnail}
              className="user-video-thumb"
              alt="thumbnail"
            />
            <Link
              to={`/browse/user/${val.author}/video/${val.class}/${val.episode}`}
              className="linkaja"
            >
              {val.title} #{val.episode}
            </Link>
            <p>{val.views} views</p>
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
  renderClass = () => {
    let render = this.state.class.map(val => {
      return <option value={val.class} />;
    });
    return render;
  };

  handleUploadVideo = e => {
    let format = e.target.files[0].name.substr(
      e.target.files[0].name.length - 3
    );
    if (format === "mp4") {
      this.setState({
        selectedFile: e.target.files[0],
        edit: true
      });
      var fd = new FormData();
      fd.append("video", e.target.files[0], e.target.files[0].name);
      Axios.post(urlApi + "uploadvideo", fd)
        .then(res => {
          console.log(res);
          let hasil = urlApi + "files/" + res.data.filename;
          this.setState({ video: hasil });
          swal.fire("Success", "Video Uploaded!", "success");
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      swal.fire("Error", "File format must be mp4", "error");
    }
  };
  handleUploadThumbnail = e => {
    let format = e.target.files[0].name.split(".")[1];
    if (format === "jpg" || format === "jpeg" || format === "png") {
      this.setState({
        selectedFile: e.target.files[0],
        edit: true
      });
      var fd = new FormData();
      fd.append("thumbnail", e.target.files[0], e.target.files[0].name);
      Axios.post(urlApi + "uploadthumbnail", fd)
        .then(res => {
          console.log(res);
          let hasil = urlApi + "files/" + res.data.filename;
          console.log(hasil);

          this.setState({ thumbnail: hasil });
          swal.fire("Success", "Thumbnail Uploaded!", "success");
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      swal.fire("Error", "File format must be jpg/png", "error");
    }
  };
  render() {
    return (
      <div className="gray-background py-5">
        <div className="upload-container">
          <div className="upload-vid">
            {this.state.video ? (
              <Player
                playsInline
                src={this.state.video}
                fluid={false}
                width={600}
              />
            ) : (
              <React.Fragment>
                <h1 className="upload-title">Upload a Video</h1>
                <input
                  onChange={e => {
                    this.handleUploadVideo(e);
                  }}
                  type="file"
                  ref="uploadvideo"
                />
              </React.Fragment>
            )}
          </div>
          <div className="upload-input">
            <form>
              <h6>Thumbnail</h6>
              {this.state.thumbnail ? (
                <div className="upload-thumbnail">
                  <button
                    onClick={() => {
                      this.setState({ thumbnail: "" });
                    }}
                    className="cancel-thumbnail"
                  >
                    X
                  </button>
                  <img src={this.state.thumbnail} alt="thumb" />
                </div>
              ) : (
                <div>
                  <input
                    onChange={e => {
                      this.handleUploadThumbnail(e);
                    }}
                    type="file"
                    ref="uploadthumbnail"
                  />
                </div>
              )}
              <br />
              <h6>Class</h6>
              <input
                list="ice-cream-flavors"
                type="text"
                placeholder="New Class..."
              />
              <datalist id="ice-cream-flavors">{this.renderClass()}</datalist>
              <h6>Title</h6>
              <input type="text" />
              <h6>Episode</h6>
              <input type="text" />
              <h6>Description</h6>
              <textarea />
              <button
                onClick={e => {
                  e.preventDefault();
                  this.handleSubmit();
                }}
              >
                Submit
              </button>
            </form>
          </div>
          )
          <div className="upload-upload">
            <h1>Your Uploads</h1>
            {this.renderUserVideos()}
          </div>
        </div>
      </div>
    );
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
