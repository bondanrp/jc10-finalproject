import React, { Component } from "react";
import "./home.css";
import Axios from "axios";
import { Link, Redirect } from "react-router-dom";
import Swal from "sweetalert2";

import { onLoginUser } from "../../actions/login/login";
import { connect } from "react-redux";
import { timeSince } from "../../functions";

let urlPreviewApi = "http://localhost:3001/";

export class Home extends Component {
  state = {
    preview: [],
    categories: [],
    category: "semua",
    redirect: false,
    targetUser: "",
    targetTitle: "",
    targetId: 0,
    redirectToVideo: false,
    refresh: false,
    loading: false,
    loginModal: false,
    username: "",
    password: ""
  };
  componentDidMount() {
    this.getPreviewApi();
  }
  componentDidUpdate() {
    if (this.state.refresh) {
      this.getPreviewApi();
    }
  }
  getPreviewApi() {
    Axios.get(urlPreviewApi + "getcategories").then(res => {
      let hasil = res.data.map(val => {
        return val.category;
      });
      hasil.unshift("semua");
      this.setState({ categories: hasil });
    });
    if (this.state.category !== "semua") {
      Axios.get(urlPreviewApi + "getpreview", {
        params: { category: this.state.category }
      }).then(res => {
        this.setState({ preview: res.data, refresh: false, loading: false });
      });
    } else if (this.state.category === "semua") {
      Axios.get(urlPreviewApi + "getvideos").then(res => {
        this.setState({ preview: res.data, refresh: false, loading: false });
      });
    }
  }

  handleRedirect = () => {
    if (this.props.username) {
      this.setState({ redirect: true });
    } else {
      this.loginModal();
    }
  };
  goToVideo = (user, title, id) => {
    if (this.props.username) {
      this.setState({ targetUser: user, targetTitle: title, targetId: id });
      this.setState({ redirectToVideo: true });
    } else {
      Swal.fire("Error", "Please sign in to view the video", "error");
    }
  };
  loginModal = () => {
    this.setState(prevState => ({
      loginModal: !prevState.loginModal
    }));
  };

  renderPreview = () => {
    if (this.state.redirectToVideo) {
      return (
        <Redirect
          to={`/user/${this.state.targetUser}/${this.state.targetTitle}/${this.state.targetId}`}
        ></Redirect>
      );
    } else if (this.state.loading) {
      return <div className="home-loading"></div>;
    } else {
      let render = this.state.preview.map((val, idx) => {
        if (idx < 10) {
          return (
            <div
              onClick={() => {
                if (this.props.username) {
                  this.goToVideo(val.author, val.title, val.id);
                } else {
                  this.loginModal();
                }
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
              <p className="preview-author">{val.author} </p>
              <p className="preview-views">
                {val.views} views • {timeSince(val.timestamp)}
              </p>
            </div>
          );
        } else {
          return null;
        }
      });

      return render;
    }
  };
  renderCategory = () => {
    let categories = this.state.categories;
    let render = categories.map(val => {
      let kondisi = this.state.category === val;

      return (
        <React.Fragment key={val}>
          <button
            onClick={this.setCategory}
            className={
              kondisi
                ? "categories-active text-capitalize"
                : "categories text-capitalize"
            }
            value={val}
          >
            {val}
          </button>
        </React.Fragment>
      );
    });
    return render;
  };
  setCategory = e => {
    this.setState({ category: e.target.value, refresh: true, loading: true });
  };

  validateForm() {
    return this.state.username.length > 0 && this.state.password.length > 0;
  }
  handleChange = event => {
    this.setState({ [event.target.id]: event.target.value });
  };

  onLoginClick = () => {
    if (this.validateForm()) {
      let username = this.state.username;
      let password = this.state.password;
      this.props.onLoginUser(username, password);
      this.props.history.push("/");
    }
  };

  handleSubmit = event => {
    event.preventDefault();
  };
  render() {
    if (this.state.redirect) {
      return <Redirect to="/browse"></Redirect>;
    } else {
      return (
        <React.Fragment>
          <main id="mainContent">
            {this.state.loginModal ? (
              <div className="loginModal-bg">
                <div className="loginModal-container">
                  <div className="loginModal-close" onClick={this.loginModal}>
                    close
                  </div>
                  <div className="login-image text-center">
                    <img
                      className="user-icon"
                      src="http://icons.iconarchive.com/icons/custom-icon-design/silky-line-user/128/user-icon.png"
                      alt="user"
                    />
                  </div>
                  <h3 className="login-title text-center mt-5">
                    ACCOUNT LOGIN
                  </h3>
                  <div>
                    <form className="form-group" onSubmit={this.handleSubmit}>
                      <div className="login-input-title card-title mt-2">
                        Username
                      </div>
                      <input
                        className="login-input"
                        id="username"
                        value={this.state.username}
                        onChange={this.handleChange}
                        type="text"
                        placeholder="username"
                        autoFocus
                        required
                      />
                      <div className="login-input-title card-title mt-2">
                        Password
                      </div>
                      <input
                        className="login-input"
                        id="password"
                        value={this.state.password}
                        onChange={this.handleChange}
                        placeholder="********"
                        type="password"
                        required
                      />
                      <br />
                      <div className="text-center">
                        <button
                          className="login-btn mb-5"
                          type="submit"
                          onClick={this.onLoginClick}
                        >
                          Login
                        </button>
                      </div>
                      <p className="login-text">
                        Don't have an account?{" "}
                        <Link to="register">Sign Up</Link>!
                      </p>
                    </form>
                  </div>
                </div>
              </div>
            ) : null}
            <div className="text-center header">
              <div className="header-item">
                <div className="judul-products">
                  <h1>Bagi Bakat</h1>
                  <h5>
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                    Impedit, suscipit?
                  </h5>
                </div>
                <p className="desc-products"></p>
              </div>
            </div>
            <div className="home-bg">
              <div className="home-content">
                <h2 className="products-title">Akses Kelas Tidak Terbatas</h2>
                <h6>{this.renderCategory()}</h6>
                <div className="d-flex justify-content-center">
                  <div className="previewbox my-2">{this.renderPreview()}</div>
                </div>
                <button className="tombol" onClick={this.handleRedirect}>
                  Cari Kursus
                </button>
              </div>
            </div>
            <div className="home-extra">
              <h2 className="products-title">
                Mengapa <span className="judul-brand">Bagi Bakat</span>
              </h2>
              <div className="product-desc">
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>
          </main>
        </React.Fragment>
      );
    }
  }
}

const mapStateToProps = state => {
  return {
    username: state.auth.username
  };
};
export default connect(
  mapStateToProps,
  { onLoginUser }
)(Home);
