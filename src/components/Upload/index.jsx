import React, { Component } from "react";
import "./upload.css";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import Axios from "axios";
import EditModal from "./editModal";

import swal from "sweetalert2";

import { Player } from "video-react";
let urlApi = "http://localhost:3001/";
export class Upload extends Component {
  state = {
    didUpdate: false,
    userVid: [],
    class: [],
    categories: [],
    video: "",
    thumbnail: "",
    InputTitle: "",
    inputClass: "",
    inputCategory: "",
    inputDesc: "",
    inputEpisode: "",
    selectedThumbnail: "",
    editModal: false,
    loading: true,
    newClass: "",
    //edit
    edit: 0
  };
  componentDidMount() {
    this.getUserVideo();
    this.getData();
  }
  componentDidUpdate(prevProps, nextProps) {
    if (this.props.username && this.state.didUpdate === false) {
      this.getUserVideo();
      this.getData();
      this.setState({ didUpdate: true });
    }
  }
  handleSubmit = () => {
    if (
      this.state.selectedFile &&
      this.state.selectedThumbnail &&
      this.state.inputTitle &&
      this.state.inputClass &&
      this.state.inputCategory &&
      this.state.inputDesc &&
      this.state.inputEpisode
    ) {
      let {
        inputTitle,
        inputClass,
        inputEpisode,
        inputDesc,
        inputCategory
      } = this.state;

      var fd = new FormData();
      fd.append("video", this.state.selectedFile, this.state.selectedFile.name);

      var fd2 = new FormData();
      fd2.append(
        "thumbnail",
        this.state.selectedThumbnail,
        this.state.selectedThumbnail.name
      );

      Axios.get(urlApi + "subscribedUsers", {
        params: { id: this.props.id }
      }).then(res => {
        Axios.post(urlApi + "senduploadnotification", {
          data: res.data,
          username: this.props.username,
          class: this.state.inputClass,
          title: this.state.inputTitle,
          episode: this.state.inputEpisode
        });
      });
      // upload video
      Axios.post(urlApi + "uploadvideo", fd)
        .then(res => {
          let hasil = urlApi + "files/video/" + res.data.filename;
          this.setState({ video: hasil });
          //upload thumbnail
          Axios.post(urlApi + "uploadthumbnail", fd2)
            .then(res => {
              let hasil2 = urlApi + "files/video/" + res.data.filename;
              this.setState({ thumbnail: hasil2 });
              //upload data
              Axios.post(urlApi + "uploadvideodata", {
                inputTitle,
                inputClass,
                inputEpisode,
                inputDesc,
                thumbnail: hasil2,
                video: hasil,
                author: this.props.username,
                inputCategory
              }).then(res => {
                this.getUserVideo();
                this.setState({
                  video: "",
                  thumbnail: "",
                  InputTitle: "",
                  inputClass: "",
                  inputCategory: "",
                  inputDesc: "",
                  inputEpisode: "",
                  selectedThumbnail: "",
                  selectedFile: ""
                });
                swal.fire(
                  "Success",
                  "Your video have been uploaded!",
                  "success"
                );
              });
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      swal.fire("Error", "Please fill out all of the forms", "error");
    }
  };
  getUserVideo() {
    Axios.get(urlApi + "getuservideos", {
      params: { username: this.props.username }
    }).then(res => {
      this.setState({ userVid: res.data });
    });
  }
  getData() {
    Axios.get(urlApi + "getclass", {
      params: { username: this.props.username }
    }).then(res => {
      this.setState({ class: res.data });
    });
    Axios.get(urlApi + "getcategories").then(res => {
      this.setState({ categories: res.data, loading: false });
    });
  }
  renderUserVideos = () => {
    let sort = this.state.userVid.sort((a, b) => {
      return a.timestamp < b.timestamp ? 1 : -1;
    });
    let render = sort.map(val => {
      return (
        <React.Fragment>
          <div className="upload-preview">
            <img src={val.thumbnail} alt="thumbnail" />
            <Link
              to={`/browse/user/${val.author}/video/${val.class}/${val.episode}`}
              className="linkaja"
            >
              {val.title} #{val.episode}
            </Link>
            <p>{val.views} views</p>
            <div className="text-center mt-2 pr-2">
              <button
                className="edit"
                onClick={_ => {
                  this.handleEdit(val);
                }}
              >
                Edit
              </button>
            </div>
          </div>
        </React.Fragment>
      );
    });

    return render;
  };
  handleEdit = val => {
    this.setState({ edit: val });
    this.editModal();
  };
  editModal = () => {
    this.setState({ editModal: !this.state.editModal });
    if (this.state.editModal === false) {
      this.getUserVideo();
    }
  };
  renderClass = () => {
    let render = this.state.class.map(val => {
      return <option value={val.class}>{val.class}</option>;
    });
    return render;
  };
  renderCategories = () => {
    let render = this.state.categories.map(val => {
      return <option value={val.category}>{val.category}</option>;
    });
    return render;
  };
  handleChange = event => {
    this.setState({ [event.target.id]: event.target.value });
  };

  handleUploadVideo = e => {
    let format = e.target.files[0].name.substr(
      e.target.files[0].name.length - 3
    );
    if (format === "mp4") {
      this.setState({
        selectedFile: e.target.files[0],
        edit: true
      });
    } else {
      swal.fire("Error", "File format must be mp4", "error");
    }
  };
  handleUploadThumbnail = e => {
    let format = e.target.files[0].name.split(".")[1];
    if (format === "jpg" || format === "jpeg" || format === "png") {
      this.setState({
        selectedThumbnail: e.target.files[0],
        edit: true
      });
    } else {
      swal.fire("Error", "File format must be jpg/png", "error");
    }
  };
  render() {
    if (this.state.loading) {
      return null;
    }
    if (this.props.role === "teacher") {
      return (
        <div className="gray-background py-5">
          {this.state.editModal ? (
            <div className="edit-modal-container">
              <EditModal
                renderCategories={this.renderCategories}
                editModal={this.editModal}
                data={this.state.edit}
                getUserVideo={this.getUserVideo}
              />
            </div>
          ) : null}
          <div className="upload-container">
            <div className="upload-vid">
              {this.state.selectedFile ? (
                <Player
                  playsInline
                  src={URL.createObjectURL(this.state.selectedFile)}
                  fluid={false}
                  width={600}
                />
              ) : (
                <React.Fragment>
                  <h1 className="upload-title">Upload a Video</h1>
                  <input
                    onChange={e => {
                      this.handleUploadVideo(e);
                    }}
                    type="file"
                    ref="uploadvideo"
                  />
                </React.Fragment>
              )}
            </div>
            <div className="upload-input">
              <form>
                <h6>Thumbnail</h6>
                {this.state.selectedThumbnail ? (
                  <div className="upload-thumbnail">
                    <button
                      onClick={() => {
                        this.setState({ selectedThumbnail: "" });
                      }}
                      className="cancel-thumbnail"
                    >
                      X
                    </button>
                    <img
                      src={URL.createObjectURL(this.state.selectedThumbnail)}
                      alt="thumb"
                    />
                  </div>
                ) : (
                  <div>
                    <input
                      onChange={e => {
                        this.handleUploadThumbnail(e);
                      }}
                      type="file"
                      ref="uploadthumbnail"
                    />
                  </div>
                )}
                <br />
                <h6>Class</h6>
                <select
                  value={this.state.inputClass}
                  id="inputClass"
                  onChange={e => {
                    this.handleChange(e);
                  }}
                >
                  <option value="">New Class...</option>
                  {this.renderClass()}
                </select>
                {this.state.inputClass ? null : (
                  <>
                    <input
                      placeholder="New Class Name"
                      value={this.state.newClass}
                      id="newClass"
                      onChange={e => {
                        this.handleChange(e);
                      }}
                    />
                    <button
                      onClick={e => {
                        e.preventDefault();
                        if (this.state.newClass) {
                          if (this.state.newClass.includes("-")) {
                            swal.fire(
                              "Error!",
                              `Class Could Not Contain "-"`,
                              "error"
                            );
                          } else {
                            this.setState({
                              class: this.state.class.concat([
                                { class: this.state.newClass }
                              ]),
                              inputClass: this.state.newClass,
                              newClass: ""
                            });
                          }
                        } else {
                          return null;
                        }
                      }}
                      style={{ marginBottom: "30px" }}
                    >
                      Create Class
                    </button>
                  </>
                )}
                <h6>Title</h6>
                <input
                  type="text"
                  value={this.state.title}
                  id="inputTitle"
                  onChange={e => this.handleChange(e)}
                />
                <h6>Episode</h6>
                <input
                  type="text"
                  id="inputEpisode"
                  value={this.state.inputEpisode}
                  onChange={e => this.handleChange(e)}
                />
                <h6>Category</h6>
                <select
                  value={this.state.inputCategory}
                  id="inputCategory"
                  onChange={e => {
                    this.handleChange(e);
                  }}
                >
                  {this.renderCategories()}
                </select>
                <h6>Description</h6>
                <textarea
                  value={this.state.inputDesc}
                  id="inputDesc"
                  onChange={e => this.handleChange(e)}
                />
                <button
                  onClick={e => {
                    e.preventDefault();
                    this.handleSubmit();
                  }}
                >
                  Submit
                </button>
              </form>
            </div>

            <div className="upload-upload">
              <h1>Your Uploads</h1>
              {this.renderUserVideos()}
            </div>
          </div>
        </div>
      );
    } else {
      return <Redirect to="/" />;
    }
  }
}

const mapStateToProps = state => {
  return {
    username: state.auth.username,
    role: state.auth.role,
    id: state.auth.id
  };
};
export default connect(
  mapStateToProps,
  null
)(Upload);
