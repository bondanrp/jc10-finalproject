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
    search: ""
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
        this.setState({ preview: res.data, refresh: false, loading: false });
      });
    } else if (this.state.nav === "subscriptions") {
      axios
        .get(urlApi + `getsubscription/${loggedId}`)
        .then(res => {
          this.setState({ preview: res.data });
        })
        .catch(err => {
          alert(err);
        });
    } else {
      axios
        .get(urlApi + "getuservideos", {
          params: {
            username: this.state.nav
          }
        })
        .then(res => {
          this.setState({ preview: res.data });
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
          this.setState({ preview: res.data, title: this.state.search });
        } else {
          this.setState({
            preview: res.data,
            title: `No result found with keyword '${this.state.search}'`
          });
        }
      });
  };
  handleChange = event => {
    console.log(this.state.search);

    this.setState({ [event.target.id]: event.target.value });
  };
  renderVideos = () => {
    let render = this.state.preview.map((val, idx) => {
      if (idx < 20) {
        return (
          <div
            onClick={() => {
              this.goToVideo(val.author, val.title, val.id);
            }}
            className="preview"
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
                title: `${val.username}'s Videos`
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

  goToVideo = (user, title, id) => {
    this.setState({ targetUser: user, targetTitle: title, targetId: id });
    this.setState({ redirectToVideo: true });
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
                  onSubmit={this.handleSearch}
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
                onClick={() => {
                  this.setState({ nav: "home", title: "Home" });
                  this.getVideo();
                }}
              >
                <input type="radio" name="home" id="home" defaultChecked />
                <p>Home</p>
              </label>
              <label
                htmlFor="subscriptions"
                onClick={() => {
                  this.setState({
                    nav: "subscriptions",
                    title: "Subscriptions"
                  });
                  this.getVideo();
                }}
              >
                <input type="radio" name="home" id="subscriptions" />
                <p>Subscriptions</p>
              </label>
              {this.subscribedTeachers()}
              <label
                htmlFor="category"
                onClick={() => {
                  this.setState({ nav: "home", title: "All Category" });
                  this.getVideo();
                }}
              >
                <input type="radio" name="home" id="category" />
                <p>Category</p>
              </label>
              {this.categories()}
            </div>
            <div className="browse-content">
              <div className="browse-title">
                <h1>{this.state.title}</h1>
                {this.renderProfileButton()}
              </div>
              {this.renderVideos()}
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
