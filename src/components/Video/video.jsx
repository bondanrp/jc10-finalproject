import React, { Component } from "react";
import Axios from "axios";
import "./video.css";
import { Link, Redirect } from "react-router-dom";
import Swal from "sweetalert2";

import { timeSince } from "../../functions/index";
const swalWithButtons = Swal.mixin({
  customClass: {
    confirmButton: "confirm-button",
    cancelButton: "cancel-button"
  },
  buttonsStyling: false
});
let urlApi = "http://localhost:3001/";
export class Video extends Component {
  state = {
    data: [],
    related: [],
    nextData: [],
    prevData: [],
    refresh: false,
    loading: true,
    comment: "",
    comments: [],
    redirectLogin: false
  };

  timer = null;
  timerLogin = null;
  componentDidMount() {
    console.log(this.props.params);

    this.getData();
  }
  componentDidUpdate() {
    if (this.state.refresh) {
      this.setState({
        loading: true
      });
      clearTimeout(this.timer);
      clearTimeout(this.timerLogin);
      this.getData();
    }
  }
  componentWillUnmount() {
    clearTimeout(this.timer);
  }
  login = () => {
    this.setState({ redirectLogin: true });
  };
  addView = () => {
    Axios.put(urlApi + "view", { id: this.props.params.id }).then(res => {
      this.setState({ refresh: false });
      console.log("view added");
    });
  };
  getData = () => {
    this.setState({ refresh: false });
    Axios.get(urlApi + "getvideo/" + this.props.params.id).then(res => {
      this.setState({ data: res.data[0], loading: false });
      this.timer = setTimeout(this.addView, 60000);
      this.timerLogin = setTimeout(this.login, 20000);
      // NEXT EPISODE
      Axios.get(urlApi + "getepisode", {
        params: {
          title: this.state.data.title,
          episode: parseInt(this.state.data.episode) + 1
        }
      }).then(res => {
        this.setState({ nextData: res.data[0] });
        // PREVIOUS EPISODE
        Axios.get(urlApi + "getepisode", {
          params: {
            title: this.state.data.title,
            episode: parseInt(this.state.data.episode) - 1
          }
        }).then(res => {
          this.setState({ prevData: res.data[0] });
          // RELATED VIDEOS
          Axios.get(urlApi + "getrelatedvideos", {
            params: { category: this.state.data.category }
          }).then(res => {
            let filter = res.data.filter(val => {
              return val.id !== this.state.data.id;
            });
            this.setState({ related: filter });
            // GET COMMENTS
            Axios.get(urlApi + "getcomments", {
              params: {
                id: this.props.params.id
              }
            }).then(res => {
              if (this.props.username) {
                clearTimeout(this.timerLogin);
              }
              this.setState({ comments: res.data });
            });
          });
        });
      });
    });
  };

  renderComments = () => {
    let render = this.state.comments.map(val => {
      var date = timeSince(val.timestamp);
      return (
        <div className="comment-box">
          <Link
            onClick={() => {
              this.props.onOtherProfileClick(val.username);
            }}
            className="linkaja"
          >
            <div className="comment-header">
              <img src={val.profilepict} alt="" />
              <p>@{val.username}</p>
              <p>{val.role}</p>
            </div>
          </Link>
          <div className="comment-content">
            <p>{val.comment}</p>
            <p>{date}</p>
            {this.props.username === val.username ? (
              <button
                className="delete-comment"
                onClick={() => {
                  this.onDeleteComment(val.id);
                }}
              >
                X
              </button>
            ) : null}
          </div>
        </div>
      );
    });
    return render;
  };

