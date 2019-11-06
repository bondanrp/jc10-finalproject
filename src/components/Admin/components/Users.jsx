import React, { Component } from "react";
import Axios from "axios";

let urlApi = "http://localhost:3001/";
export class Users extends Component {
  state = {
    data: [],
    filterList: "",
    sort: "",
    pagemin: 0,
    pagemax: 15,
    page: 15
  };
  componentDidMount() {
    this.getData();
  }
  getData = () => {
    Axios.get(urlApi + "getuserdata").then(res => {
      this.setState({ data: res.data });
    });
  };
  renderUsers = () => {
    let filter = this.state.data.filter(el => {
      return (
        el.username.includes(this.state.filterList) ||
        el.firstname.includes(this.state.filterList) ||
        el.lastname.includes(this.state.filterList) ||
        el.email.includes(this.state.filterList)
      );
    });

    let render = filter.map((val, idx) => {
      if (idx >= this.state.pagemin && idx < this.state.pagemax) {
        return (
          <tr>
            <td>
              <img src={val.profilepict} alt="dp" />
            </td>
            <td>{val.id}</td>
            <td>{val.username}</td>
            <td>
              {val.firstname} {val.lastname}
            </td>
            <td>{val.email}</td>
            <td>{val.role}</td>
            <td>
              {val.premium ? (
                <p className="yes">Yes</p>
              ) : (
                <p className="no">No</p>
              )}
            </td>
            <td>
              {val.premium ? (
                <button
                  className="unpremiumize"
                  onClick={() => {
                    this.premiumize(val.id, "remove");
                  }}
                >
                  Remove
                </button>
              ) : (
                <button
                  className="premiumize"
                  onClick={() => {
                    this.premiumize(val.id, "give");
                  }}
                >
                  Give
                </button>
              )}
              {/* <button className="deleteuser">Delete</button> */}
            </td>
          </tr>
        );
      } else return null;
    });
    return render;
  };
  premiumize = (x, y) => {
    Axios.patch(urlApi + "premiumize", { id: x, type: y }).then(res => {
      this.getData();
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
    } else if (x === "username" && this.state.sort === "username") {
      this.setState({ data: this.state.data.reverse() });
    } else if (x === "username") {
      this.setState({
        data: this.state.data.sort((a, b) =>
          a.username > b.username ? 1 : a.username < b.username ? -1 : 0
        )
      });
    } else if (x === "name" && this.state.sort === "name") {
      this.setState({ data: this.state.data.reverse() });
    } else if (x === "name") {
      this.setState({
        data: this.state.data.sort((a, b) =>
          a.name > b.name ? 1 : a.name < b.name ? -1 : 0
        )
      });
    } else if (x === "email" && this.state.sort === "email") {
      this.setState({ data: this.state.data.reverse() });
    } else if (x === "email") {
      this.setState({
        data: this.state.data.sort((a, b) =>
          a.email > b.email ? 1 : a.email < b.email ? -1 : 0
        )
      });
    } else if (x === "premium" && this.state.sort === "premium") {
      this.setState({ data: this.state.data.reverse() });
    } else if (x === "premium") {
      this.setState({
        data: this.state.data.sort((a, b) =>
          a.premium > b.premium ? 1 : a.premium < b.premium ? -1 : 0
        )
      });
    } else if (x === "role" && this.state.sort === "role") {
      this.setState({ data: this.state.data.reverse() });
    } else if (x === "role") {
      this.setState({
        data: this.state.data.sort((a, b) =>
          a.role > b.role ? 1 : a.role < b.role ? -1 : 0
        )
      });
    }
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
  render() {
    return (
      <div className="admin-box">
        <h1 className="admin-title">Users</h1>{" "}
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
                this.sortby("username");
                this.setState({ sort: "id" });
              }}
            >
              Username
            </th>
            <th
              onClick={() => {
                this.sortby("name");
                this.setState({ sort: "name" });
              }}
            >
              Name
            </th>
            <th
              onClick={() => {
                this.sortby("email");
                this.setState({ sort: "email" });
              }}
            >
              Email
            </th>
            <th
              onClick={() => {
                this.sortby("role");
                this.setState({ sort: "role" });
              }}
            >
              Role
            </th>
            <th
              onClick={() => {
                this.sortby("premium");
                this.setState({ sort: "premium" });
              }}
            >
              Premium
            </th>
            <th>Action</th>
          </thead>
          <tbody>{this.renderUsers()}</tbody>
        </table>
        <div className="browse-pages">{this.pagelist()}</div>
      </div>
    );
  }
}

export default Users;
