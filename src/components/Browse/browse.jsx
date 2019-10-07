import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import "./browse.css";
import { timeSince } from "../../functions/index";
import { Video } from "../Video/video.jsx";
import { Profile } from "../Profile/index.jsx";
import { updateProfile } from "../../actions/updateprofile/updateprofile";
import { onLoginUser } from "../../actions/login/login";
import querystring from "query-string";
import { LoginModal } from "../Login/loginModal";
import { Switch, Route } from "react-router-dom";

const urlApi = "http://localhost:3001/";

export class Browse extends Component {
  state = {
    subscribedTeachers: [],
    preview: [],
    nav: "home",
    profile: "",
    targetUser: "",
    targetTitle: "",
    targetId: "",
    redirectToVideo: false,
    categories: [],
    title: "Home",
    search: "",
    loading: true,
    page: 15,
    pagemin: 0,
    pagemax: 15,
    featured: [],
    sort: "",
    targetVideo: "",
    username: "",
    password: "",
    loginModal: false,
    profileRefresh: false,
    openBrowse: false
  };

  componentDidMount() {
    if (this.props.location.pathname === "/browse") {
      this.setState({ openBrowse: true });
    }
    this.getVideo();
    this.getData();
    this.getFeaturedVideos();
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.location.pathname === "/browse") {
      this.setState({ openBrowse: true });
    } else {
      this.setState({ openBrowse: false });
    }
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
  profileRefresh = () => {
    this.setState({ profileRefresh: true });
  };
  profileRefreshFalse = () => {
    this.setState({ profileRefresh: false });
  };
  getVideo = () => {
    axios.get(urlApi + "browseall").then(res => {
      this.setState({
        sort: "",
        preview: res.data,
        refresh: false,
        loading: false,
        pagemax: 15,
        pagemin: 0
      });
    });
  };
  getFeaturedVideos = () => {
    axios.get(urlApi + "getfeaturedvideos").then(res => {
      this.setState({
        featured: res.data
      });
    });
  };
  getTeachers = () => {
    axios.get(urlApi + "getteacher").then(res => {
      this.setState({
        preview: res.data,
        loading: false,
        pagemax: 15,
        pagemin: 0
      });
    });
  };

