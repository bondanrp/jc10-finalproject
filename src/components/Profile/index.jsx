import React, { Component } from "react";
import Axios from "axios";
import { connect } from "react-redux";
import "./profile.css";
import { Link } from "react-router-dom";
import swal from "sweetalert2";
import { updateProfile } from "../../actions/updateprofile/updateprofile";

const urlApi = "http://localhost:3001/";

export class Profile extends Component {
  state = {
    data: [],
    videos: [],
    teacher: [],
    isSubscribed: [],
    username: "",
    refresh: false,
    loading: true,
    subscribedTo: [],
    subscribers: 0,
    loggedUser: "",
    edit: false,
    selectedFile: null,
    profpict: ""
  };
  componentDidMount() {
    this.getData();
  }
  componentDidUpdate() {
    // refresh page biar sesuai
    if (this.props.match.params.username !== this.state.username) {
      this.getData();
    }
  }
  getData = () => {
    //get user profile
    Axios.get(urlApi + "getusername", {
      params: {
        username: this.props.match.params.username
      }
    })
      .then(res => {
        this.setState({
          data: res.data,
          profpict: res.data[0].profilepict,
          username: res.data[0].username
        });
        Axios.get(urlApi + `countsubscribers/${res.data[0].id}`).then(res => {
          this.setState({ subscribers: res.data[0].subscribers });
        });
        //check if user is subscribed
        Axios.get(urlApi + "issubscribed", {
          params: { userid: this.props.id, targetid: this.state.data[0].id }
        }).then(res => {
          let check = res.data.length > 0;
          console.log(check);
          this.setState({
            isSubscribed: check
          });
          let username = this.props.match.params.username;
          //teacher subscribed by target
          Axios.get(urlApi + `subscribedteachers`, {
            params: { username: username }
          }).then(res => {
            this.setState({
              subscribedTo: res.data,
              refresh: false,
              loading: false
            });
          });
        });
      })
      .catch(err => {
        alert("System Error");
      });
    //get videos by this user
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
  handleEdit = () => {
    this.setState({ edit: true });
  };
  handleSave = () => {
    this.setState({ edit: false });
    this.onSubmit();
  };
  handleCancel = () => {
    this.setState({ edit: false });
  };

  handleSubscribe = () => {
    let input = {
      userid: this.props.id,
      targetid: this.state.data[0].id
    };
    if (input.userid !== input.targetid) {
      Axios.post(urlApi + "subscribe", input).then(res => {
        this.setState({ isSubscribed: true });
      });
    }
  };
  handleUnsubscribe = () => {
    Axios.delete(
      urlApi + `unsubscribe/${this.props.id}/${this.state.data[0].id}`
    ).then(res => {
      this.setState({ isSubscribed: false });
    });
  };

  renderVideos() {
    if (this.state.videos.length > 0) {
      return this.state.videos.map(val => {
        return (
          <Link
            onClick={() => {
              // this.setState({ refresh: true, loading: true });
            }}
            to={`/user/${val.author}/${val.title}/${val.id}`}
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
    } else {
      return (
        <div style={{ gridColumn: "2/4", textAlign: "center" }}>
          This user have not uploaded any videos
        </div>
      );
    }
  }
  userVideos = () => {
    if (this.state.data[0].role === "teacher") {
      return (
        <div className="text-left">
          <div>
            <h3 className="profile-title">Uploads</h3>
          </div>
          <div className="profile-video-list">{this.renderVideos()}</div>
        </div>
      );
    } else {
      return null;
    }
  };
  onSubmit = () => {
    var fd = new FormData();
    fd.append(
      "profpict",
      this.state.selectedFile,
      this.state.selectedFile.name
    );
    fd.append(
      "data",
      JSON.stringify({
        username: this.props.username
      })
    );
    Axios.post(urlApi + "uploadimage", fd).then(res => {
      let menjadi = urlApi + "files/" + res.data.filename;
      this.setState({
        edit: false,
        profpict: menjadi
      });
      swal.fire("Success", "Profile Updated!", "success");
      this.props.updateProfile(menjadi);
    });
  };
  subscribeButton = () => {
    if (
      this.props.match.params.username === this.props.username &&
      !this.state.edit
    ) {
      return (
        <div>
          <button className="unsubscribe">this is you</button>
        </div>
      );
    } else if (
      this.props.match.params.username === this.props.username &&
      this.state.edit
    ) {
      return (
        <div>
          <button className="profile-save" onClick={this.onSubmit}>
            save
          </button>
          <button className="profile-cancel" onClick={this.handleCancel}>
            cancel
          </button>
        </div>
      );
    } else if (this.state.isSubscribed) {
      return (
        <div>
          <button className="unsubscribe" onClick={this.handleUnsubscribe}>
            unsubscribe
          </button>
        </div>
      );
    } else if (!this.state.isSubscribed) {
      return (
        <div>
          <button className="subscribe" onClick={this.handleSubscribe}>
            subscribe
          </button>
        </div>
      );
    }
  };
  renderProfile() {
    let hasil = this.state.data.map(val => {
      return (
        <div className="profile-container">
          <div className="profile-data">
            {this.props.match.params.username !== this.props.username ? (
              <div
                style={{
                  width: "100px",
                  height: "100px",
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
            ) : (
              <div
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  margin: "auto",
                  position: "relative"
                }}
              >
                <img
                  src={this.state.profpict}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    overflow: "hidden",
                    borderRadius: "50%"
                  }}
                  className="profpict"
                  alt=""
                />
                <input
                  onChange={e => {
                    this.setState({
                      selectedFile: e.target.files[0],
                      edit: true
                    });
                  }}
                  type="file"
                  ref="changeDP"
                  className="d-none"
                />
                <input
                  className="upload-dp"
                  type="button"
                  value="edit"
                  onClick={() => {
                    this.refs.changeDP.click();
                  }}
                />
              </div>
            )}
            <div className="profile-name">
              <h2>
                {val.firstname} {val.lastname}
              </h2>

              <div>
                <span>
                  @{val.username} | {val.role}
                </span>
                <br />
                <span style={{ fontSize: "12px" }}>
                  {this.state.subscribers} subscribers
                </span>
              </div>
            </div>
            {this.subscribeButton()}
          </div>
          {this.subscribedTo()}
          {this.userVideos()}
        </div>
      );
    });
    return hasil;
  }

  subscribedTo = () => {
    return (
      <div>
        <h2 className="profile-title">Subscribed to</h2>

        <div className="teacher-wrapper">
          <div className="profile-teachers">{this.renderSubscribedTo()}</div>
        </div>
      </div>
    );
  };
  renderSubscribedTo = () => {
    if (this.state.subscribedTo.length > 0) {
      let subscribedTo = this.state.subscribedTo.map(val => {
        return (
          <Link
            to={`/${val.username}`}
            onClick={() => {
              this.setState({ refresh: true, loading: true });
            }}
            className="teacher-test"
          >
            <div className="teacher-profile">
              <img
                src={val.profilepict}
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "cover",
                  overflow: "hidden",
                  borderRadius: "50%"
                }}
                alt=""
              />
              <h6 className="text-center">@{val.username}</h6>
            </div>
          </Link>
        );
      });
      return subscribedTo;
    } else {
      return (
        <div style={{ gridColumn: "2/6", textAlign: "center" }}>
          This user is not subscribed to any teacher
        </div>
      );
    }
  };
  render() {
    if (!this.state.loading) {
      return <div className="gray-background">{this.renderProfile()}</div>;
    } else
      return (
        <div className="gray-background">
          <div className="profile-loading"></div>
        </div>
      );
  }
}

const mapStateToProps = state => {
  return {
    username: state.auth.username,
    id: state.auth.id
  };
};
export default connect(
  mapStateToProps,
  { updateProfile }
)(Profile);
