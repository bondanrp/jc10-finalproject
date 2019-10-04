import React, { Component } from "react";
import Axios from "axios";
import "./video.css";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Swal from "sweetalert2";

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
    comments: []
  };

  timer = null;
  componentDidMount() {
    this.getData();
  }
  componentDidUpdate() {
    if (!this.state.refresh) {
    } else if (this.props.match.params.id !== this.state.data.id) {
      this.setState({
        loading: true
      });
      clearTimeout(this.timer);
      this.getData();
    }
  }
  componentWillUnmount() {
    clearTimeout(this.timer);
  }
  addView = () => {
    Axios.put(urlApi + "view", { id: this.props.match.params.id }).then(res => {
      this.setState({ refresh: false });
      console.log("view added");
    });
  };
  getData = () => {
    this.setState({ refresh: false });
    Axios.get(urlApi + "getvideo/" + this.props.match.params.id).then(res => {
      this.setState({ data: res.data[0], loading: false });
      this.timer = setTimeout(this.addView, 60000);
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
                id: this.props.match.params.id
              }
            }).then(res => {
              this.setState({ comments: res.data });
            });
          });
        });
      });
    });
  };

  timeSince(date) {
    var seconds = Math.floor((new Date() - date) / 1000);
    var interval = Math.floor(seconds / 31536000);
    if (interval >= 1) {
      return interval + " years ago";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) {
      return interval + " months ago";
    }
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) {
      return interval + " days ago";
    }
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) {
      return interval + " hours ago";
    }
    interval = Math.floor(seconds / 60);
    if (interval >= 1) {
      return interval + " minutes ago";
    } else {
      return "just now";
    }
  }

  renderComments = () => {
    let render = this.state.comments.map(val => {
      var t = val.timestamp.split(/[- T Z :]/);
      var d = new Date(Date.UTC(t[0], t[1] - 1, t[2], t[3], t[4], t[5]));
      var date = this.timeSince(d);

      return (
        <div className="comment-box">
          <Link to={`/user/${val.username}`} className="linkaja">
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
    const swalWithButtons = Swal.mixin({
      customClass: {
        confirmButton: "confirm-button",
        cancelButton: "cancel-button"
      },
      buttonsStyling: false
    });

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
                id: this.props.match.params.id
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
          <Link
            onClick={() => {
              this.setState({ refresh: true });
            }}
            to={`/user/${val.author}/${val.title}/${val.id}`}
            className="linkaja related-preview"
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
              this.setState({ refresh: true });
            }}
            to={`./${this.state.nextData.id}`}
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
              this.setState({ refresh: true });
            }}
            to={`./${this.state.prevData.id}`}
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
        videoid: this.props.match.params.id,
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
              id: this.props.match.params.id
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
                  to={`/user/${this.state.data.author}`}
                  className="video-author text-left"
                >
                  @{this.state.data.author}
                </Link>
                <h6>{this.state.data.views + 1} views</h6>
                <p className="video-desc">{this.state.data.description}</p>
              </div>
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

const mapStateToProps = state => {
  return {
    username: state.auth.username,
    profilepict: state.auth.profilepict,
    id: state.auth.id,
    role: state.auth.role
  };
};
export default connect(mapStateToProps)(Video);
