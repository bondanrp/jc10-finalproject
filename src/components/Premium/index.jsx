import React, { Component } from 'react'
import './premium.css'
import {Redirect} from 'react-router-dom'
import {connect} from 'react-redux'

export class Premium extends Component {
    state={
        redirectLogin:false,
        redirectPremiumPayment:false
    }
    redirectLogin = ()=>{
        this.setState({redirectLogin: true})
    }
    redirectPremiumPayment = ()=>{
        this.setState({redirectPremiumPayment: true})
    }
    render() {
if(this.state.redirectLogin){return <Redirect to='/login'></Redirect>}
else if(this.state.redirectPremiumPayment){return <Redirect to='/premium/payment'></Redirect>}
else{
        return (
            <div className="gray-background">
                <div className='premium-header'>
                    <div>
                    <h2>Beralih ke Premium.</h2>
                    <h2>Dapatkan Akses Kelas Tidak Terbatas.</h2></div>
                </div>
                <div className="premium-container">
                    <h2 className='premium-title'>Mengapa Beralih ke Premium?</h2>
                    <div className='premium-desc'><h2>Akses</h2>
                    <div><h3>Komentar</h3>
                    <p>Berbagi dan berdiskusi dengan kolom komentar</p></div>
                    <div><h3>Subscribe to Teachers</h3>
                    <p>Mendapatkan notifikasi upload terbaru</p></div>
                    <div><h3>Akses Kelas</h3>
                    <p>Kemampuan mengakses video</p></div>
                    </div>
                    <div className='premium-free'><h2>Free</h2>
                    <h3>✘</h3>
                    <h3>✘</h3>
                    <h3>3 Video/Kelas</h3>
                    </div>
                    <div className='premium-premium'><h2>Premium</h2>
                    <h3>✔</h3>
                    <h3>✔</h3>
                    <h3>Unlimited</h3>
                    </div>
                    <div className='premium-button-container'>
                <button className='premium-button' onClick={!this.props.username ? this.redirectLogin : this.redirectPremiumPayment}>Daftar Sekarang</button>
                </div></div>
            </div>
        )
    }
}}


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
    mapStateToProps, null
  )(Premium);
  