import React, { Component } from 'react';
import './Checkout.css';
import Header from '../../common/header/Header';
import Main from './stepper/main/Main';

class Checkout extends Component {
    render() {
        if (sessionStorage.getItem("access-token") === null) {
            this.props.history.push("/");
        }
        return (
            <div>
                <Header baseUrl={this.props.baseUrl}
                    showCheckoutPage="checkout" />
                <Main props={this.props} baseUrl={this.props.baseUrl} />
            </div>
        )
    }
}

export default Checkout;