  // onOtherVideoClick = (author, title, id, episode) => {
  //   this.setState({ targetVideo: { author, title, id }, nav: "video" });
  //   this.props.history.push(`/browse/user/${author}/video/${title}/${id}`);
  //   let dom = document.getElementsByName("sub-nav");
  //   for (let i = 0; i < dom.length; i++) {
  //     dom[i].checked = false;
  //   }
  // };
  // onOtherProfileClick = username => {
  //   this.setState({ profile: username, nav: "profile" });
  //   this.props.history.push(`/browse/user/${username}`);
  //   let dom = document.getElementsByName("sub-nav");
  //   for (let i = 0; i < dom.length; i++) {
  //     dom[i].checked = false;
  //   }
  // };
  // onBrowseClick = () => {
  //   if (this.props.location.pathname === "/browse") {
  //     this.setState({ nav: "home" });
  //     this.props.history.push("/browse");
  //   } else if (this.props.location.pathname.includes("/video")) {
  //     this.setState({ nav: "video" });
  //   }
  // };
  onSubscribe = () => {
    axios
      .get(urlApi + `subscribedteachers`, {
        params: { username: this.props.username }
      })
      .then(res => {
        this.setState({ subscribedTeachers: res.data });
      });
  };
  handleSearch = event => {
    if (this.state.search) {
      this.setState({ nav: "search" });
      let search = querystring.stringify({ search: this.state.search });
      this.props.history.push(`/browse?${search}`);
      // search video
      axios
        .get(urlApi + "search", { params: { search: this.state.search } })
        .then(res => {
          // kalau dapat video
          if (res.data.length > 0) {
            this.setState({
              preview: res.data,
              title: `search results for '${this.state.search}'`
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
                    pagemax: 15,
                    pagemin: 0
                  });
                } else {
                  // kalau tidak dapat teacher
                  this.setState({
                    preview: this.state.preview.concat(res.data),
                    loading: false,
                    pagemax: 15,
                    pagemin: 0
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
                    pagemax: 15,
                    pagemin: 0,
                    title: `search results for '${this.state.search}'`
                  });
                } else {
                  this.setState({
                    preview: res.data,
                    loading: false,
                    pagemax: 15,
                    pagemin: 0,
                    title: `no result found for keyword '${this.state.search}'`
                  });
                }
              });
          }
        });
    }
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
            <Link
              to={`/browse/user/${val.author}/video/${val.class}/${val.episode}`}
            >
              {val.title}
            </Link>
            <Link to={`/browse/user/${val.username}`}>
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
  loading = () => {
    return (
      <div className="browse-preview">
        <div className="preview-thumbnail">
          <div className="preview-episode"></div>
        </div>
        <p className="text-capitalize preview-title"></p>
        <p className="preview-author"></p>
        <p className="preview-views"></p>
      </div>
    );
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
        if (idx >= this.state.pagemin && idx < this.state.pagemax) {
          if (val.title) {
            return (
              <div className="browse-preview">
                <div
                  style={{
                    background: `url(${val.thumbnail})`
                  }}
                  className="preview-thumbnail"
                >
                  <div className="preview-episode">Eps #{val.episode}</div>
                </div>
                <Link
                  to={`/browse/user/${val.author}/video/${val.class}/${val.episode}`}
                  className="linkaja"
                >
                  <p className="text-capitalize preview-title">{val.title}</p>
                </Link>
                <Link to={`/browse/user/${val.author}`} className="linkaja">
                  <p className="preview-author">{val.author}</p>
                </Link>
                <p className="preview-views">
                  {val.views} views • {timeSince(val.timestamp)}
                </p>
              </div>
            );
          } else if (val.username) {
            return (
              <Link className="linkaja" to={`/browse/user/${val.username}`}>
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
                nav: "teacher",
                profile: val.username
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
                    pagemax: 15,
                    pagemin: 0
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
    if (this.state.nav === "teacher") {
      return (
        <Link
          onClick={() => {
            this.setState({ nav: "profile" });
            this.props.history.push(`/browse/user/${this.state.profile}`);
          }}
        >
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
              this.setState({
                title: val.category,
                nav: "category",
                loading: true
              });
              axios
                .get(urlApi + "getpreview", {
                  params: { category: val.category }
                })
                .then(res => {
                  this.setState({
                    preview: res.data,
                    pagemin: 0,
                    loading: false,
                    pagemax: 15
                  });
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
  renderBrowse = () => {
    if (this.state.openBrowse) {
      return (
        <React.Fragment>
          {this.state.nav !== "home" ? null : (
            <div className="browse-featured-container">
              <div className="browse-title">
                <h1>Featured Classes</h1>
              </div>
              <div className="browse-featured">{this.renderFeatured()}</div>
            </div>
          )}
          {this.state.nav === "video" || this.state.nav === "profile" ? null : (
            <div className="browse-content-container">
              <div className="browse-title">
                <h1>{this.state.title}</h1>
                {this.renderProfileButton()}
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
              </div>
              <div className="browse-content">
                {this.state.loading ? this.loading : this.renderVideos()}
              </div>
              {this.state.preview.length > this.state.page ? (
                <div className="browse-pages">{this.pagelist()}</div>
              ) : null}
            </div>
          )}
        </React.Fragment>
      );
    }
  };
  onMyProfile = () => {
    if (this.props.username) {
      this.props.history.push(`/browse/user/${this.props.username}`);
    } else {
      this.loginModal();
    }
  };
  loginModal = () => {
    this.setState(prevState => ({
      loginModal: !prevState.loginModal
    }));
  };
  handleChange = event => {
    this.setState({ [event.target.id]: event.target.value });
  };
  pagelist = () => {
    let total = Math.ceil(this.state.preview.length / 15);
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
  render() {
    return (
      <div className="gray-background py-5">
        {this.state.loginModal ? (
          <LoginModal
            username={this.state.username}
            password={this.state.password}
            handleChange={e => this.handleChange(e)}
            onLoginUser={this.props.onLoginUser}
            history={this.props.history}
            loginModal={this.loginModal}
          />
        ) : null}
        <div className="browse-container">
          <div className="browse-nav">
            <div>
              <input type="radio" name="sub-nav" id="myProfile" />

              <button
                className="myprofile"
                htmlFor="myProfile"
                onClick={() => {
                  this.onMyProfile();
                }}
              >
                My Profile
              </button>
              <input type="checkbox" name="home" id="home" defaultChecked />
              <label htmlFor="home">Home</label>
              <div
                className="nav-content"
                onClick={() => {
                  this.props.history.push("/browse");
                }}
              >
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
                              pagemax: 15,
                              pagemin: 0
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
                <div
                  className="nav-content"
                  onClick={() => {
                    this.props.history.push("/browse");
                  }}
                >
                  {this.subscribedTeachers()}
                </div>
              </div>
            ) : null}
            <div>
              <input type="checkbox" name="home" id="category" defaultChecked />
              <label htmlFor="category">Category</label>
              <div
                className="nav-content"
                onClick={() => {
                  this.props.history.push("/browse");
                }}
              >
                {this.categories()}
              </div>
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

                  this.props.history.push("/browse");
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
            <Switch>
              <Route exact path="/browse/user/:username">
                <Profile
                  params={this.props.match.params}
                  username={this.props.username}
                  updateProfile={this.props.updateProfile}
                  id={this.props.id}
                />
              </Route>
              <Route exact path="/browse/user/:username/video/:class/:episode">
                <Video
                  params={this.props.match.params}
                  username={this.props.username}
                  profilepict={this.props.profilepict}
                  id={this.props.id}
                  loginModal={this.loginModal}
                />
              </Route>
            </Switch>
            {this.renderBrowse()}
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    username: state.auth.username,
    id: state.auth.id,
    profilepict: state.auth.profilepict,
    role: state.auth.role
  };
};
export default connect(
  mapStateToProps,
  { updateProfile, onLoginUser }
)(Browse);
