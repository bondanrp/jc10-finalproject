import React, { Component } from "react";
import Axios from "axios";
import { timeSince, localTime } from "../../../functions";

import Swal from "sweetalert2";
const swalWithButtons = Swal.mixin({
  customClass: {
    confirmButton: "confirm-button",
    cancelButton: "cancel-button"
  },
  buttonsStyling: false
});
const urlApi = "http://localhost:3001/";
export class Payments extends Component {
  state = { data: [], bukti: "" };
  componentDidMount() {
    this.getData();
  }
  getData = () => {
    Axios.get(urlApi + "getpayments", { params: { type: 2 } }).then(res => {
      this.setState({ data: res.data });
    });
  };
  handleAccept = id => {
    swalWithButtons
      .fire({
        title: "Are you sure you want to accept this request?",
        text: "Please make sure the receipt is correct!",
        // type: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, accept!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true
      })
      .then(result => {
        if (result.value) {
          Axios.patch(urlApi + "premiumize", { type: "give", id }).then(res => {
            Axios.patch(urlApi + "acceptpayment", { id, type: 2 }).then(res => {
              this.getData();
              swalWithButtons.fire(
                "Accepted",
                "Your requested user has set to Premium."
              );
            });
          });
        }
      });
  };

  handleReject = id => {
    swalWithButtons
      .fire({
        title: "Are you sure you want to delete this request??",
        text: "You won't be able to revert this!",
        // type: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
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
                type: 2
              }).then(res => {
                Axios.patch(urlApi + "resetstatus", { id, type: 2 })
                  .then(res => {
                    this.getData();
                    swalWithButtons.fire(
                      "Deleted!",
                      "Your requested payment request has been deleted."
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
  mapPayments = x => {
    let render = this.state.data.map(val => {
      if (parseInt(val.status) === x) {
        return (
          <div className="admin-payment">
            <div>
              <img src={val.profilepict} alt="dp" />
              <h3>{val.username}</h3>
              <p>
                {val.firstname} {val.lastname}
              </p>
            </div>
            <div>
              <p>
                Tipe Paket:{" "}
                {parseInt(val.content1) === 1
                  ? "Harian"
                  : parseInt(val.content1) === 2
                  ? "Bulanan"
                  : "Tahunan"}
              </p>
              <p>
                Pembayaran dengan:{" "}
                {parseInt(val.content2) === 1
                  ? "BCA"
                  : parseInt(val.content2) === 2
                  ? "Mandiri"
                  : parseInt(val.content2) === 3
                  ? "BRI"
                  : "BNI"}
              </p>
              <p>
                Dibayarkan Pada: {localTime(val.timestamp)} (
                {timeSince(val.timestamp)})
              </p>
              <p
                className="bukti-text"
                onClick={() => {
                  this.state.bukti === val.id
                    ? this.setState({ bukti: "" })
                    : this.setState({ bukti: val.id });
                }}
              >
                <strong>Bukti Pembayaran</strong>
              </p>
              {this.state.bukti === val.id ? (
                <img className="bukti" src={val.attachment} alt="bukti" />
              ) : null}
            </div>
            {parseInt(val.status) === 0 ? (
              <div className="admin-payment-button">
                <button
                  className="premiumize"
                  onClick={() => this.handleAccept(val.user_id)}
                >
                  Accept
                </button>
                <button
                  className="unpremiumize"
                  onClick={() => {
                    this.handleReject(parseInt(val.user_id));
                  }}
                >
                  Reject
                </button>
              </div>
            ) : val.status === 1 ? (
              <div className="admin-payment-button">
                <h3>Accepted</h3>
              </div>
            ) : (
              <div className="admin-payment-button">
                <h3 style={{ color: "red" }}>Rejected</h3>
                <p style={{ textAlign: "justify", fontFamily: "monospace" }}>
                  {val.info}
                </p>
              </div>
            )}
          </div>
        );
      } else return null;
    });

    return render;
  };

  render() {
    return (
      <div className="admin-box">
        <h1 className="admin-title"> Payments</h1>
        <h2>Received</h2>
        {this.mapPayments(0)}
        <h2>Accepted</h2>
        {this.mapPayments(1)}
        <h2>Rejected</h2>
        {this.mapPayments(2)}
      </div>
    );
  }
}

export default Payments;
