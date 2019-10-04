import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import "./browse.css";
import { timeSince } from "../../functions/index";

const urlApi = "http://localhost:3001/";

export class Browse extends Component {
  state = {
    subscribedTeachers: [],
    preview: [],
    nav: "home",
    targetUser: "",
    targetTitle: "",
    targetId: "",
    redirectToVideo: false,
    categories: [],
    title: "Home",
    search: "",
    loading: true,
    page: 15,
    featured: [],
    sort: ""
  };

  componentDidMount() {
    this.getData();
    this.getVideo();
    this.getFeaturedVideos();
  }
  getData = () => {
    axios.get(urlApi + "getcategories").then(res => {
      this.setState({ categories: res.data });
    });
    if (localStorage.length > 0) {
      var loggedUser = JSON.parse(localStorage.userData).username;
    }
    axios
      .get(urlApi + `subscribedteachers`, {
        params: { username: loggedUser }
      })
      .then(res => {
        this.setState({ subscribedTeachers: res.data });
      });
  };

  getVideo = () => {
    axios.get(urlApi + "browseall").then(res => {
      this.setState({
        sort: "",
        preview: res.data,
        refresh: false,
        loading: false,
        page: 15
      });
    });
  };
  getFeaturedVideos = () => {
    axios.get(urlApi + "getfeaturedvideos").then(res => {
      this.setState({
        featured: res.data
      });
      console.log(res.data);
    });
  };
  getTeachers = () => {
    axios.get(urlApi + "getteacher").then(res => {
      this.setState({
        preview: res.data,
        loading: false,
        page: 15
      });
    });
  };

  renderSubscribedTeacher = () => {
    let render = this.state.subscription.map(val => {
      return (
        <li>
          @<Link to={`/user/${val.username}`}>{val.username}</Link>
        </li>
      );
    });
    return render;
  };
  handleSearch = event => {
    this.setState({ nav: "search" });
    // search video
    axios
      .get(urlApi + "search", { params: { search: this.state.search } })
      .then(res => {
        // kalau dapat video
        if (res.data.length > 0) {
          let total = res.data.length;
          this.setState({
            preview: res.data,
            title: `search results for '${this.state.search}'`,
            page: total
          });
          // search teacher
          axios
            .get(urlApi + "searchteachers", {
              params: { search: this.state.search }
            })
            .then(res => {
              // kalau dapat teacher
              if (res.data.length > 0) {
                this.setState({
                  preview: this.state.preview.concat(res.data),
                  loading: false,
                  page: 15
                });
              } else {
                // kalau tidak dapat teacher
                this.setState({
                  preview: this.state.preview.concat(res.data),
                  loading: false,
                  page: 15
                });
              }
            });
        } else {
          // kalau tidak dapat video, search teacher
          axios
            .get(urlApi + "searchteachers", {
              params: { search: this.state.search }
            })
            .then(res => {
              // kalau dapat teacher
              if (res.data.length > 0) {
                this.setState({
                  preview: this.state.preview.concat(res.data),
                  loading: false,
                  page: 15,
                  title: `search results for '${this.state.search}'`
                });
              } else {
                this.setState({
                  preview: res.data,
                  loading: false,
                  page: 15,
                  title: `no result found for keyword '${this.state.search}'`
                });
              }
            });
        }
      });
  };
  handleChange = event => {
    this.setState({ [event.target.id]: event.target.value });
  };
  renderFeatured = () => {
    let render = this.state.featured.map((val, idx) => {
      if (idx < 3) {
        return (
          <div className="featured-preview">
            <img src={val.thumbnail} alt="preview" />
            <Link to={`/user/${val.author}/${val.title}/${val.episode}`}>
              {val.title}
            </Link>
            <Link to={`/user/${val.author}`}>
              <p>@{val.author}</p>
            </Link>
            <p>{val.description}</p>
          </div>
        );
      } else {
        return null;
      }
    });
    return render;
  };
  renderVideos = () => {
    if (this.state.preview.length > 0) {
      let sorted = this.state.preview;
      if (this.state.title === "most viewed") {
        sorted = this.state.preview.sort((a, b) =>
          a.views < b.views ? 1 : -1
        );
      }
      if (this.state.sort === "date") {
        sorted = this.state.preview.sort((a, b) =>
          a.timestamp < b.timestamp ? 1 : -1
        );
      }
      if (this.state.sort === "views") {
        sorted = this.state.preview.sort((a, b) =>
          a.views < b.views ? 1 : -1
        );
      }

      let render = sorted.map((val, idx) => {
        if (idx < this.state.page) {
          if (val.title) {
            return (
              <div
                onClick={() => {
                  this.goToVideo(val.author, val.title, val.id);
                }}
                className="browse-preview"
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
                <p className="preview-author">{val.author}</p>
                <p className="preview-views">
                  {val.views} views • {timeSince(val.timestamp)}
                </p>
              </div>
            );
          } else if (val.username) {
            return (
              <Link to={`/user/${val.username}`} className="linkaja">
                <div className="text-center browse-user-icon">
                  <img className="browse-dp" src={val.profilepict} alt="DP" />
                  <p className="text-capitalize font-weight-bold">
                    {val.firstname} {val.lastname}
                  </p>
                  <p>@{val.username}</p>
                  <p className="text-capitalize font-weight-light">
                    {val.category}
                  </p>
                </div>
              </Link>
            );
          } else {
            return null;
          }
        } else {
          return null;
        }
      });
      return render;
    } else if (this.state.nav === "teacher") {
      return (
        <div style={{ gridColumn: "1/-1", margin: "auto", gridRow: "3" }}>
          This user have not uploaded any videos
        </div>
      );
    } else if (this.state.loading) {
      return (
        <div style={{ gridColumn: "1/-1", margin: "auto", gridRow: "3" }}>
          Loading ...
        </div>
      );
    } else if (this.state.nav === "teachers") {
      return null;
    } else {
      return (
        <div style={{ gridColumn: "1/-1", margin: "auto", gridRow: "3" }}>
          No videos to show
        </div>
      );
    }
  };

