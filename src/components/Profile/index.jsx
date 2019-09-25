import React, { Component } from "react";
import Axios from "axios";
import { connect } from "react-redux";
import "./profile.css";
import { Link } from "react-router-dom";

const urlApi = "http://localhost:3001/";

export class Profile extends Component {
  state = { data: [], videos: [], teacher: [], refresh: false, loading: true };
  componentDidMount() {
    this.getData();
  }
  componentDidUpdate() {
    if (this.state.refresh) {
      this.getData();
    }
  }
  getData = () => {
    Axios.get(urlApi + "getusername", {
      params: {
        username: this.props.match.params.username
      }
    })
      .then(res => {
        this.setState({ data: res.data, refresh: false, loading: false });
      })
      .catch(err => {
        alert("System Error");
      });
    Axios.get(urlApi + "getteacher")
      .then(res => {
        this.setState({ teacher: res.data });
      })
      .catch(err => {
        alert("System Error");
      });
    Axios.get(urlApi + "getuservideos", {
      params: {
        username: this.props.match.params.username
      }
    })
      .then(res => {
        this.setState({ videos: res.data });
      })
      .catch(err => {
        alert("System Error");
      });
  };

  renderVideos() {
    let render = this.state.videos.map(val => {
      return (
        <Link
          onClick={() => {
            // this.setState({ refresh: true, loading: true });
          }}
          to={`/${val.author}/${val.title}/${val.id}`}
          className="linkaja preview"
        >
          <div
            style={{
              background: `url(${val.thumbnail})`
            }}
            className="preview-thumbnail"
          >
            <div className="preview-episode">Eps #{val.episode}</div>
          </div>
          <p className="text-capitalize preview-title">{val.title}</p>
          <p className="preview-author text-left">@{val.author}</p>
        </Link>
      );
    });
    return render;
  }
  userVideos = () => {
    if (this.state.data[0].role === "teacher") {
      return (
        <div className="text-left">
          <div>
            <h3 className="pl-2 mt-5">
              @{this.state.data[0].username}'s Videos
            </h3>
          </div>
          <div className="profile-video-list">{this.renderVideos()}</div>
        </div>
      );
    } else {
      return null;
    }
  };

  renderProfile() {
    let hasil = this.state.data.map(val => {
      return (
        <div className="profile-container">
          <div
            style={{
              width: "200px",
              height: "200px",
              borderRadius: "50%",
              margin: "auto"
            }}
          >
            <img
              src={val.profilepict}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                overflow: "hidden",
                borderRadius: "50%"
              }}
              alt=""
            />
          </div>
          <div className="profile-name">
            <h2>
              {val.firstname} {val.lastname}
            </h2>
            <div>
              <span>
                @{val.username} | {val.role}
              </span>
            </div>
            {this.userVideos()}
          </div>
          <div>{this.otherTeachers()}</div>
        </div>
      );
    });
    return hasil;
  }
  otherTeachers = () => {
    if (this.state.data[0].role === "teacher") {
      return (
        <React.Fragment>
          <h2>Other Teachers</h2>
          <div className="profile-teachers">{this.renderTeachers()}</div>
        </React.Fragment>
      );
    } else {
      return null;
    }
  };
  renderTeachers = () => {
    let hasil = this.state.teacher.map(val => {
      if (val.username !== this.state.data[0].username) {
        return (
          <Link
            to={`/${val.username}`}
            onClick={() => {
              this.setState({ refresh: true, loading: true });
            }}
          >
            <div>
              <img
                src={val.profilepict}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  overflow: "hidden",
                  borderRadius: "50%"
                }}
                alt=""
              />
            </div>
            <h6 className="text-center">@{val.username}</h6>
          </Link>
        );
      } else {
        return null;
      }
    });
    return hasil;
  };
  render() {
    if (!this.state.loading) {
      return <div className="gray-background">{this.renderProfile()}</div>;
    } else {
      return (
        <div className="gray-background">
          <div className="profile-loading"></div>
        </div>
      );
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
)(Profile);
