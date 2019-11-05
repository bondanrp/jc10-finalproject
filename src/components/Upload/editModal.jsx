import React, { Component } from "react";
import { Player } from "video-react";
import Swal from "sweetalert2";
import Axios from "axios";
const swalWithButtons = Swal.mixin({
  customClass: {
    confirmButton: "confirm-button",
    cancelButton: "cancel-button"
  },
  buttonsStyling: false
});

let urlApi = "http://localhost:3001/";
export class EditModal extends Component {
  state = {
    editClass: "",
    title: "",
    episode: "",
    timestamp: "",
    video: "",
    thumbnail: "",
    id: "",
    category: ""
  };
  componentDidMount() {
    let {
      title,
      episode,
      timestamp,
      video,
      thumbnail,
      id,
      category
    } = this.props.data;
    let editClass = this.props.data.class;
    this.setState({
      editClass,
      id,
      category,
      title,
      episode,
      timestamp,
      video,
      thumbnail
    });
  }

  handleDelete = () => {
    let id = this.state.id;
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
            swalWithButtons.fire("Deleted!", "Your video has been deleted.");
            this.props.editModal();
          });
        }
      });
  };
  handleChange = event => {
    this.setState({ [event.target.id]: event.target.value });
  };
  handleSave = () => {
    let { editClass, title, category, episode, id } = this.state;
    Axios.patch(urlApi + "updatevideo", {
      class: editClass,
      title,
      category,
      episode,
      id
    }).then(res => {
      swalWithButtons.fire("Success!", "Your edit have been saved!", "success");
      this.props.editModal();
    });
  };
  render() {
    return (
      <>
        <div className="edit-card">
          <div onClick={this.props.editModal} className="edit-x">
            x
          </div>
          {this.state.video.includes("localhost") ? (
            <Player src={this.state.video} />
          ) : (
            <iframe
              title={this.state.title}
              width="640"
              height="360"
              src={this.state.video}
              frameborder="0"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            />
          )}
          <div className="edit-form">
            <p>Class :</p>
            <input
              type="text"
              value={this.state.editClass}
              id="editClass"
              onChange={this.handleChange}
            />
            <p>Title :</p>
            <input
              type="text"
              value={this.state.title}
              id="title"
              onChange={this.handleChange}
            />
            <p>Episode :</p>
            <input
              type="text"
              value={this.state.episode}
              id="episode"
              onChange={this.handleChange}
            />
            <p>Category :</p>
            <select
              id="category"
              value={this.state.category}
              onChange={e => {
                this.handleChange(e);
              }}
            >
              {this.props.renderCategories()}
            </select>
          </div>
          <div className="edit-button">
            <button className="edit-delete" onClick={this.handleDelete}>
              Delete
            </button>
            <div></div>
            <button className="edit-cancel" onClick={this.props.editModal}>
              Cancel
            </button>
            <button className="edit-save" onClick={this.handleSave}>
              Save
            </button>
          </div>
        </div>
      </>
    );
  }
}

export default EditModal;
