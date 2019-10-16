import React, { Component } from "react";
import "./upload.css";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import Axios from "axios";
import swal from "sweetalert2";
let urlApi = "http://localhost:3001/";

export class Upload extends Component {
  state = { didUpdate: false, userVid: [], class: [], selectedClass: "" };
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
      return <option value={val.class}>{val.class}</option>;
    });
    return render;
  };

  onSubmit = () => {
    var fd = new FormData();
    fd.append("video", this.state.selectedFile, this.state.selectedFile.name);
    fd.append(
      "data",
      JSON.stringify({
        username: this.props.username
      })
    );
    Axios.post(urlApi + "uploadvideo", fd).then(res => {
      let menjadi = urlApi + "files/" + res.data.filename;
      this.setState({});
      swal.fire("Success", "Video Uploaded!", "success");
      this.props.updateProfile(menjadi);
    });
  };
  render() {
    return (
      <div className="gray-background py-5">
        <div className="upload-container">
          <div className="text-center">
            <h1 className="upload-title">Upload a Video</h1>
            <input
              onChange={e => {
                this.setState({
                  selectedFile: e.target.files[0],
                  edit: true
                });
              }}
              type="file"
              ref="uploadvideo"
              className=""
            />
          </div>
          <div>
            <form>
              <h6>Class</h6>
              <select
                id="class"
                defaultValue=""
                onChange={e => {
                  this.setState({ selectedClass: e.target.value });
                }}
              >
                {this.renderClass()}
                <option value="">New Class Name</option>
              </select>
              <input
                type="text"
                placeholder="New Class..."
                disabled={this.state.selectedClass}
              />
              <h6>Title</h6>
              <input type="text" />
              <h6>Episode</h6>
              <input type="text" />
              <h6>Description</h6>
              <textarea />
              <button>Submit</button>
            </form>
          </div>
          <div>
            <h1>Your Uploads</h1>
            {this.renderUserVideos()}
          </div>
          <div></div>
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

export default withRouter(
  connect(
    mapStateToProps,
    null
  )(Upload)
);
