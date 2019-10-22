import React from "react";
import styles from "./footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className="row justify-content-around w-100">
          <div className="col-8 col-md-5">
            <h5 className="judul">Bagi Bakat</h5>
            <p className="text-justify">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Suscipit
              fuga atque qui quam sunt repellendus voluptatum nemo perspiciatis
              voluptatem excepturi! Omnis dignissimos doloremque fugit
              perspiciatis, eius, et illo tempora, ipsum doloribus excepturi vel
              itaque sequi. Vero unde sint nostrum veniam!
            </p>
          </div>
          <div className="col-2">
            <ul className="list-unstyled">
              <li>
                <a
                  className={styles.footerlink}
                  href="http://www.github.com/bondanrp"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  className={styles.footerlink}
                  href="https://www.linkedin.com/in/bondanrp/"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  className={styles.footerlink}
                  href="https://www.facebook.com/bondanrp"
                >
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
