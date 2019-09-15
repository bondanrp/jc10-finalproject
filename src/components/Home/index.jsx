import React, { Component } from "react";
import "./home.css";

export class Home extends Component {
  render() {
    return (
      <main style={{ height: "1000px" }} id="mainContent">
        <div className="text-center header">
          <h1 className="judul-products">Nama Perusahaan</h1>
          <p className="desc-products">
            Kami menjual <span className="products">produk perusahaan</span>{" "}
            terbaik se-Indonesia
          </p>
        </div>

        <div className="container shadow">
          <div className="row justify-content-center py-5">
            <h1 className="products-title">Our Products</h1>
          </div>

          <div className="row justify-content-around text-center pb-5"></div>
        </div>
      </main>
    );
  }
}

export default Home;
