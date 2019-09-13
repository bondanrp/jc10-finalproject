import React from "react";
import styles from "./footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container-fluid">
        <div className="row justify-content-around">
          <div className="col-8 col-md-5">
            <h5 className='judul text-white'>Nama Perusahaan</h5>
          <p className='text-white'>Kami menjual <span className='products'>produk perusahaan</span>  terbaik se-Indonesia</p>
            
          </div>
          <div className="col-2">
            <ul className="list-unstyled">
              <li>
                <a className={styles.footerlink} href="/">
                  GitHub
                </a>
              </li>
              <li>
                <a className={styles.footerlink} href="/">
                  LinkedIn
                </a>
              </li>
              <li>
                <a className={styles.footerlink} href="/">
                  Facebook
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
