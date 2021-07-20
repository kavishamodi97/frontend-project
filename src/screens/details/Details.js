import React, { Component } from 'react';
import './Details.css';
import Header from '../../common/header/Header';
import Typography from '@material-ui/core/Typography';
import 'font-awesome/css/font-awesome.min.css';
import Divider from '@material-ui/core/Divider';
import AddIcon from '@material-ui/icons/Add';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Badge from '@material-ui/core/Badge';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import CardContent from '@material-ui/core/CardContent';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    title: {
        fontWeight: 'bolder',
        fontSize: '20px'
    },
    icons: {
        margin: '100px'
    }
});

class Details extends Component {

    constructor() {
        super();
        this.state = {
            restaurantDetails: {}, // Get Restaurant Details
            addressDetails: {}, // Get Address Details
            categories: [],
            isShowItemSnackBox: false,
            itemArray: [],
            countArray: [],
            isShowMessage: "",
        }
    }

    UNSAFE_componentWillMount() {
        this.getRestaurantDetails(); //Get Restaurant Details
    }

    // Get Restaurant Details
    getRestaurantDetails = () => {
        let restDetailsData = null;
        let restDetailsXhr = new XMLHttpRequest();
        let restaurantDetailsContext = this;
        const { restaurantId } = this.props.match.params
        console.log(restaurantId);
        restDetailsXhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                restaurantDetailsContext.setState({
                    restaurantDetails: JSON.parse(this.responseText)
                });
                restaurantDetailsContext.setState({
                    addressDetails: restaurantDetailsContext.state.restaurantDetails.address
                });
                let location = restaurantDetailsContext.state.addressDetails.locality;
                location = location.toUpperCase();
                console.log(location);
                restaurantDetailsContext.state.addressDetails.locality = location;
                let restAddressDetails = restaurantDetailsContext.state.addressDetails;
                restaurantDetailsContext.setState({ addressDetails: restAddressDetails });
                restaurantDetailsContext.setState({
                    categories: restaurantDetailsContext.state.restaurantDetails.categories
                });
            }
        });
        restDetailsXhr.open("GET", this.props.baseUrl + "/restaurant/" + restaurantId);
        restDetailsXhr.send(restDetailsData);
    }

    addIconClickHandler = (categoryIndex, itemIndex) => {
        let items = this.state.itemArray;
        let itemList = this.state.categories[categoryIndex].item_list[itemIndex];
        let itemCount = this.state.countArray;

        let itemFlag = false;
        let currentItemIndex;

        for (let i = 0; i < items.length; i++) {
            if (items[i].item_name === itemList.item_name) {
                console.log('found item');
                currentItemIndex = i;
                itemFlag = true;
                break;
            } else {
                itemFlag = false;
            }
        }

        if (itemFlag) {
            itemCount[currentItemIndex] = itemCount[currentItemIndex] + 1;
            this.setState({ countArray: itemCount });
        } else {
            items.push(itemList);
            this.setState({ itemArray: items });
            itemCount.push(1);
            this.setState({ countArray: itemCount });
        }
        this.setState({ isShowItemSnackBox: true });
        this.setState({ isShowMessage: 'Item added to cart!' });
        console.log(this.state.itemArray);
        console.log(this.state.countArray);
    }

    handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        this.setState({ isShowItemSnackBox: false });
    };

    render() {
        const { classes } = this.props;
        let categoryNames = [];
        this.state.categories.map((category, index) => (
            categoryNames.push(category.category_name)
        ));
        return (
            <div>
                <Header
                    baseUrl={this.props.baseUrl}
                />
                <div className="restaurant-details">
                    <img className="restaurant-image" src={this.state.restaurantDetails.photo_URL} alt={this.state.restaurantDetails.restaurant_name} />
                    <div className="restaurant-info">
                        <Typography variant="h5" component="h2">
                            {this.state.restaurantDetails.restaurant_name}
                        </Typography>
                        <br />
                        <Typography variant="h6">
                            {this.state.addressDetails.locality}
                        </Typography>
                        <br />
                        <Typography variant="h6">
                            <span>{categoryNames.join(",")}</span>
                        </Typography>
                        <br />
                        <div className="details-container">
                            <div>
                                <Typography variant="h6" style={{ fontWeight: 'bold', paddingLeft: '3' }}>
                                    <i className="fa fa-star" aria-hidden="true"></i>
                                    {" " + this.state.restaurantDetails.customer_rating}
                                </Typography>
                                <Typography color="textSecondary">
                                    {"AVERAGE RATING BY"}<br />
                                    <span style={{ fontWeight: 'bold', paddingTop: '3' }}>{this.state.restaurantDetails.number_customers_rated}</span>
                                    {" CUSTOMERS"}
                                </Typography>
                            </div>
                            <div className="rating-section">
                                <i className="fa fa-inr" aria-hidden="true"></i>
                                {" " + this.state.restaurantDetails.average_price}
                                <Typography color="textSecondary">
                                    <span>{"AVERAGE COST FOR"}</span>
                                    <br />
                                    <span>{"TWO PEOPLE"}</span>
                                </Typography>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="menu-cart-section">
                    <div className="menu-items">
                        {this.state.categories.map((category, categoryIndex) => (
                            <span key={"categroy-" + categoryIndex}>{category.category_name.toUpperCase()}
                                <br />
                                <Divider />
                                {category.item_list.map((items, itemIndex) => (
                                    <div className="item-row" key={"item-row-" + items.item_name + "-" + itemIndex}>
                                        {
                                            items.item_type === 'VEG' ? <i key={"veg-" + items.item_name + "-" + itemIndex} className="fa fa-circle" aria-hidden="true" style={{ color: 'green', marginRight: '15px' }}></i> :
                                                <i key={"nonveg-" + items.item_name + "-" + itemIndex} className="fa fa-circle" aria-hidden="true" style={{ color: 'red', marginRight: '15px' }}></i>
                                        }
                                        <span>
                                            {
                                                items.item_name.split(" ").map((i, rowIndex) => (
                                                    <span key={"item-" + items.item_name + "-" + rowIndex}>
                                                        {i.charAt(0).toUpperCase() + i.slice(1) + " "}</span>
                                                ))
                                            }
                                        </span>
                                        <span className="item-price">
                                            <i className="fa fa-inr" aria-hidden="true"></i>
                                            <span>{" " + items.price.toFixed(2)}</span>
                                            <AddIcon style={{ marginLeft: '100px', cursor: 'pointer' }} onClick={() => this.addIconClickHandler(categoryIndex, itemIndex)}></AddIcon>
                                        </span>
                                    </div>
                                ))}
                                <br />
                            </span>
                        ))}
                    </div>
                    <div className="cart-section">
                        <Card variant="outlined">
                            <CardHeader title={"My Cart"} classes={{ title: classes.title }}
                                avatar={
                                    <Badge badgeContent={0} color="primary" showZero>
                                        <ShoppingCartIcon />
                                    </Badge>
                                }
                            ></CardHeader>
                            {this.state.itemArray.map((itemCart, cartIndex) => (
                                <CardContent key={"cart-item-" + cartIndex} className="card-container">
                                    <span style={{ width: '35%' }}>
                                        {
                                            itemCart.item_type === 'VEG' ? <i className="fa fa-stop-circle-o" aria-hidden="true" style={{ color: 'green', marginRight: '15px' }}></i> :
                                                <i className="fa fa-stop-circle-o" aria-hidden="true" style={{ color: 'red', marginRight: '15px' }}></i>
                                        }
                                        {
                                            itemCart.item_name.split(" ").map((i, rowIndex) => (
                                                <span key={"cart-row-item-" + rowIndex} style={{ color: 'grey' }}>{i.charAt(0).toUpperCase() + i.slice(1) + " "}</span>
                                            ))
                                        }
                                    </span>
                                </CardContent>
                            ))}
                        </Card>
                    </div>
                </div>
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    open={this.state.isShowItemSnackBox}
                    autoHideDuration={6000}
                    onClose={this.handleClose}
                    message="Item added to cart!"
                    action={
                        <React.Fragment>
                            <IconButton size="small" aria-label="close" color="inherit" onClick={this.handleClose}>
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        </React.Fragment>
                    }
                />
            </div>
        )
    }
}

export default withStyles(styles)(Details);