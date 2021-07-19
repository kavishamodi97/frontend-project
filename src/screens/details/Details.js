import React, { Component } from 'react';
import './Details.css';
import Header from '../../common/header/Header';


class Details extends Component {

    constructor() {
        super();
        this.state = {
            restaurantDetails: [], // Get Restaurant Details
            addressDetails: [], // Get Address Details
            categories: []
        }
    }

    UNSAFE_componentWillMount() {
        this.getRestaurantDetails(); //Get Restaurant Details
    }

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
                let location = restaurantDetailsContext.state.addressDetails;
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
        return (
            <div>
                <Header
                    baseUrl={this.props.baseUrl}
                />
            </div>
        )
    }
}

export default Details;