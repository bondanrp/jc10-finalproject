import React, { Component } from "react";
import classnames from "classnames";
import styles from "./grid.module.css";
import './products.css'

export default class Products extends Component {

  render() {
    return (
      <main style={{height:'1000px'}} id="mainContent">
        <div className={classnames("text-center", styles.header)}>
          <h1 className='judul-products'>Nama Perusahaan</h1>
          <p>Kami menjual <span className='products'>produk perusahaan</span>  terbaik se-Indonesia</p>
        </div>

        <div className="container shadow">
          <div className="row justify-content-center py-5">
            <h1 className='products-title'>Our Products</h1>
          </div>  

          <div className="row justify-content-around text-center pb-5"></div>
          </div>
      </main>
    );
  }
}
