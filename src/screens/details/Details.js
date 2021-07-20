import React, { Component } from 'react';
import './Details.css';
import Header from '../../common/header/Header';
import Typography from '@material-ui/core/Typography';
import 'font-awesome/css/font-awesome.min.css';
import Divider from '@material-ui/core/Divider';
import AddIcon from '@material-ui/icons/Add';

class Details extends Component {

    constructor() {
        super();
        this.state = {
            restaurantDetails: {}, // Get Restaurant Details
            addressDetails: {}, // Get Address Details
            categories: []
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

    render() {
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
                                            <AddIcon style={{ marginLeft: '100px', cursor: 'pointer' }}></AddIcon>
                                        </span>
                                    </div>
                                ))}
                                <br />
                            </span>

                        ))}
                    </div>
                </div>
            </div>
        )
    }
}

export default Details;