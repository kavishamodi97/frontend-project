import React, { Component } from 'react';
import './Checkout.css';
import Header from '../../common/header/Header';

class Checkout extends Component {
    render() {
        if (sessionStorage.getItem("access-token") === null) {
            this.props.history.push("/");
        }
        return (
            <div>
                <Header baseUrl={this.props.baseUrl}
                    showCheckoutPage="checkout" />
            </div>
        )
    }
}

export default Checkout;
