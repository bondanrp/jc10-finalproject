import React, { Component } from "react";
import "./payment.css";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import Axios from "axios";
import swal from "sweetalert2";

var urlApi = "http://localhost:3001/";
export class Payment extends Component {
  state = {
    firstname: "",
    lastname: "",
    paket: 0,
    bank: 0,
    selectedFile: "",
    bukti: "",
    loading: true,
    status: 0,
    hapus: "",
    img: ""
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
        lastname: res.data[0].lastname,
        status: res.data[0].statusdaftarpremium,
        loading: false
      });
    });
  };
  renderPaket = () => {
    if (parseInt(this.state.paket) === 1) {
      return (
        <div className="payment-paket">
          <h3>Total Pembayaran:</h3>
          <h2> Rp.9,000/Hari</h2>
          <span>Lebih hemat dengan berlangganan per bulan / per tahun!</span>
        </div>
      );
    }
    if (parseInt(this.state.paket) === 2) {
      return (
        <div className="payment-paket">
          <h3>Total Pembayaran:</h3>
          <h2> Rp.99,000/Bulan</h2>
          <span>Lebih hemat dengan berlangganan per tahun!</span>
        </div>
      );
    }
    if (parseInt(this.state.paket) === 3) {
      return (
        <div className="payment-paket">
          <h3>Total Pembayaran:</h3>
          <h2> Rp.999,000/Tahun</h2>
          <span style={{ color: "green" }}>Paket paling hemat!</span>
        </div>
      );
    }
  };
  renderRekening = () => {
    if (parseInt(this.state.bank) === 1) {
      return (
        <div className="payment-paket">
          <h3>Rekening Bank BCA</h3>
          <h2>1234-5678-9012</h2>
          <p>Petunjuk Transfer: </p>
          <br />
          <p>
            1. Lorem ipsum, dolor sit amet consectetur adipisicing elit.
            Delectus culpa nisi excepturi magnam eaque aspernatur ducimus autem
            rerum itaque amet?
            <br />
            <br />
            2. Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ea, id
            iusto non pariatur illo nostrum culpa, fuga vero qui magnam
            repudiandae doloremque, temporibus in earum consequuntur nesciunt.
            Rerum, nemo aperiam?
          </p>
        </div>
      );
    }
    if (parseInt(this.state.bank) === 2) {
      return (
        <div className="payment-paket">
          <h3>Rekening Bank Mandiri:</h3>
          <h2>7890-3456-1290</h2>
          <p>Petunjuk Transfer: </p>
          <br />
          <p>
            1. Lorem ipsum, dolor sit amet consectetur adipisicing elit.
            Delectus culpa nisi excepturi magnam eaque aspernatur ducimus autem
            rerum itaque amet?
            <br />
            <br />
            2. Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ea, id
            iusto non pariatur illo nostrum culpa, fuga vero qui magnam
            repudiandae doloremque, temporibus in earum consequuntur nesciunt.
            Rerum, nemo aperiam?
          </p>
        </div>
      );
    }
    if (parseInt(this.state.bank) === 3) {
      return (
        <div className="payment-paket">
          <h3>Rekening Bank BRI:</h3>
          <h2>7766-2233-1123</h2>
          <p>Petunjuk Transfer: </p>
          <br />
          <p>
            1. Lorem ipsum, dolor sit amet consectetur adipisicing elit.
            Delectus culpa nisi excepturi magnam eaque aspernatur ducimus autem
            rerum itaque amet?
            <br />
            <br />
            2. Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ea, id
            iusto non pariatur illo nostrum culpa, fuga vero qui magnam
            repudiandae doloremque, temporibus in earum consequuntur nesciunt.
            Rerum, nemo aperiam?
          </p>
        </div>
      );
    }
    if (parseInt(this.state.bank) === 4) {
      return (
        <div className="payment-paket">
          <h3>Rekening Bank BNI:</h3>
          <h2>9184-1258-2839</h2>
          <p>Petunjuk Transfer: </p>
          <br />
          <p>
            1. Lorem ipsum, dolor sit amet consectetur adipisicing elit.
            Delectus culpa nisi excepturi magnam eaque aspernatur ducimus autem
            rerum itaque amet?
            <br />
            <br />
            2. Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ea, id
            iusto non pariatur illo nostrum culpa, fuga vero qui magnam
            repudiandae doloremque, temporibus in earum consequuntur nesciunt.
            Rerum, nemo aperiam?
          </p>
        </div>
      );
    }
  };
  handleUploadPayment = e => {
    let format = e.target.files[0].name.split(".")[1];
    if (format === "jpg" || format === "jpeg" || format === "png") {
      this.setState({
        // selectedFile: e.target.files[0]
        selectedFile: e.target.files[0],
        img: URL.createObjectURL(e.target.files[0])
      });
    } else {
      swal.fire("Error", "File format must be jpg/png", "error");
    }
  };
  handleSubmit = () => {
    if (!this.state.selectedFile) {
      swal.fire(
        "Error",
        "Mohon Upload Bukti Pembayaran Sesuai Ketentuan",
        "error"
      );
    } else {
      var fd = new FormData();
      fd.append(
        "payment",
        this.state.selectedFile,
        this.state.selectedFile.name
      );
      Axios.post(urlApi + "uploadpayment", fd)
        .then(res => {
          console.log(res);
          let hasil = urlApi + "files/payment/" + res.data.filename;
          Axios.post(urlApi + "registerpremium", {
            id: this.props.id,
            content1: this.state.paket,
            content2: this.state.bank,
            attachment: hasil
          }).then(res => {
            // PAYMENT STATUS
            Axios.post(urlApi + "registerpremiumnotification", {
              id: this.props.id
            });
            this.getData();
            swal.fire(
              "Success",
              "Mohon tunggu beberapa saat untuk konfirmasi pembayaran",
              "success"
            );
          });
        })
        .catch(err => {
          console.log(err);
        });
    }
  };

  render() {
    if (this.state.loading) {
      return (
        <div className="gray-background">
          <h1 style={{ textAlign: "center", paddingTop: 300 }}>loading...</h1>
        </div>
      );
    } else if (!this.props.username) {
      return <Redirect to="/login" />;
    } else if (!this.state.status) {
      return (
        <div className="gray-background">
          <div className="payment-container">
            <div className="payment-card">
              <h3 className="payment-title">Payment Instructions</h3>
              <div className="payment-instruction">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Dignissimos, debitis, eum vero quos facilis nostrum possimus
                nulla assumenda voluptatibus adipisci eaque ratione officiis
                ullam maiores est nam voluptate, odio itaque. Saepe voluptate
                suscipit eveniet ratione, exercitationem dolorum fugiat ullam
                porro?
              </div>
              <hr />
              <p>Pilih Paket Berlangganan</p>
              <select
                className="payment-options"
                onChange={e => {
                  this.setState({ paket: e.target.value });
                  if (!e.target.value) {
                    this.setState({ bank: "" });
                  }

                  console.log(this.state.paket);
                }}
              >
                <option value="">---</option>
                <option value={1}>Harian</option>
                <option value={2}>Bulanan</option>
                <option value={3}>Tahunan</option>
              </select>
              {this.renderPaket()}
              <hr />
              {this.state.paket ? (
                <>
                  <p>Pilih Metode Pembayaran</p>
                  <select
                    className="payment-options"
                    onChange={e => {
                      this.setState({ bank: e.target.value });
                    }}
                  >
                    <option value="">----</option>
                    <option value={1}>BCA</option>
                    <option value={2}>Mandiri</option>
                    <option value={3}>BRI</option>
                    <option value={4}>BNI</option>
                  </select>
                  {this.renderRekening()}
                  <hr />
                </>
              ) : null}
              {this.state.paket && this.state.bank ? (
                <>
                  <form>
                    <h3 className="payment-title">Konfirmasi Pembayaran</h3>
                    <div className="payment-name">
                      <div>
                        <p>First Name</p>
                        <input
                          className="text-capitalize"
                          type="text"
                          value={this.state.firstname}
                          disabled
                        />
                      </div>
                      <div>
                        <p>Last Name</p>
                        <input
                          className="text-capitalize"
                          type="text"
                          value={this.state.lastname}
                          disabled
                        />
                      </div>
                    </div>
                    <br />
                    <p>Upload Bukti Pembayaran (JPG, PNG)</p>
                    <div className="payment-input">
                      {this.state.selectedFile ? (
                        <>
                          <img
                            src={this.state.img}
                            alt="bukti"
                            className="payment-bukti"
                          />
                          <div
                            className="payment-x"
                            onClick={() => {
                              this.setState({ img: "", selectedFile: "" });
                            }}
                          >
                            X
                          </div>
                        </>
                      ) : (
                        <input
                          type="file"
                          onChange={this.handleUploadPayment}
                        />
                      )}
                    </div>
                    <div className="payment-button">
                      <button
                        onClick={e => {
                          e.preventDefault();
                          this.handleSubmit();
                        }}
                      >
                        Submit
                      </button>
                    </div>
                  </form>
                </>
              ) : null}
            </div>
          </div>
        </div>
      );
    } else if (this.state.status === 1) {
      return (
        <div className="gray-background">
          <div className="payment-container">
            <div className="payment-card">
              <h3 className="payment-title">Please Wait</h3>
              <div className="payment-instruction">
                Pembayaran anda sedang dikonfirmasi oleh tim terkait (Max. 2 x
                24 Jam).
                <br />
                <hr />
                Mohon hubungi <strong>support@bagibakat.com</strong> jika
                memerlukan bantuan lebih lanjut.
              </div>
            </div>
          </div>
        </div>
      );
    } else if (this.state.status === 2 || this.props.premium) {
      return (
        <div className="gray-background">
          <div className="payment-container">
            <div className="payment-card">
              <h3 className="admin-title">Premium</h3>
              <div className="payment-instruction">
                Anda sudah terdaftar sebagai akun premium!{" "}
                {this.props.role === "teacher"
                  ? "Bagi Bakat Premium merupakan bagian dari program teacher kami."
                  : "Pembayaran anda sudah diterima oleh tim kami."}
                <br />
                <hr />
                Silahkan menikmati Bagi Bakat Premium!
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}
const mapStateToProps = state => {
  return {
    username: state.auth.username,
    id: state.auth.id,
    profilepict: state.auth.profilepict,
    role: state.auth.role,
    premium: state.auth.premium
  };
};
export default connect(
  mapStateToProps,
  null
)(Payment);
