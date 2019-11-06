import React, { Component } from "react";
import Axios from "axios";
import Swal from "sweetalert2";
const swalWithButtons = Swal.mixin({
  customClass: {
    confirmButton: "confirm-button",
    cancelButton: "cancel-button"
  },
  buttonsStyling: false
});

let urlApi = "http://localhost:3001/";
export class Videos extends Component {
  componentDidMount() {
    this.getData();
  }
  state = {
    filterList: "",
    data: [],
    sort: "",
    pagemin: 0,
    pagemax: 15,
    page: 15
  };
  getData = () => {
    Axios.get(urlApi + "getvideodata").then(res => {
      this.setState({ data: res.data });
    });
  };
  pagelist = () => {
    let total = Math.ceil(this.state.data.length / 15);
    let pages = [];
    for (let i = 0; i < total; i++) {
      pages.push(i + 1);
    }
    let render = pages.map((val, idx) => {
      return (
        <React.Fragment>
          {idx === 0 ? (
            <input
              type="radio"
              id={"page" + val}
              name="page"
              value={val}
              checked={this.state.pagemax === 15}
              defaultChecked
            />
          ) : (
            <input type="radio" id={"page" + val} name="page" value={val} />
          )}
          <label
            onClick={() => {
              let pagemax = val * this.state.page;
              let pagemin = val * this.state.page - this.state.page;
              this.setState({ pagemin, pagemax });
            }}
            htmlFor={"page" + val}
          >
            {val}
          </label>
        </React.Fragment>
      );
    });
    return render;
  };
  renderList = () => {
    let filter = this.state.data.filter(el => {
      return (
        el.title.toLowerCase().includes(this.state.filterList) ||
        el.class.toLowerCase().includes(this.state.filterList) ||
        el.category.toLowerCase().includes(this.state.filterList) ||
        el.author.toLowerCase().includes(this.state.filterList) ||
        el.episode.toLowerCase().includes(this.state.filterList)
      );
    });
    let render = filter.map((val, idx) => {
      if (idx >= this.state.pagemin && idx < this.state.pagemax) {
        return (
          <tr>
            <td>
              <img
                src={val.thumbnail}
                alt="s"
                style={{ borderRadius: 0, width: "50px" }}
              />
            </td>
            <td>{val.id}</td>
            <td>{val.class}</td>
            <td>{val.title}</td>
            <td>{val.episode}</td>
            <td>{val.category}</td>
            <td>{val.author}</td>
            <td>{val.views}</td>
            <td>
              <button
                className="unpremiumize"
                onClick={() => this.handleDelete(val.id)}
              >
                Delete
              </button>
            </td>
          </tr>
        );
      } else return null;
    });
    return render;
  };

  handleDelete = id => {
    swalWithButtons
      .fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        // type: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true
      })
      .then(result => {
        if (result.value) {
          Axios.delete(urlApi + `deletevideo/${id}`).then(res => {
            swalWithButtons.fire(
              "Deleted!",
              "Your requested video has been deleted."
            );
            this.getData();
          });
        }
      });
  };
  sortby = x => {
    if (x === "id" && this.state.sort === "id") {
      this.setState({ data: this.state.data.reverse() });
    } else if (x === "id") {
      this.setState({
        data: this.state.data.sort((a, b) =>
          a.id > b.id ? 1 : a.id < b.id ? -1 : 0
        )
      });
    } else if (x === "class" && this.state.sort === "class") {
      this.setState({ data: this.state.data.reverse() });
    } else if (x === "class") {
      this.setState({
        data: this.state.data.sort((a, b) =>
          a.class > b.class ? 1 : a.class < b.class ? -1 : 0
        )
      });
    } else if (x === "title" && this.state.sort === "title") {
      this.setState({ data: this.state.data.reverse() });
    } else if (x === "title") {
      this.setState({
        data: this.state.data.sort((a, b) =>
          a.title > b.title ? 1 : a.title < b.title ? -1 : 0
        )
      });
    } else if (x === "category" && this.state.sort === "category") {
      this.setState({ data: this.state.data.reverse() });
    } else if (x === "category") {
      this.setState({
        data: this.state.data.sort((a, b) =>
          a.category > b.category ? 1 : a.category < b.category ? -1 : 0
        )
      });
    } else if (x === "author" && this.state.sort === "author") {
      this.setState({ data: this.state.data.reverse() });
    } else if (x === "author") {
      this.setState({
        data: this.state.data.sort((a, b) =>
          a.author > b.author ? 1 : a.author < b.author ? -1 : 0
        )
      });
    } else if (x === "views" && this.state.sort === "views") {
      this.setState({ data: this.state.data.reverse() });
    } else if (x === "views") {
      this.setState({
        data: this.state.data.sort((a, b) =>
          parseInt(a.views) > parseInt(b.views)
            ? 1
            : parseInt(a.views) < parseInt(b.views)
            ? -1
            : 0
        )
      });
    } else if (x === "episode" && this.state.sort === "episode") {
      this.setState({ data: this.state.data.reverse() });
    } else if (x === "episode") {
      this.setState({
        data: this.state.data.sort((a, b) =>
          parseInt(a.episode) > parseInt(b.episode)
            ? 1
            : parseInt(a.episode) < parseInt(b.episode)
            ? -1
            : 0
        )
      });
    }
  };

  render() {
    return (
      <div className="admin-box">
        <h1 className="admin-title">Videos</h1>{" "}
        <input
          type="text"
          className="admin-search"
          placeholder=" search..."
          value={this.state.filterList}
          onChange={e => this.setState({ filterList: e.target.value })}
        />
        <table className="admin-table">
          <thead>
            <th></th>
            <th
              onClick={() => {
                this.sortby("id");
                this.setState({ sort: "id" });
              }}
            >
              ID
            </th>
            <th
              onClick={() => {
                this.sortby("class");
                this.setState({ sort: "class" });
              }}
            >
              Class
            </th>
            <th
              onClick={() => {
                this.sortby("title");
                this.setState({ sort: "title" });
              }}
            >
              Title
            </th>
            <th
              onClick={() => {
                this.sortby("episode");
                this.setState({ sort: "episode" });
              }}
            >
              Episode
            </th>
            <th
              onClick={() => {
                this.sortby("category");
                this.setState({ sort: "category" });
              }}
            >
              Category
            </th>
            <th
              onClick={() => {
                this.sortby("author");
                this.setState({ sort: "author" });
              }}
            >
              Author
            </th>
            <th
              onClick={() => {
                this.sortby("views");
                this.setState({ sort: "views" });
              }}
            >
              Views
            </th>
            <th>Action</th>
          </thead>
          <tbody>{this.renderList()}</tbody>
        </table>
        <div className="browse-pages">{this.pagelist()}</div>
      </div>
    );
  }
}

export default Videos;