  onDeleteComment = id => {
    swalWithButtons
      .fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        // type: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true
      })
      .then(result => {
        if (result.value) {
          Axios.delete(urlApi + `deletecomment/${id}`).then(res => {
            swalWithButtons.fire("Deleted!", "Your comment has been deleted.");
            Axios.get(urlApi + "getcomments", {
              params: {
                id: this.props.params.id
              }
            }).then(res => {
              this.setState({ comments: res.data });
            });
          });
        }
      });
  };
  renderRelated = () => {
    let render = this.state.related.map((val, idx) => {
      if (idx < 8) {
        return (
          <React.Fragment>
            <Link
              onClick={() => {
                this.props.onOtherVideoClick(val.author, val.title, val.id);
                this.setState({ refresh: true, loading: true });
              }}
              className="related-preview linkaja"
            >
              <div
                style={{
                  background: `url(${val.thumbnail})`
                }}
                className="related-preview-thumbnail"
              >
                <div className="preview-episode">Eps #{val.episode}</div>
              </div>
              <div className="ml-2">
                <p className="text-capitalize preview-title">
                  {val.title} Episode {val.episode}
                </p>
                <p className="preview-author">{val.author}</p>
                <br />
                <p className="preview-views ml-1">{val.views} views</p>
              </div>
            </Link>
          </React.Fragment>
        );
      } else {
        return null;
      }
    });
    return render;
  };

  nextEps = () => {
    if (this.state.nextData) {
      return (
        <React.Fragment>
          <h6>Next Episode</h6>
          <Link
            onClick={() => {
              this.props.onOtherVideoClick(
                this.props.params.username,
                this.props.params.title,
                this.state.nextData.id
              );
              this.setState({ refresh: true, loading: true });
            }}
            className="text-capitalize"
          >
            {this.state.nextData.title} Episode #{this.state.nextData.episode}{" "}
          </Link>
        </React.Fragment>
      );
    }
  };
  prevEps = () => {
    if (this.state.prevData) {
      return (
        <React.Fragment>
          <h6>Previous Episode</h6>
          <Link
            onClick={() => {
              this.props.onOtherVideoClick(
                this.props.params.username,
                this.props.params.title,
                this.state.prevData.id
              );
              this.setState({ refresh: true, loading: true });
            }}
            className="text-capitalize"
          >
            {this.state.prevData.title} Episode #{this.state.prevData.episode}{" "}
          </Link>
        </React.Fragment>
      );
    }
  };
  handleSubmit = event => {
    if (this.state.comment) {
      Axios.post(urlApi + "postcomment", {
        videoid: this.props.params.id,
        userid: this.props.id,
        comment: this.state.comment
      }).then(res => {
        Axios.post(urlApi + "sendcommentnotification", {
          targetid: this.state.data.posterid,
          comment: this.state.comment,
          title: this.state.data.title,
          episode: this.state.data.episode,
          username: this.props.username
        }).then(res => {
          this.setState({ comment: "" });
          Axios.get(urlApi + "getcomments", {
            params: {
              id: this.props.params.id
            }
          }).then(res => {
            this.setState({ comments: res.data });
          });
        });
      });
    }

    event.preventDefault();
  };
  render() {
    if (this.state.redirectLogin) {
      swalWithButtons.fire({
        title: "Please Login!",
        text: "It looks like you're enjoying our site!",
        confirmButtonText: "Got it!",
        reverseButtons: true
      });
      return <Redirect to="/login"></Redirect>;
    }
    if (this.state.loading) {
      return (
        <div className="gray-background">
          <div className="video-container-container">
            <div className="video-container">
              <div className="video-main"></div>
              <div className="video-episodes"></div>
              <div className="video-text"></div>
              <div></div>
            </div>
            <div>
              <div className="video-related">
                <div className="related-video">
                  <h4>Related Videos</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="gray-background">
          <div className="video-container-container">
            <div className="video-container">
              <div className="video-main">
                <iframe
                  title={this.state.data.title}
                  width="640"
                  height="480"
                  src={this.state.data.video}
                  frameborder="0"
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
                ></iframe>
              </div>
              <div>
                <div className="video-episodes">
                  <div>{this.prevEps()}</div>
                  <div className="text-right">{this.nextEps()}</div>
                </div>
              </div>
              <div className="video-text">
                <h1 className="video-title">
                  {this.state.data.title} Episode #{this.state.data.episode}
                </h1>
                <Link
                  onClick={() => {
                    this.props.onOtherProfileClick(this.state.data.author);
                  }}
                  className="video-author text-left"
                >
                  @{this.state.data.author}
                </Link>
                <h6>{this.state.data.views + 1} views</h6>
                <p className="video-desc">{this.state.data.description}</p>
              </div>
              {this.props.username ? (
                <React.Fragment>
                  <div className="video-comment-input">
                    <div>
                      <img src={this.props.profilepict} alt="" />
                      <p>@{this.props.username}</p>
                      <p>{this.props.role}</p>
                    </div>
                    <form>
                      <input
                        type="text"
                        placeholder="Add a comment"
                        value={this.state.comment}
                        maxLength="140"
                        onChange={e => {
                          this.setState({
                            comment: e.target.value
                          });
                        }}
                      />
                      <div className="text-right">
                        <button onClick={this.handleSubmit}>Submit</button>
                      </div>
                    </form>
                  </div>
                  {this.renderComments()}
                </React.Fragment>
              ) : (
                <div className="please">
                  <h1 className="text-center">
                    Please <Link onClick={this.props.loginModal}>sign in</Link>{" "}
                    to post comments
                  </h1>
                </div>
              )}
            </div>
            <div>
              <div className="video-related">
                <div className="related-video">
                  <h4>Related Videos</h4>
                </div>
                <div className="video-list">{this.renderRelated()}</div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}

export default Video;
