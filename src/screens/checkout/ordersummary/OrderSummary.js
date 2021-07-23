import React, { Component } from 'react';
import './OrderSummary.css';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Snackbar from '@material-ui/core/Snackbar';
import CloseIcon from '@material-ui/icons/Close';
import 'font-awesome/css/font-awesome.min.css';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';

// Order Summary Section
class OrderSummary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cartItems: [],
            quantity: "",
            totalCartaValue: "",
            resturantName: ""
        }
        this.clickCheckOutHandler = this.clickCheckOutHandler.bind(this);
    }

    // Fetch Data Before Rendering Component
    componentDidMount() {
        const { cartItems, quantity, totalCartValue, resturantName, resturantId } = this.props.props.props.history.location.state;
        this.setState({
            cartItems,
            quantity,
            totalCartValue,
            resturantName,
            resturantId
        })
    }

    // Close Snackbar
    handleClose = () => this.setState({ open: false })

    // Checkout Button Click Handler
    clickCheckOutHandler() {
        const { paymentId, addressId } = this.props;
        const { totalCartValue, cartItems, quantity, resturantId } = this.state;
        const itemQuantities = cartItems.map((item, index) => {
            return {
                item_id: item.id,
                price: item.price,
                quantity: quantity[index]
            }
        })
        const payload = {
            address_id: addressId,
            payment_id: paymentId,
            bill: totalCartValue,
            coupon_id: "",
            discount: 0,
            item_quantities: itemQuantities,
            restaurant_id: resturantId
        }
        if (!addressId) {
            this.setState({
                open: true,
                message: 'Please select a address to continue.'
            })
            return;
        }

        if (!paymentId) {
            this.setState({
                open: true,
                message: 'Please select a payment mode and then place order.'
            })
            return;
        }

        /* Place oder Into 'restaurantdb Using Ajax Calls */
        let token = sessionStorage.getItem('access-token');
        let xhr = new XMLHttpRequest();
        let that = this;

        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                if (this.status === 201) {
                    let orderId = JSON.parse(this.responseText).id;
                    that.setState({
                        message: 'Order placed successfully! Your order ID is ' + orderId,
                        open: true
                    });
                } else {
                    that.setState({
                        message: 'Unable to place your order! Please try again!',
                        open: true
                    });
                    console.clear();
                }
            }
        }
        );

        let url = this.props.baseUrl + 'order';
        xhr.open('POST', url);
        xhr.setRequestHeader('authorization', 'Bearer ' + token);
        xhr.setRequestHeader("Cache-Control", "no-cache");
        xhr.setRequestHeader('content-type', 'application/json');
        xhr.send(JSON.stringify(payload));
    }

    // Render Order Summary UI Into Card
    render() {
        const { cartItems, quantity, totalCartValue, resturantName } = this.state;
        return (
            <>
                <Card className="summary-main">
                    <CardHeader title={"Summary"}
                    ></CardHeader>
                    <CardContent className="card-content-checkout">
                        <Typography component="p" className="resturant-name">{resturantName}</Typography>
                        {cartItems.map((itemObj, itemobjindex) => (
                            <div className="cart-item" key={"cartcontent-" + itemobjindex}>
                                <div className="item item-2">
                                    {itemObj.item_type === 'VEG' ? <i className="fa fa-stop-circle-o item item1" aria-hidden="true" style={{ color: 'green', marginRight: '15px' }}></i> :
                                        <i className="fa fa-stop-circle-o item" aria-hidden="true" style={{ color: 'red', marginRight: '15px' }}></i>}
                                    <Typography className="item" variant="span">{itemObj.item_name.toUpperCase()}</Typography>
                                </div>
                                <Typography className="item" variant="span">{quantity[itemobjindex]}</Typography>
                                <Typography className="item" variant="span">{itemObj.price}</Typography>
                            </div>
                        ))}
                    </CardContent>
                    <Divider style={{ width: '90%', margin: "0 auto" }} />
                    <CardContent>
                        <div className="total-amount">
                            <span>NET AMOUNT</span>
                            <span><i class="fa fa-rupee"></i>{totalCartValue}</span>
                        </div>
                    </CardContent>
                    <CardContent>
                        <Button variant="contained" color="primary" fullWidth='true' size='medium' onClick={this.clickCheckOutHandler}>
                            Place Order
                        </Button>
                    </CardContent>
                </Card>
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    open={this.state.open}
                    autoHideDuration={60000}
                    onClose={this.handleClose}
                    message={this.state.message}
                    action={
                        <IconButton size="small" ariaLabel="close" color="inherit" onClick={this.handleClose}>
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    }></Snackbar>
            </>
        )
    }
}

export default OrderSummary;
