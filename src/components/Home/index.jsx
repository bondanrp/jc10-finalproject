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
    category: "semua",
    redirect: false,
    targetId: 0,
    redirectToVideo: false
  };
  componentDidMount() {
    this.getPreviewApi();
  }

  getPreviewApi() {
    Axios.get(urlPreviewApi + "getvideos").then(res => {
      this.shuffleArray(res.data);
      this.setState({ preview: res.data });
    });
  }

  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
  handleRedirect = () => {
    if (this.props.username) {
      this.setState({ redirect: true });
    } else {
      Swal.fire("Error", "Please sign in first", "error");
    }
  };
  goToVideo = id => {
    if (this.props.username) {
      this.setState({ targetId: id });
      this.setState({ redirectToVideo: true });
      console.log(this.props.username);
    } else {
      Swal.fire("Error", "Please sign in to view the video", "error");
    }
  };

  renderPreview = () => {
    if (this.state.redirectToVideo) {
      return <Redirect to={`/video/${this.state.targetId}`}></Redirect>;
    } else if (this.state.category !== "semua") {
      let filter = this.state.preview.filter(val => {
        return val.category === this.state.category;
      });
      let page = filter.slice(0, 10);
      let render = page.map(val => {
        return (
          <div
            onClick={() => {
              this.goToVideo(val.id);
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
    } else {
      let page = this.state.preview.slice(0, 10);
      let render = page.map(val => {
        return (
          <div
            onClick={() => {
              this.goToVideo(val.id);
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
    let categories = [
      "bisnis",
      "teknologi",
      "desain",
      "fotografi",
      "menulis",
      "ilustrasi"
    ];
    let render = categories.map(val => {
      return (
        <React.Fragment>
          |{" "}
          <button
            onClick={this.setCategory}
            className="categories text-capitalize"
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
    this.setState({ category: e.target.value });
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
                <h6>
                  <button
                    onClick={this.setCategory}
                    className="categories text-capitalize"
                    value="semua"
                  >
                    semua
                  </button>
                  {this.renderCategory()}
                </h6>
                <div className="d-flex justify-content-center">
                  <div className="previewbox my-2">{this.renderPreview()}</div>
                </div>
                <button className="tombol" onClick={this.handleRedirect}>
                  Cari Kursus
                </button>
              </div>
            </div>
            <div className="home-extra">
              <h2 className="products-title font-italic text-center my-5">
                Mengapa Kursus Lah
              </h2>
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
