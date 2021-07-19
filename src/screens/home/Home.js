import React, { Component } from 'react';
import './Home.css';
import Header from '../../common/header/Header';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import 'font-awesome/css/font-awesome.min.css';

const cardMediaStyle = {
    width: "430px",
    height: "200px"
}

class Home extends Component {

    constructor() {
        super();
        this.state = {
            getAllRestaurants: [], // Get Restaurants
        }
    }

    UNSAFE_componentWillMount() {
        this.getAllRestaurants();
    }

    //Get All Restaurants
    getAllRestaurants() {
        let data = null;
        let xhr = new XMLHttpRequest();
        let restaurantContext = this;
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                const restaurantDetails = JSON.parse(this.responseText).restaurants;
                restaurantContext.setState({ getAllRestaurants: restaurantDetails });
                console.log(restaurantContext.state.getAllRestaurants);
            }
        });
        xhr.open("GET", this.props.baseUrl + "restaurant");
        xhr.send(data);
    }

    //Search Restaurant By Name
    searchByRestaurantNameHandler = (event) => {

        const searchValue = event.target.value;
        console.log(searchValue);

        if (searchValue.trim().length === 0) {
            this.getAllRestaurants();
            return;
        }

        let searchData = null;
        let searchXhr = new XMLHttpRequest();
        let searchContext = this;
        searchXhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                const restaurantDetails = JSON.parse(this.responseText).restaurants;
                searchContext.setState({ getAllRestaurants: restaurantDetails });
                console.log(searchContext.state.getAllRestaurants);
            }
        });
        searchXhr.open("GET", this.props.baseUrl + "restaurant/name/" + searchValue);
        searchXhr.send(searchData);
    }

    restaurantDetailsClickHandler = (restaurantId) => {
        this.props.history.push('/restaurant/' + restaurantId);
    }

    render() {
        return (
            <div>
                <Header baseUrl={this.props.baseUrl}
                    showHomePage="home"
                    searchHandler={this.searchByRestaurantNameHandler}
                />
                <br />
                <div className="card-container">
                    {this.state.getAllRestaurants.map((restaurant, index) => (
                        <div className="cards" key={restaurant.id}>
                            <Card variant="outlined" onClick={() => this.restaurantDetailsClickHandler(restaurant.id)}>
                                <CardActionArea>
                                    <CardMedia style={cardMediaStyle} title={restaurant.restaurant_name} image={restaurant.photo_URL}>
                                        <img src={restaurant.photo_URL} alt={restaurant.restaurant_name} className="restaurantImage" />
                                    </CardMedia>
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="h2">
                                            {restaurant.restaurant_name}
                                        </Typography>
                                        <br />
                                        <div className="restaurantCategories">
                                            {restaurant.categories.split().map((category, i) => (
                                                <Typography variant="body1" key={index + "category" + i}>
                                                    <small >{category},</small>
                                                </Typography>
                                            ))}
                                        </div>
                                        <br />
                                        <div className="restaurantDetails">
                                            <div className="restaurantRatings">
                                                <i className="fa fa-star" aria-hidden="true"></i>
                                                &nbsp;&nbsp;{restaurant.customer_rating}&nbsp;&nbsp; ({restaurant.number_customers_rated})
                                            </div>
                                            <div className="restaurantAvgPrice">
                                                <i className="fa fa-rupee"></i>
                                                {restaurant.average_price} for two
                                            </div>
                                        </div>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </div>
                    ))}
                </div>
            </div>
        )
    }
}

export default Home;