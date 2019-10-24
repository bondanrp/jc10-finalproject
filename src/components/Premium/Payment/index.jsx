import React, { Component } from 'react'
import './payment.css'
import {Redirect} from 'react-router-dom'
import {connect} from 'react-redux'

export class Payment extends Component {
    render() {
        if(this.props.premium){
            return <Redirect to='/'></Redirect>
        }else{return (
            <div className='gray-background'>
                <div className='payment-container'>
                    <div className='payment-card'>
                        <form>
                            <input type="file"/>
                        </form>
                    </div>
                </div>
            </div>
        )
    }}
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
    mapStateToProps, null
  )(Payment);
  