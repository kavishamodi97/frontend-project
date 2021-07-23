import React, { Component } from 'react';
import './Checkout.css';
import Header from '../../common/header/Header';
import Main from './stepper/main/Main';

// Checkout Section UI
class Checkout extends Component {
    render() {
        if (sessionStorage.getItem("access-token") === null) {
            this.props.history.push("/");
        }
        return (
            <div>
                <Header baseUrl={this.props.baseUrl}
                    showCheckoutPage="checkout" />
                {/*Rendering Delivery And Payment Stepper */}
                <Main props={this.props} baseUrl={this.props.baseUrl} />
            </div>
        )
    }
}

export default Checkout;
