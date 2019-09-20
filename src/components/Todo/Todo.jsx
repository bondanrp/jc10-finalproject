import React, { Component } from "react";
import Axios from "axios";
import "./todo.css";

const urlApi = "http://localhost:3001/";

export class Todo extends Component {
  state = {
    data: [],
    inputTodo: ""
  };
  componentDidMount() {
    this.getDataApi();
  }

  getDataApi() {
    Axios.get(urlApi + "getlist")
      .then(res => {
        this.setState({ data: res.data });
      })
      .catch(err => {
        alert("System Error");
      });
  }

  handleChange = event => {
    this.setState({ [event.target.id]: event.target.value });
  };

  handleSubmit = event => {
    event.preventDefault();
  };

  submitList = () => {
    let input = { action: this.state.inputTodo };
    Axios.post(urlApi + "addTodo", input)
      .then(res => {
        this.getDataApi();
      })
      .catch(err => {
        alert("Cannot Submit");
      });
  };
  handleDelete = id => {
    Axios.delete(urlApi + "deletetodo/" + id)
      .then(res => {
        this.getDataApi();
        console.log("halo");
      })
      .catch(err => alert("Error Deleting"));
  };

  renderList = () => {
    let data = this.state.data.map((val, idx) => {
      return (
        <div className="lists">
          <div className="todo-item">
            {idx + 1}. {val.action}
          </div>
          <div className="todo-button">
            <div
              onClick={() => {
                this.handleDelete(val.id);
              }}
            >
              X
            </div>
          </div>
        </div>
      );
    });
    return data;
  };

  render() {
    return (
      <React.Fragment>
        <div className="container mx-auto my-5 text-center">
          <form className="" onSubmit={this.handleSubmit}>
            <h2 className="judul">To Do List</h2>
            <input
              type="text"
              id="inputTodo"
              value={this.state.inputTodo}
              onChange={this.handleChange}
              className="mb-5 form-control w-50 mx-auto"
            />
            <button className="btn btn-success  " onClick={this.submitList}>
              submit
            </button>
          </form>
          <div>{this.renderList()}</div>
        </div>
        <div style={{ height: "1000px" }}></div>
      </React.Fragment>
    );
  }
}

export default Todo;
