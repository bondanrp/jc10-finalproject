import React, { Component } from "react";
import Axios from "axios";
import { timeSince, localTime } from "../../../functions/index";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
const swalWithButtons = Swal.mixin({
  customClass: {
    confirmButton: "confirm-button",
    cancelButton: "cancel-button"
  },
  buttonsStyling: false
});

const urlApi = "http://localhost:3001/";
export class Applications extends Component {
  state = { data: [] };
  componentDidMount() {
    this.getData();
  }

  getData = () => {
    Axios.get(urlApi + "getpayments", { params: { type: 1 } }).then(res => {
      this.setState({ data: res.data, CV: "" });
    });
  };

  handleAccept = id => {
    swalWithButtons
      .fire({
        title: "Are you sure you want to accept this request?",
        text: "Please make sure the person is correct!",
        // type: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, accept!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true
      })
      .then(result => {
        if (result.value) {
          Axios.patch(urlApi + "maketeacher", { id }).then(res => {
            Axios.patch(urlApi + "acceptpayment", { id, type: 1 }).then(res => {
              this.getData();
              swalWithButtons.fire(
                "Accepted",
                "Your requested user has set to Teacher."
              );
            });
          });
        }
      });
  };
  handleReject = id => {
    swalWithButtons
      .fire({
        title: "Are you sure you want to reject this request??",
        text: "You won't be able to revert this!",
        // type: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, reject it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true
      })
      .then(result => {
        if (result.value) {
          swalWithButtons.fire({
            title: "Please enter the reason for rejecting this request!",
            input: "text",
            inputAttributes: {
              autocapitalize: "off"
            },
            showCancelButton: true,
            confirmButtonText: "Reject",
            showLoaderOnConfirm: true,
            preConfirm: reason => {
              Axios.patch(urlApi + "deletepayment", {
                id,
                reason,
                type: 1
              }).then(res => {
                Axios.patch(urlApi + "resetstatus", { id, type: 1 })
                  .then(res => {
                    this.getData();
                    swalWithButtons.fire(
                      "Deleted!",
                      "Your requested teacher application has been rejected."
                    );
                  })
                  .catch(error => {
                    Swal.showValidationMessage(`Request failed: ${error}`);
                  });
              });
            }
          });
        }
      });
  };
  mapApplications = x => {
    let render = this.state.data.map(val => {
      if (parseInt(val.status) === x) {
        return (
          <>
            <div className="admin-payment">
              <div>
                <img src={val.profilepict} alt="dp" />
                <h3>{val.username}</h3>
                <p>
                  {val.firstname} {val.lastname}
                </p>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start"
                }}
              >
                <p>
                  Mendaftar Pada: {localTime(val.timestamp)} (
                  {timeSince(val.timestamp)})
                </p>
              </div>
              {parseInt(val.status) === 0 ? (
                <div className="admin-payment-button">
                  <button
                    className="premiumize"
                    onClick={() => {
                      this.state.CV === val.id
                        ? this.setState({ CV: "" })
                        : this.setState({ CV: val.id });
                    }}
                  >
                    Show Info
                  </button>
                </div>
              ) : val.status === 1 ? (
                <div className="admin-payment-button">
                  <h3>Accepted</h3>
                  <button
                    className="premiumize"
                    onClick={() => {
                      this.state.CV === val.id
                        ? this.setState({ CV: "" })
                        : this.setState({ CV: val.id });
                    }}
                  >
                    Show Info
                  </button>
                </div>
              ) : (
                <div className="admin-payment-button">
                  <h3 style={{ color: "red" }}>Rejected</h3>
                  <p style={{ textAlign: "justify", fontFamily: "monospace" }}>
                    {val.info}
                  </p>
                  <button
                    className="premiumize"
                    onClick={() => {
                      this.state.CV === val.id
                        ? this.setState({ CV: "" })
                        : this.setState({ CV: val.id });
                    }}
                  >
                    Show Info
                  </button>
                </div>
              )}
            </div>
            <div className={this.state.CV === val.id ? "app-info" : "d-none"}>
              <img
                src={val.profilepict}
                alt="dp"
                style={{ width: "200px", padding: "20px 0" }}
              />
              <h2 style={{ textDecoration: "underline 2px solid #017a84" }}>
                {val.username}
              </h2>
              <Link to={`/browse/user/${val.username}`} className="linkaja">
                <strong>Profile Link</strong>
              </Link>
              <br />
              <br />
              <div className="app-data">
                <p>First Name </p>
                <p>:</p>
                <p>{val.firstname}</p>
                <p>Last Name </p>
                <p>:</p>
                <p> {val.lastname}</p>
                <p>Email </p>
                <p>:</p>
                <p> {val.email}</p>
                <p>Experiences </p>
                <p>:</p>
                <p> {val.content1}</p>
                <p>Reason to Apply </p>
                <p>:</p>
                <p> {val.content2}</p>
              </div>
              <hr />
              <object
                width="100%"
                height="1000"
                data={val.attachment}
                type="application/pdf"
              >
                CV
              </object>
              <br />
              <hr />
              <div className="text-right py-5">
                <button
                  className="premiumize"
                  onClick={() => {
                    this.handleAccept(parseInt(val.user_id));
                  }}
                >
                  Accept
                </button>
                <button
                  onClick={() => {
                    this.handleReject(parseInt(val.user_id));
                  }}
                  style={{ marginLeft: "20px" }}
                  className="unpremiumize"
                >
                  Reject
                </button>
              </div>
            </div>
          </>
        );
      } else return null;
    });

    return render;
  };
  render() {
    return (
      <div className="admin-box">
        <h1 className="admin-title"> Teacher Applications</h1>
        <h2>Recieved</h2>
        {this.mapApplications(0)}
        <h2>Accepted</h2>
        {this.mapApplications(1)}
        <h2>Rejected</h2>
        {this.mapApplications(2)}
      </div>
    );
  }
}

export default Applications;
