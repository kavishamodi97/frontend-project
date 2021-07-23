import React, { Component } from 'react';
import './OrderSummary.css';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Snackbar from '@material-ui/core/Snackbar';
import CloseIcon from '@material-ui/icons/Close';
import 'font-awesome/css/font-awesome.min.css';

class OrderSummary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cartItems: [],
            totalCartaValue: "",
            resturantName: "",
            quantity: "",
        }
    }

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

    handleClose = () => this.setState({ open: false })

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

        fetch(`${this.props.baseUrl}/order`, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                'authorization': sessionStorage.getItem("access-token"),
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .then(res => {
                this.setState({
                    paymentMethods: res.paymentMethods
                })
            })
    }

    render() {
        const { cartItems, quantity, totalCartValue, resturantName } = this.state;
        return (
            <div>
                <Card className="order-summary-container" variant="outlined">
                    <CardHeader
                        title="Summary"
                    />
                    <CardContent className="card-content-main">
                        <Typography component="p" className="resturant-name">{resturantName}</Typography>
                        {cartItems.map((itemObj, itemobjindex) => (
                            <div className="cart-item" key={"cart-items" + itemobjindex}>
                                <div className="item item-2">
                                    {itemObj.item_type === 'VEG' ?
                                        <i className="fa fa-stop-circle-o item item1" aria-hidden="true" style={{ color: 'green', marginRight: '15px' }}></i> :
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
                    }>
                </Snackbar>
            </div>
        )
    }
}

export default OrderSummary;