  subscribedTeachers = () => {
    let render = this.state.subscribedTeachers.map(val => {
      return (
        <React.Fragment>
          <input type="radio" name="sub-nav" id={`${val.username}`} />
          <label
            htmlFor={`${val.username}`}
            onClick={() => {
              this.setState({
                title: `${val.username}'s Videos`,
                loading: true,
                nav: "teacher"
              });
              axios
                .get(urlApi + "getuservideos", {
                  params: {
                    username: val.username
                  }
                })
                .then(res => {
                  this.setState({
                    preview: res.data,
                    loading: false,
                    page: 15
                  });
                });
            }}
          >
            @{val.username}
          </label>
        </React.Fragment>
      );
    });
    return render;
  };
  renderProfileButton = () => {
    if (this.state.title.includes("Video")) {
      return (
        <Link to={`/user/${this.state.nav}`}>
          <button className="browse-profile">profile</button>
        </Link>
      );
    } else {
      return null;
    }
  };

  categories = () => {
    let render = this.state.categories.map(val => {
      return (
        <React.Fragment>
          <input type="radio" name="sub-nav" id={`${val.category}`} />
          <label
            className="text-capitalize"
            htmlFor={`${val.category}`}
            onClick={() => {
              this.setState({ title: val.category, nav: "category" });
              axios
                .get(urlApi + "getpreview", {
                  params: { category: val.category }
                })
                .then(res => {
                  this.setState({ preview: res.data });
                });
            }}
          >
            {val.category}
          </label>
        </React.Fragment>
      );
    });
    return render;
  };

  goToVideo = (user, title, id) => {
    this.setState({ targetUser: user, targetTitle: title, targetId: id });
    this.setState({ redirectToVideo: true });
  };

