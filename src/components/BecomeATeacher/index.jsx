import React, { Component } from "react";
import "./becomeateacher.css";
import { Link } from "react-router-dom";

export class BecomeATeacher extends Component {
  render() {
    return (
      <div className="gray-background">
        <div className="teacher-header">
          <div>
            <h2>Berbagi keahlianmu.</h2>
            <h2>Dengan jutaan pengguna lainnya.</h2>
          </div>
        </div>
        <div className="teacher-container">
          <h2>Keuntungan Menjadi Teacher di Bagi Bakat</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Beatae
            pariatur in amet praesentium quos id itaque architecto eius numquam.
            Unde, aspernatur porro molestiae inventore ab tempore enim possimus!
            Nisi asperiores minima odio nostrum, exercitationem repellat aliquid
            aperiam beatae voluptas sit.
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos
            repellendus molestias beatae voluptate, vitae dolore necessitatibus
            modi laboriosam veniam dolor cupiditate perferendis expedita nihil
            sint architecto a nulla earum, explicabo iste at saepe? Similique
            doloribus consequuntur vero magni enim ab fugiat earum optio
            assumenda blanditiis, voluptatibus culpa saepe veniam. Hic ipsum
            distinctio, similique laboriosam consectetur ad dolores placeat
            labore tenetur deleniti veritatis nostrum provident quisquam
            suscipit dolore laborum adipisci nisi!
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Est ducimus
            sequi repellat sunt accusantium reiciendis mollitia iure, atque
            minus minima, eveniet, nesciunt dolor fuga possimus perspiciatis
            tempora nulla veritatis esse?
          </p>
          <Link to="/becomeateacher/register">Daftar Sekarang</Link>
        </div>
      </div>
    );
  }
}

export default BecomeATeacher;
