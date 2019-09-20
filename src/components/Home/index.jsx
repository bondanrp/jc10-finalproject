import React, { Component } from "react";
import "./home.css";
import Axios from "axios";

let urlPreviewApi = "http://localhost:3001/";

export class Home extends Component {
  state = { preview: [], category: "semua" };
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
  renderPreview = () => {
    if (this.state.category !== "semua") {
      let filter = this.state.preview.filter(val => {
        return val.category === this.state.category;
      });
      let page = filter.slice(0, 10);
      let render = page.map(val => {
        return (
          <div className="col-8 col-sm-2 preview m-3 shadow">
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
          <div className="col-8 col-sm-2 preview m-3 shadow">
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
    return (
      <main id="mainContent">
        <div className="text-center header">
          <div className="header-item">
            <h1 className="judul-products">Nama Perusahaan</h1>
            <p className="desc-products"></p>
          </div>
        </div>
        <div className="home-bg">
          <div className="home-content text-center justify-content-center py-5">
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
            <div className="row justify-content-center my-2">
              {this.renderPreview()}
            </div>
            <button className="tombol">Cari Kursus</button>
          </div>
        </div>
        <div className="home-extra">
          <h2 className="products-title font-italic text-center my-5">
            Daftar Sekarang
          </h2>
        </div>
      </main>
    );
  }
}

export default Home;
