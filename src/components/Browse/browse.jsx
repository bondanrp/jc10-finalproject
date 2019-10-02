import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import "./browse.css";

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
    loadMore: false,
    page: 15,
    teachers: []
  };

  componentDidMount() {
    this.getData();
    this.getVideo();
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
    if (localStorage.length > 0) {
      var loggedId = JSON.parse(localStorage.userData).id;
    }
    if (this.state.nav === "home") {
      axios.get(urlApi + "browseall").then(res => {
        this.setState({
          preview: res.data,
          teachers: [],
          refresh: false,
          loading: false,
          page: 15
        });
      });
    } else if (this.state.nav === "subscriptions") {
      axios
        .get(urlApi + `getsubscription/${loggedId}`)
        .then(res => {
          this.setState({
            preview: res.data,

            teachers: [],
            loading: false,
            loadMore: false,
            page: 15
          });
        })
        .catch(err => {
          alert(err);
        });
    } else if (this.state.nav === "teachers") {
      axios.get(urlApi + "getteacher").then(res => {
        this.setState({ preview: [], loading: false, teachers: res.data });
      });
    } else {
      axios
        .get(urlApi + "getuservideos", {
          params: {
            username: this.state.nav
          }
        })
        .then(res => {
          this.setState({
            preview: res.data,
            loading: false,

            teachers: [],
            loadMore: false,
            page: 15
          });
        });
    }
  };

  renderSubscribedTeacher = () => {
    let render = this.state.subscription.map(val => {
      return (
        <li>
          @<Link to={`/${val.username}`}>{val.username}</Link>
        </li>
      );
    });
    return render;
  };
  handleSearch = event => {
    axios
      .get(urlApi + "search", { params: { search: this.state.search } })
      .then(res => {
        if (res.data.length > 0) {
          let total = res.data.length;
          this.setState({
            preview: res.data,
            title: `search results for '${this.state.search}'`,
            page: total
          });
        } else {
          this.setState({
            preview: res.data
          });
        }
      });
    axios
      .get(urlApi + "searchteachers", { params: { search: this.state.search } })
      .then(res => {
        if (res.data.length > 0) {
          this.setState({ teachers: res.data });
        } else {
          this.setState({
            teachers: res.data
          });
        }
      });
    if (this.state.teachers === null && this.state.preview === null) {
      this.setState({
        title: `No result found with keyword '${this.state.search}'`
      });
    }
  };
  handleChange = event => {
    this.setState({ [event.target.id]: event.target.value });
  };
  renderVideos = () => {
    let test = document.getElementsByName("sub-nav");
    let ok = false;
    for (let i = 0; i < test.length; i++) {
      if (test[i].checked) {
        ok = true;
      }
    }
    if (this.state.preview.length > 0) {
      let render = this.state.preview.map((val, idx) => {
        if (idx < 15) {
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
              <p className="preview-author">{val.author} • </p>
              <p className="preview-views">{val.views} views</p>
            </div>
          );
        } else {
          return null;
        }
      });
      return render;
    } else if (ok) {
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
  renderTeachers = () => {
    let render = this.state.teachers.map(val => {
      return (
        <Link to={`/${val.username}`} className="linkaja">
          <div className="text-center browse-user-icon">
            <img className="browse-dp" src={val.profilepict} alt="DP" />
            <p className="text-capitalize font-weight-bold">
              {val.firstname} {val.lastname}
            </p>
            <p>@{val.username}</p>
            <p className="text-capitalize font-weight-light">{val.category}</p>
          </div>
        </Link>
      );
    });
    return render;
  };
  subscribedTeachers = () => {
    let subscriptions = document.getElementById("subscriptions");
    if (subscriptions) {
      let hidden = subscriptions.checked
        ? "browse-nav-sub"
        : "browse-nav-sub-hidden";
      let render = this.state.subscribedTeachers.map(val => {
        return (
          <label
            className={hidden}
            htmlFor={`${val.username}`}
            onClick={() => {
              this.setState({
                nav: val.username,
                title: `${val.username}'s Videos`,
                loading: true
              });
              this.getVideo();
            }}
          >
            <input type="radio" name="sub-nav" id={`${val.username}`} />
            <p className={hidden}>@{val.username}</p>
          </label>
        );
      });
      return render;
    }
  };
  renderProfileButton = () => {
    if (this.state.title.includes("Video")) {
      return (
        <Link to={`/${this.state.nav}`}>
          <button className="browse-profile">profile</button>
        </Link>
      );
    } else {
      return null;
    }
  };

  categories = () => {
    let category = document.getElementById("category");
    if (category) {
      let hidden = category.checked
        ? "browse-nav-sub text-capitalize"
        : "browse-nav-sub-hidden";
      let render = this.state.categories.map(val => {
        return (
          <label
            className={hidden}
            htmlFor={`${val.category}`}
            onClick={() => {
              this.setState({ nav: val.category, title: val.category });
              axios
                .get(urlApi + "getpreview", {
                  params: { category: this.state.nav }
                })
                .then(res => {
                  this.setState({ preview: res.data });
                });
            }}
          >
            <input type="radio" name="sub-nav" id={`${val.category}`} />
            <p className={hidden}>{val.category}</p>
          </label>
        );
      });
      return render;
    } else return null;
  };
  clearRadio = () => {
    let test = document.getElementsByName("sub-nav");
    for (let i = 0; i < test.length; i++) {
      test[i].checked = false;
    }
  };
  goToVideo = (user, title, id) => {
    this.setState({ targetUser: user, targetTitle: title, targetId: id });
    this.setState({ redirectToVideo: true });
  };
  showMore = () => {
    let render = this.state.preview.map((val, idx) => {
      if (idx >= 15 && idx < this.state.page) {
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
            <p className="preview-author">{val.author} • </p>
            <p className="preview-views">{val.views} views</p>
          </div>
        );
      } else {
        return null;
      }
    });
    return render;
  };
  render() {
    if (this.state.redirectToVideo) {
      return (
        <Redirect
          to={`/${this.state.targetUser}/${this.state.targetTitle}/${this.state.targetId}`}
        ></Redirect>
      );
    } else {
      return (
        <div className="gray-background py-5">
          <div className="browse-container">
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
                    this.clearRadio();
                  }}
                  placeholder="  Search..."
                />
                <button type="button" onClick={this.handleSearch}>
                  Search
                </button>
              </form>
            </div>
            <div className="browse-nav">
              <label
                htmlFor="home"
                onChange={() => {
                  this.setState({ nav: "home", title: "Home", loading: true });
                  this.clearRadio();
                  this.getVideo();
                }}
              >
                <input type="radio" name="home" id="home" defaultChecked />
                <p>Home</p>
              </label>
              <label
                htmlFor="subscriptions"
                onChange={() => {
                  this.setState({
                    nav: "subscriptions",
                    title: "Subscriptions",
                    loading: true
                  });
                  this.clearRadio();
                  this.getVideo();
                }}
              >
                <input type="radio" name="home" id="subscriptions" />
                <p>Subscriptions</p>
              </label>
              {this.subscribedTeachers()}
              <label
                htmlFor="category"
                onChange={() => {
                  this.setState({
                    nav: "home",
                    title: "All Category",
                    loading: true
                  });
                  this.clearRadio();
                  this.getVideo();
                }}
              >
                <input type="radio" name="home" id="category" />
                <p>Category</p>
              </label>
              {this.categories()}
              <label
                htmlFor="teachers"
                onChange={() => {
                  this.setState({
                    nav: "teachers",
                    title: "teachers",
                    loading: true
                  });
                  this.clearRadio();
                  this.getVideo();
                }}
              >
                <input type="radio" name="home" id="teachers" />
                <p>Teachers</p>
              </label>
            </div>
            <div className="browse-content">
              <div className="browse-title">
                <h1>{this.state.title}</h1>
                {this.renderProfileButton()}
              </div>
              {this.renderTeachers()}
              {this.renderVideos()}
              {this.showMore()}
              {this.state.preview.length > this.state.page ? (
                <div
                  className="show-more"
                  onChange={() => {
                    this.setState({
                      loadMore: true,
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
      );
    }
  }
}
const mapStateToProps = state => {
  return {
    id: state.auth.id
  };
};
export default connect(
  mapStateToProps,
  null
)(Browse);
