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
    loading: true,
    comment: "",
    comments: [],
    redirectLogin: false,
    newPost: false
  };

  timer = null;
  timerLogin = null;
  componentDidMount() {
    this.getData();
  }

  componentDidUpdate(prevProps) {
    if (this.props.params.title) {
      if (prevProps.params.title) {
        if (this.props.params !== prevProps.params) {
          this.setState({
            loading: true
          });
          clearTimeout(this.timer);
          clearTimeout(this.timerLogin);
          this.getData();
        }
      }
    }
  }
  componentWillUnmount() {
    console.log("destroyed");
    clearTimeout(this.timer);
    clearTimeout(this.timerLogin);
  }
  login = () => {
    this.setState({ redirectLogin: true });
  };
  addView = () => {
    Axios.put(urlApi + "view", { id: this.props.params.id }).then(res => {
      console.log("view added");
    });
  };
  getData = () => {
    Axios.get(urlApi + "getvideo/" + this.props.params.id).then(res => {
      this.setState({ data: res.data[0] });
      this.timer = setTimeout(this.addView, 60000);
      this.timerLogin = setTimeout(this.login, 20000);
      // NEXT EPISODE
      Axios.get(urlApi + "getepisode", {
        params: {
          class: this.state.data.class,
          episode: parseInt(this.state.data.episode) + 1
        }
      }).then(res => {
        this.setState({ nextData: res.data[0] });
        // PREVIOUS EPISODE
        Axios.get(urlApi + "getepisode", {
          params: {
            class: this.state.data.class,
            episode: parseInt(this.state.data.episode) - 1
          }
        }).then(res => {
          this.setState({ prevData: res.data[0] });
          // RELATED VIDEOS
          Axios.get(urlApi + "getrelatedvideos", {
            params: { class: this.state.data.class }
          }).then(res => {
            this.setState({ related: res.data });
            // GET COMMENTS
            Axios.get(urlApi + "getcomments", {
              params: {
                id: this.props.params.id
              }
            }).then(res => {
              if (this.props.username) {
                clearTimeout(this.timerLogin);
              }
              this.setState({ comments: res.data, loading: false });
            });
          });
        });
      });
    });
  };
  renderComments = () => {
    let date;
    let render = this.state.comments.map(val => {
      date = timeSince(val.timestamp);
      return (
        <div className="comment-box" id={val.id}>
          <Link
            onClick={() => {
              this.props.onOtherProfileClick(val.username);
            }}
            className="linkaja"
          >
            <div className="comment-header">
              <img src={val.profilepict} alt="" />
              <div>
                <span>@{val.username}</span> • <span>{val.role}</span> •{" "}
                <span>{date}</span>
              </div>
            </div>
          </Link>
          <div className="comment-content">
            <p>{val.comment}</p>
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
      if (val.id === this.state.data.id) {
        return (
          <React.Fragment>
            <Link
              onClick={() => {
                this.props.onOtherVideoClick(val.author, val.title, val.id);
                this.setState({ loading: true });
              }}
              className="related-preview-selected linkaja"
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
                  {val.episode}. {val.title}
                </p>
                <p className="preview-author">{val.author}</p>
                <br />
                <p className="preview-views ml-1">{val.views} views</p>
              </div>
            </Link>
          </React.Fragment>
        );
      } else {
        return (
          <React.Fragment>
            <Link
              onClick={() => {
                this.props.onOtherVideoClick(val.author, val.title, val.id);
                this.setState({ loading: true });
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
                  {val.episode}. {val.title}
                </p>
                <p className="preview-author">{val.author}</p>
                <br />
                <p className="preview-views ml-1">{val.views} views</p>
              </div>
            </Link>
          </React.Fragment>
        );
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
              this.setState({ loading: true });
            }}
            className="text-capitalize"
          >
            {this.state.nextData.episode}. {this.state.nextData.title}
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
              this.setState({ loading: true });
            }}
            className="text-capitalize"
          >
            {this.state.prevData.episode}. {this.state.prevData.title}
          </Link>
        </React.Fragment>
      );
    }
  };
  handleSubmit = event => {
    if (this.state.comment) {
      this.setState({ newPost: true });
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
            this.setState({ newPost: false });
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
                  <h4>title</h4>
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
                  {this.state.data.episode}. {this.state.data.title}
                </h1>
                <h6>
                  {this.state.data.views + 1} views •{" "}
                  {timeSince(this.state.data.timestamp)}
                </h6>
                <hr />
                <Link
                  onClick={() => {
                    this.props.onOtherProfileClick(this.state.data.author);
                  }}
                  className="video-author text-left"
                >
                  @{this.state.data.author}
                </Link>
                <hr />
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
                        maxLength="139"
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
                  <h4 className="text-capitalize">{this.state.data.class}</h4>
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
