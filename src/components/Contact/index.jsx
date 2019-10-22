import React, { Component } from "react";
import "./contact.css";
import Axios from "axios";

const urlApi = "http://localhost:3001/";
export class Contact extends Component {
  state = { firstName: "", lastName: "", email: "", content: "" };
  handleChange = event => {
    this.setState({ [event.target.id]: event.target.value });
  };

  handleSubmit = () => {
    if (
      this.state.firstName.length > 0 &&
      this.state.lastName.length > 0 &&
      this.state.email.length > 0 &&
      this.state.content.length > 0
    ) {
      if (this.state.email.includes("@") && this.state.email.includes(".")) {
        let { firstName, lastName, email, content } = this.state;
        Axios.get(urlApi + "contact", {
          params: { firstName, lastName, email, content }
        }).then(res => {
          alert(
            "Your question has been sent to our admin! Please wait for a reply in your email"
          );
        });
      } else {
        alert("Please insert a correct email address");
      }
    } else {
      alert("Please fill out the forms!");
    }
  };
  render() {
    return (
      <div className="gray-background">
        <div className="contact-bg"></div>
        <div className="contact">
          <h1>Contact Us</h1>
          <div className="contact-container">
            <input
              type="text"
              id="firstName"
              placeholder="First Name"
              value={this.state.firstName}
              onChange={this.handleChange}
            />
            <input
              type="text"
              id="lastName"
              placeholder="Last Name"
              value={this.state.lastName}
              onChange={this.handleChange}
            />
            <input
              type="email"
              id="email"
              placeholder="What's your email"
              value={this.state.email}
              onChange={this.handleChange}
            />
            <textarea
              id="content"
              placeholder="Your question"
              value={this.state.content}
              onChange={this.handleChange}
            />
            <button onClick={this.handleSubmit}>Submit</button>
          </div>
          <div className="contact-other">
            <h3>Other ways to connect:</h3>
            <p>Main Office:</p>
            <p>
              Jalan Jauh IV Nomor 5, Cilandak Barat, Jakarta Selatan, Jakarta
              12430
            </p>
            <br />
            <p>Call Center:</p>
            <p>0899-9999-9999</p>
            <p>Monday - Friday</p>
            <p>8AM - 5PM</p>
          </div>
        </div>
      </div>
    );
  }
}

export default Contact;