  render() {
    if (this.state.redirectToVideo) {
      return (
        <Redirect
          to={`/user/${this.state.targetUser}/${this.state.targetTitle}/${this.state.targetId}`}
        ></Redirect>
      );
    } else {
      return (
        <div className="gray-background py-5">
          <div className="browse-container">
            <div className="browse-nav">
              <div>
                <input type="checkbox" name="home" id="home" defaultChecked />
                <label htmlFor="home">Home</label>
                <div className="nav-content">
                  {this.props.username ? (
                    <React.Fragment>
                      <input type="radio" name="sub-nav" id="mySubscriptions" />
                      <label
                        htmlFor="mySubscriptions"
                        onClick={() => {
                          this.setState({
                            title: "Subscriptions",
                            loading: true,
                            nav: "home"
                          });
                          if (localStorage.length > 0) {
                            var loggedId = JSON.parse(localStorage.userData).id;
                          }
                          axios
                            .get(urlApi + `getsubscription/${loggedId}`)
                            .then(res => {
                              this.setState({
                                preview: res.data,
                                loading: false,
                                page: 15
                              });
                            })
                            .catch(err => {
                              alert(err);
                            });
                        }}
                      >
                        Subscriptions
                      </label>
                    </React.Fragment>
                  ) : null}
                  <input type="radio" name="sub-nav" id="newest" />
                  <label
                    htmlFor="newest"
                    onClick={() => {
                      this.setState({
                        nav: "home",
                        title: "newest",
                        loading: true
                      });
                      this.getVideo();
                    }}
                  >
                    Newest Uploads
                  </label>
                  <input type="radio" name="sub-nav" id="most-viewed" />
                  <label
                    htmlFor="most-viewed"
                    onClick={() => {
                      this.setState({
                        nav: "home",
                        title: "most viewed",
                        loading: true
                      });
                      this.getVideo();
                    }}
                  >
                    Most Viewed
                  </label>
                </div>
              </div>
              {this.props.username ? (
                <div>
                  <input
                    type="checkbox"
                    name="home"
                    id="subscriptions"
                    defaultChecked
                  />
                  <label htmlFor="subscriptions">Subscriptions</label>
                  <div className="nav-content">{this.subscribedTeachers()}</div>
                </div>
              ) : null}
              <div>
                <input
                  type="checkbox"
                  name="home"
                  id="category"
                  defaultChecked
                />
                <label htmlFor="category">Category</label>
                <div className="nav-content">{this.categories()}</div>
              </div>
              <div>
                <input type="checkbox" name="home" id="teachers" />
                <label
                  onClick={() => {
                    this.setState({
                      title: "Teachers",
                      loading: true,
                      nav: "teachers"
                    });
                    this.getTeachers();
                  }}
                >
                  Teachers
                </label>
              </div>
            </div>
            <div className="browse-container-content">
              <div className="browse-search">
                <form
                  onSubmit={event => {
                    event.preventDefault();
                  }}
                >
                  <input
                    type="text"
                    id="search"
                    value={this.state.search}
                    onChange={this.handleChange}
                    onSubmit={() => {
                      this.handleSearch();
                    }}
                    placeholder="  Search..."
                  />
                  <button type="button" onClick={this.handleSearch}>
                    Search
                  </button>
                </form>
              </div>
              {this.state.nav !== "home" ? null : (
                <div className="browse-featured-container">
                  <div className="browse-title">
                    <h1>Featured Classes</h1>
                  </div>
                  <div className="browse-featured">{this.renderFeatured()}</div>
                </div>
              )}
              <div className="browse-content-container">
                <div className="browse-content">
                  <div className="browse-title">
                    <h1>{this.state.title}</h1>
                    {this.state.nav === "home" ? null : (
                      <div className="browse-sort">
                        <button
                          onClick={() => {
                            this.setState({ sort: "date" });
                          }}
                        >
                          by date
                        </button>
                        <button
                          onClick={() => {
                            this.setState({ sort: "views" });
                          }}
                        >
                          by views
                        </button>
                      </div>
                    )}
                    {this.renderProfileButton()}
                  </div>
                  {this.renderVideos()}
                  {this.state.preview.length > this.state.page ? (
                    <div
                      className="show-more"
                      onClick={() => {
                        this.setState({
                          page: this.state.page + 15
                        });
                      }}
                    >
                      show more
                    </div>
                  ) : null}
                </div>
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
    id: state.auth.id,
    profilepict: state.auth.profilepict
  };
};
export default connect(
  mapStateToProps,
  null
)(Browse);
