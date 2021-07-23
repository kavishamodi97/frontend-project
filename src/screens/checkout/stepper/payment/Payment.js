import React, { Component } from 'react';
import './Payment.css';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

// Payment Section UI
class Payment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            paymentMethods: [],
            selectedPaymentMode: ""
        }
        this.handleChange = this.handleChange.bind(this);
    }

    // Fetch Payment Modes Before Rendering Component
    UNSAFE_componentWillMount() {
        this.props.handleSteps(false)
        this.getPaymentMethods();
    }

    // Fetch Payment Modes Using Ajax Calls
    getPaymentMethods() {
        let xhr = new XMLHttpRequest();
        let that = this;

        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                that.setState({ paymentMethods: JSON.parse(this.responseText).paymentMethods });
            }
        });

        let url = `${this.props.baseUrl}/payment`;
        xhr.open('GET', url);
        xhr.setRequestHeader("Cache-Control", "no-cache");
        xhr.send();
    }

    // Radio Button Group Change Handler
    handleChange(event) {
        this.setState({
            selectedPaymentMode: event.target.value
        })
        this.props.setPaymentMethod(event.target.value)
        this.props.handleSteps(true)
    }

    // Render Payment Modes Into RadioGroup
    render() {
        const { paymentMethods } = this.state;
        return (
            <form>
                <FormControl component="fieldset">
                    <FormLabel component="legend">Select Mode of Payment</FormLabel>
                    <RadioGroup aria-label="paymentMode" name="paymentMode" onChange={this.handleChange}>
                        {paymentMethods.length > 0 && paymentMethods.map((paymentMethod, index) => {
                            return (
                                <FormControlLabel key={index} value={paymentMethod.id} control={<Radio />} label={paymentMethod.payment_name} />
                            )
                        })}
                    </RadioGroup>
                </FormControl>
            </form>
        )
    }
}

export default Payment;