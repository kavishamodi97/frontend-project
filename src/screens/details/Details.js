import React, { Component } from 'react';
import './Details.css';
import Header from '../../common/header/Header';
import Typography from '@material-ui/core/Typography';
import 'font-awesome/css/font-awesome.min.css';

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

        this.state.categories.map((cats, index) => (
            categoryNames.push(cats.category_name)
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
                        <Typography variant="h7">
                            {this.state.addressDetails.locality}
                        </Typography>
                        <br />
                        <Typography variant="h7">
                            <span>{categoryNames.join(",")}</span>
                        </Typography>
                        <br />
                        <div className="details-container">
                            <div>
                                <Typography variant="h7" style={{ fontWeight: 'bold' }}>
                                    <i className="fa fa-star" aria-hidden="true"></i>
                                    {" " + this.state.restaurantDetails.customer_rating}
                                </Typography>
                                <Typography color="textSecondary">
                                    {"AVERAGE RATING BY"}<br />
                                    <span style={{ fontWeight: 'bold' }}>{this.state.restaurantDetails.number_customers_rated}</span>
                                    {" CUSTOMERS"}
                                </Typography>
                            </div>
                            <div>
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
            </div>

        )
    }
}

export default Details;