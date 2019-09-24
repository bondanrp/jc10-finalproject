import React, { Component } from "react";
import Axios from "axios";
import { connect } from "react-redux";
import "./profile.css";
import { Link } from "react-router-dom";

const urlApi = "http://localhost:3001/";

export class Profile extends Component {
  state = { data: [], videos: [] };
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
          // onClick={() => {
          //   // this.setState({ refresh: true, loading: true });
          // }}
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
  renderProfile() {
    let hasil = this.state.data.map(val => {
      return (
        <div className="profile-container">
          <div className="profile-name">
            <h2>
              {val.firstname} {val.lastname}
            </h2>
            <div>
              <span>
                @{val.username} | {val.role}
              </span>
            </div>
          </div>
          <div>
            <div>
              <h3 className="pl-2 mt-5">@{val.username}'s videos</h3>
            </div>
            <div className="profile-video-list">{this.renderVideos()}</div>
          </div>
        </div>
      );
    });
    return hasil;
  }
  render() {
    return <div className="gray-background">{this.renderProfile()}</div>;
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
