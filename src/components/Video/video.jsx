import React, { Component } from "react";
import Axios from "axios";
import "./video.css";
import { Link, Redirect } from "react-router-dom";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";

import { Player } from "video-react";

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
    newPost: false,
    refresh: false,
    redirectPremium: false,
  };
  
  timer = null;
  componentDidMount() {
    console.log(this.props);
    
    console.log("video mounted");
    this.getData();
  }
  
  componentDidUpdate(nextProps) {
    if (
      this.state.refresh ||
      nextProps.params.episode !== this.props.params.episode
    ) {
      this.setState({ loading: true });
      clearTimeout(this.timer);
      this.getData();
    }
  }

  redirectPremium=()=>{
    this.setState({redirectPremium:true})
  }
  componentWillUnmount() {
    console.log("video unmounted");
    console.log("timerended");
    clearTimeout(this.timer);
  }
  login = () => {
    this.setState({ redirectLogin: true });
  };
  addView = () => {
    Axios.put(urlApi + "view", { id: this.state.data.id }).then(res => {
      console.log("view added");
    });
  };
  getData = () => {
    this.setState({ refresh: false });
    this.timer = setTimeout(this.addView, 10000);
    console.log('timerstart');
    Axios.get(
      urlApi +
        `getvideo/${this.props.params.username}/${this.props.params.class}/${this.props.params.episode}`
    )
      .then(res => {
        this.setState({ data: res.data[0] });
        
        // NEXT EPISODE
        Axios.get(urlApi + "getepisode", {
          params: {
            class: this.state.data.class,
            episode: parseInt(this.state.data.episode) + 1
          }
        })
          .then(res => {
            this.setState({ nextData: res.data[0] });
            // PREVIOUS EPISODE
            Axios.get(urlApi + "getepisode", {
              params: {
                class: this.state.data.class,
                episode: parseInt(this.state.data.episode) - 1
              }
            })
              .then(res => {
                this.setState({ prevData: res.data[0] });
                // RELATED VIDEOS
                Axios.get(urlApi + "getrelatedvideos", {
                  params: { class: this.state.data.class }
                })
                  .then(res => {
                    this.setState({ related: res.data });
                    // GET COMMENTS
                    Axios.get(urlApi + "getcomments", {
                      params: {
                        id: this.state.data.id
                      }
                    })
                      .then(res => {
                        this.setState({ comments: res.data, loading: false });
                      })
                      .catch(err => {
                        console.log(err);
                      });
                  })
                  .catch(err => {
                    console.log(err);
                  });
              })
              .catch(err => {
                console.log(err);
              });
          })
          .catch(err => {
            console.log(err);
          });
      })
      .catch(err => {
        console.log(err);
      });
  };
  renderComments = () => {
    let date;
    let render = this.state.comments.map(val => {
      date = timeSince(val.timestamp);
      return (
        <div className="comment-box" id={val.id}>
          <Link to={`/browse/user/${val.username}`} className="linkaja">
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
                id: this.state.data.id
              }
            }).then(res => {
              this.setState({ comments: res.data });
            });
          });
        }
      });
  };
  renderRelated = () => {
    if(!this.props.username){
      return this.state.related.map((val, idx) => {
        if (idx === 0) {
          return (
            <React.Fragment>
              <Link
                to={`/browse/user/${val.author}/video/${val.class}/${val.episode}`}
                onClick={() => {
                  this.setState({ loading: true, refresh: true });
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
              <Link className="related-preview-blocked linkaja">
                <div
                  className="related-preview-blocked"
                  onClick={this.props.username ? this.redirectPremium : this.props.loginModal}
                >
                  <FontAwesomeIcon icon={faLock} className="video-locked" />
                </div>
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
    }
    else if (!this.props.premium) {
      return this.state.related.map((val, idx) => {
        if (idx < 3) {
          return (
            <React.Fragment>
              <Link
                to={`/browse/user/${val.author}/video/${val.class}/${val.episode}`}
                onClick={() => {
                  this.setState({ loading: true, refresh: true });
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
              <Link className="related-preview-blocked linkaja">
                <div
                  className="related-preview-blocked"
                  onClick={this.props.username ? this.redirectPremium : this.props.loginModal}
                >
                  <FontAwesomeIcon icon={faLock} className="video-locked" />
                </div>
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
    } else {
      return this.state.related.map((val, idx) => {
        if (val.id === this.state.data.id) {
          return (
            <React.Fragment>
              <Link
                to={`/browse/user/${val.author}/video/${val.class}/${val.episode}`}
                onClick={() => {
                  this.setState({ loading: true, refresh: true });
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
                to={`/browse/user/${val.author}/video/${val.class}/${val.episode}`}
                onClick={() => {
                  this.setState({ loading: true, refresh: true });
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
    }
  };  
  nextEps = () => {
    if (this.state.nextData) {
      if (!this.props.username) {
        return (
          <React.Fragment>
            <h6>Next Episode</h6>
            <Link
              onClick={() => {
                this.props.loginModal();
              }}
              className="text-capitalize"
            >
              {this.state.nextData.episode}. {this.state.nextData.title}
            </Link>
          </React.Fragment>
        );
      } 
      else if (!this.props.premium) {
        if(this.state.nextData.episode > 3){
        return (
          <React.Fragment>
            <h6>Next Episode</h6>
            <Link
              onClick={this.redirectPremium}
              className="text-capitalize"
            >
              {this.state.nextData.episode}. {this.state.nextData.title}
            </Link>
          </React.Fragment>
        )} else {return <React.Fragment>
          <h6>Next Episode</h6>
          <Link
            to={`/browse/user/${this.state.data.author}/video/${this.state.data.class}/${this.state.nextData.episode}`}
            onClick={() => {
              this.setState({ loading: true, refresh: true });
            }}
            className="text-capitalize"
          >
            {this.state.nextData.episode}. {this.state.nextData.title}
          </Link>
        </React.Fragment>}
      } 
      else {
        return (
          <React.Fragment>
            <h6>Next Episode</h6>
            <Link
              to={`/browse/user/${this.state.data.author}/video/${this.state.data.class}/${this.state.nextData.episode}`}
              onClick={() => {
                this.setState({ loading: true, refresh: true });
              }}
              className="text-capitalize"
            >
              {this.state.nextData.episode}. {this.state.nextData.title}
            </Link>
          </React.Fragment>
        );
      }
    }
  };
  prevEps = () => {
    if (this.state.prevData) {
      return (
        <React.Fragment>
          <h6>Previous Episode</h6>
          <Link
            to={`/browse/user/${this.props.params.username}/video/${this.props.params.class}/${this.state.prevData.episode}`}
            onClick={() => {
              this.setState({ loading: true, refresh: true });
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
        videoid: this.state.data.id,
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
              id: this.state.data.id
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
    if (!this.props.username && parseInt(this.props.params.episode) !== 1) {
      return (
        <Redirect
          to={`/browse/user/${this.props.params.username}/video/${this.props.params.class}/1`}
        ></Redirect>
      )} else if (!this.props.premium && parseInt(this.props.params.episode) > 3) {
        return (
          <Redirect
          to={`/premium`}
          ></Redirect>
          );
        } else if (this.state.redirectPremium) {
    return <Redirect to='/premium'></Redirect>}
    else if (this.state.loading) {
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
                {this.state.data.video.includes("youtube") ? (
                  <iframe
                    title={this.state.data.title}
                    width="640"
                    height="480"
                    src={this.state.data.video}
                    frameborder="0"
                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                  ></iframe>
                ) : (
                  <Player
                    playsInline
                    src={this.state.data.video}
                    fluid={false}
                    width={640}
                    height={480}
                  />
                )}
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
                  {this.state.data.views} views •{" "}
                  {timeSince(this.state.data.timestamp)}
                </h6>
                <hr />
                <Link
                  to={`/browse/user/${this.state.data.author}`}
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
                      <img src={this.props.profilepict} alt="dp" />
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
