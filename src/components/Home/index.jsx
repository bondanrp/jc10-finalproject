import React, { Component } from "react";
import "./home.css";
import Axios from "axios";
import { Redirect } from "react-router-dom";
import Swal from "sweetalert2";
import { connect } from "react-redux";

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
    loading: false
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
      Swal.fire({
        title: "Error",
        html: "Please sign in first",
        type: "error"
      });
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

  renderPreview = () => {
    if (this.state.redirectToVideo) {
      return (
        <Redirect
          to={`/${this.state.targetUser}/${this.state.targetTitle}/${this.state.targetId}`}
        ></Redirect>
      );
    } else if (this.state.loading) {
      return <div className="home-loading"></div>;
    } else {
      let render = this.state.preview.map(val => {
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
            <p className="preview-author text-left">@{val.author}</p>
          </div>
        );
      });

      return render;
    }
  };
  renderCategory = () => {
    let categories = this.state.categories;
    let render = categories.map(val => {
      let kondisi = this.state.category === val;

      return (
        <React.Fragment>
          |{" "}
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

  render() {
    if (this.state.redirect) {
      return <Redirect to="/browse"></Redirect>;
    } else {
      return (
        <React.Fragment>
          <main id="mainContent">
            <div className="text-center header">
              <div className="header-item">
                <h1 className="judul-products">Kursus Lah</h1>
                <p className="desc-products"></p>
              </div>
            </div>
            <div className="home-bg">
              <div className="home-content">
                <h2 className="products-title font-italic">
                  Akses Kelas Tidak Terbatas
                </h2>
                <h6>{this.renderCategory()}|</h6>
                <div className="d-flex justify-content-center">
                  <div className="previewbox my-2">{this.renderPreview()}</div>
                </div>
                <button className="tombol" onClick={this.handleRedirect}>
                  Cari Kursus
                </button>
              </div>
            </div>
            <div className="home-extra">
              <h2 className="products-title font-italic">Mengapa Kursus Lah</h2>
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
export default connect(mapStateToProps)(Home);
