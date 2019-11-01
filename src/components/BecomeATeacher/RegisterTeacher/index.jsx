import React, { Component } from "react";
import { connect } from "react-redux";
import Axios from "axios";
import "./RegisterTeacher.css";
import swal from "sweetalert2";

let urlApi = "http://localhost:3001/";
export class RegisterTeacher extends Component {
  state = {
    firstname: "",
    lastname: "",
    refresh: true,
    checked: false,
    experiences: "",
    reason: "",
    selectedFile: "",
    CV: "",
    toggleTerms: false
  };
  componentWillMount() {
    if (this.props.username) {
      this.getData();
    }
  }
  componentDidUpdate(prevProps, nextProps) {
    if (this.props.username !== prevProps.username) {
      this.getData();
    }
  }

  getData = () => {
    this.setState({ refresh: false });
    Axios.get(urlApi + "getusername", {
      params: { username: this.props.username }
    }).then(res => {
      this.setState({
        firstname: res.data[0].firstname,
        lastname: res.data[0].lastname
      });
    });
  };

  handleUploadCV = e => {
    let format = e.target.files[0].name.split(".")[1];
    if (format === "pdf") {
      this.setState({
        selectedFile: e.target.files[0],
        edit: true
      });
      var fd = new FormData();
      fd.append("cv", e.target.files[0], e.target.files[0].name);
      Axios.post(urlApi + "uploadcv", fd)
        .then(res => {
          console.log(res);
          let hasil = urlApi + "files/cv/" + res.data.filename;
          console.log(hasil);
          this.setState({ CV: hasil });
          swal.fire("Success", "CV Uploaded!", "success");
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      swal.fire("Error", "File format must be PDF", "error");
    }
  };
  handleSubmit = () => {
    if (this.state.experiences && this.state.reason && this.state.CV) {
      Axios.post(urlApi + "registerteacher", {
        id: this.props.id,
        content1: this.state.experiences,
        content2: this.state.reason,
        attachment: this.state.CV
      }).then(res => {
        swal.fire(
          "Success!",
          "Your Application have been submitted! Please wait for a response.",
          "success"
        );
      });
    } else {
      swal.fire("error", "Please fill out all of the forms", "error");
    }
  };
  handleChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };
  termsModal = () => {
    this.setState({ termsModal: !this.state.termsModal });
  };
  render() {
    return (
      <div className="gray-background">
        <div className="register-teacher-container">
          <div className="register-teacher-card">
            <div className="register-teacher-content">
              <p>First Name</p>
              <input
                type="text"
                value={this.state.firstname}
                disabled
                className="text-capitalize"
              />
              <p>Last Name</p>
              <input
                type="text"
                value={this.state.lastname}
                disabled
                className="text-capitalize"
              />
              <p>Experiences</p>
              <textarea
                value={this.state.experiences}
                onChange={e => this.handleChange(e)}
                id="experiences"
                maxLength="200"
                placeholder="Tell us your experiences! (200 words)"
              ></textarea>
              <p>Why do you want to join us?</p>
              <textarea
                value={this.state.reason}
                onChange={e => this.handleChange(e)}
                id="reason"
                maxLength="200"
                placeholder="Tell us why do you want to join! (200 words)"
              ></textarea>
              <p>Please Upload your CV (PDF)</p>
              <div className="register-teacher-input-file">
                <input onChange={this.handleUploadCV} type="file" />
              </div>
              <div className="register-teacher-terms">
                <input
                  onChange={e => {
                    this.setState({ check: e.target.checked });
                  }}
                  type="checkbox"
                  name=""
                  id=""
                />
                <span>
                  {" "}
                  I have read and agreed to Bagi Bakat's
                  <button onClick={this.termsModal}>terms of services</button>
                </span>
              </div>
              <div>
                <button
                  disabled={!this.state.check}
                  onClick={this.handleSubmit}
                >
                  Submit
                </button>
              </div>
            </div>
            <div></div>
          </div>
        </div>
        {this.state.termsModal ? (
          <div className="registerTeacherModal-bg">
            <div className="registerTeacherModal-container">
              <div
                className="registerTeacherModal-close"
                onClick={this.termsModal}
              >
                close
              </div>
              <div>
                <h2>TERMS OF SERVICES</h2>
                <p>
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                  Facilis veniam nemo perferendis voluptas dolore voluptatem
                  tenetur ipsa consequuntur quos corrupti!
                </p>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Minima velit culpa accusamus eos optio distinctio fuga,
                  corporis eligendi error adipisci, doloribus fugiat? Adipisci
                  libero id deleniti ipsam fuga quis repellendus architecto,
                  natus explicabo sunt laudantium nemo, pariatur itaque dolor
                  odit perspiciatis expedita? Beatae architecto a dignissimos
                  perferendis sunt delectus, nesciunt, nostrum quibusdam
                  deleniti aperiam rem provident ducimus quis tenetur minus
                  obcaecati, enim quos corrupti voluptates esse quisquam ea
                  assumenda. Iste.
                </p>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Veniam explicabo officia accusantium. Voluptatem a ullam porro
                  adipisci doloribus sapiente repellendus?
                </p>
                <p>
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                  Blanditiis corporis deserunt enim iure numquam, repudiandae
                  nemo nihil molestias magnam sed esse iusto, ab vitae incidunt
                  maxime quidem fugit accusamus dignissimos, aspernatur itaque!
                  Fugit, laudantium? Fuga quaerat saepe, delectus ullam
                  adipisci, modi, libero nulla fugiat mollitia harum hic! Sequi
                  soluta molestias atque animi sit ut recusandae iure modi
                  repudiandae aliquam maiores, minus nulla quis ex distinctio
                  illo sint nesciunt! Ducimus, ratione?
                </p>
                <p>
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                  Blanditiis corporis deserunt enim iure numquam, repudiandae
                  nemo nihil molestias magnam sed esse iusto, ab vitae incidunt
                  maxime quidem fugit accusamus dignissimos, aspernatur itaque!
                  Fugit, laudantium? Fuga quaerat saepe, delectus ullam
                  adipisci, modi, libero nulla fugiat mollitia harum hic! Sequi
                  soluta molestias atque animi sit ut recusandae iure modi
                  repudiandae aliquam maiores, minus nulla quis ex distinctio
                  illo sint nesciunt! Ducimus, ratione?
                </p>
                <p>
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                  Blanditiis corporis deserunt enim iure numquam, repudiandae
                  nemo nihil molestias magnam sed esse iusto, ab vitae incidunt
                  maxime quidem fugit accusamus dignissimos, aspernatur itaque!
                  Fugit, laudantium? Fuga quaerat saepe, delectus ullam
                  adipisci, modi, libero nulla fugiat mollitia harum hic! Sequi
                  soluta molestias atque animi sit ut recusandae iure modi
                  repudiandae aliquam maiores, minus nulla quis ex distinctio
                  illo sint nesciunt! Ducimus, ratione?
                </p>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    username: state.auth.username,
    id: state.auth.id,
    profilepict: state.auth.profilepict,
    role: state.auth.role
  };
};
export default connect(
  mapStateToProps,
  null
)(RegisterTeacher);
