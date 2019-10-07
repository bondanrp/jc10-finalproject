import React, { Component } from "react";
import Axios from "axios";
import "./profile.css";
import { Link } from "react-router-dom";
import swal from "sweetalert2";

const urlApi = "http://localhost:3001/";

export class Profile extends Component {
  state = {
    data: [],
    videos: [],
    teacher: [],
    isSubscribed: [],
    username: "",
    loading: true,
    subscribedTo: [],
    subscribers: 0,
    loggedUser: "",
    edit: false,
    selectedFile: null,
    profpict: "",
    page: 15,
    pagemin: 0,
    pagemax: 15
  };
  componentDidMount() {
    console.log("profile mounted");

    this.getData();
    // this.props.getData();
    // this.props.getVideo();
    // this.props.getFeaturedVideos();
  }
  // componentWillReceiveProps(newProps, prevProps) {
  //   if (newProps.params !== this.props.params) {
  //     console.log(newProps.params, this.props.params);

  //     console.log("componentwillrecieve");
  //   }
  // }
  componentDidUpdate(prevProps, newProps) {
    if (this.props.params !== prevProps.params) {
      console.log("profile did update, %cdid something", "color: green");
      this.getData();
    }
  }

  componentWillUnmount() {}
  pagelist = () => {
    let total = Math.ceil(this.state.videos.length / 15);
    let pages = [];
    for (let i = 0; i < total; i++) {
      pages.push(i + 1);
    }
    let render = pages.map((val, idx) => {
      return (
        <React.Fragment>
          {idx === 0 ? (
            <input
              type="radio"
              id={"page" + val}
              name="page"
              value={val}
              defaultChecked
            />
          ) : (
            <input type="radio" id={"page" + val} name="page" value={val} />
          )}
          <label
            onClick={() => {
              let pagemax = val * this.state.page;
              let pagemin = val * this.state.page - this.state.page;
              this.setState({ pagemin, pagemax });
            }}
            htmlFor={"page" + val}
          >
            {val}
          </label>
        </React.Fragment>
      );
    });
    return render;
  };
  getData = () => {
    //get user profile
    console.log(this.props);

    Axios.get(urlApi + "getusername", {
      params: {
        username: this.props.params.username
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
          this.setState({
            isSubscribed: check
          });
          //teacher subscribed by target
          let username = this.props.params.username;
          Axios.get(urlApi + `subscribedteachers`, {
            params: { username: username }
          }).then(res => {
            this.setState({
              subscribedTo: res.data,
              loading: false
            });
          });
        });
      })
      .catch(err => {
        alert("err");
        console.log(err);
      });
    //get videos by this user
    Axios.get(urlApi + "getuservideos", {
      params: {
        username: this.props.params.username
      }
    })
      .then(res => {
        this.setState({ videos: res.data });
      })
      .catch(err => {
        alert("System disitu Error");
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
    if (!this.props.username) {
      this.props.loginModal();
    } else if (input.userid !== input.targetid) {
      Axios.post(urlApi + "subscribe", input).then(res => {
        this.setState({ isSubscribed: true });
        this.props.onSubscribe();
      });
    }
  };
  handleUnsubscribe = () => {
    Axios.delete(
      urlApi + `unsubscribe/${this.props.id}/${this.state.data[0].id}`
    ).then(res => {
      this.setState({ isSubscribed: false });

      this.props.onSubscribe();
    });
  };
  renderVideos() {
    let render = this.state.videos.map((val, idx) => {
      if (idx >= this.state.pagemin && idx < this.state.pagemax) {
        return (
          <Link
            to={`/browse/user/${val.author}/video/${val.class}/${val.episode}`}
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
            <p className="preview-author text-left">
              @{val.author} {val.view}
            </p>
          </Link>
        );
      } else {
        return null;
      }
    });

    return render;
  }
  userVideos = () => {
    if (this.state.data[0].role === "teacher") {
      return (
        <div className="text-left">
          <div>
            <h3 className="profile-title">Uploads</h3>
          </div>
          <div className="profile-video-list">{this.renderVideos()}</div>
          {this.state.videos.length > this.state.page ? (
            <div className="browse-pages">{this.pagelist()}</div>
          ) : null}
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
      this.props.username === this.state.data[0].username &&
      !this.state.edit
    ) {
      return (
        <div>
          <button
            className="subscribe"
            onClick={() => {
              console.log(this.props);
            }}
          >
            this is you
          </button>
        </div>
      );
    } else if (
      this.props.username === this.state.data[0].username &&
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
    } else if (this.state.data[0].role === "user" || !this.props.username) {
      return null;
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
            {this.props.username !== this.state.data[0].username ? (
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
          <Link to={`/browse/user/${val.username}`} className="teacher-test">
            <div className="teacher-profile">
              <img
                src={val.profilepict}
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "cover",
                  overflow: "hidden",
                  borderRadius: "50%",
                  margin: "auto"
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
          <div></div>
          <div></div>
        </div>
      );
  }
}

export default Profile;
