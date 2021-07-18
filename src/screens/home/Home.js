import React, { Component } from 'react';
import './Home.css';
import Header from '../../common/header/Header';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import 'font-awesome/css/font-awesome.min.css';

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

    render() {
        return (
            <div>
                <Header baseUrl={this.props.baseUrl} />
                <br />
                <div className="card-container">
                    {this.state.getAllRestaurants.map((restaurant, index) => (
                        <div className="cards" key={restaurant.id}>
                            <Card variant="outlined">
                                <CardActionArea>
                                    <CardMedia style={{ width: "400px", height: "200px" }} title={restaurant.restaurant_name} image={restaurant.photo_URL}>
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
                                    </CardContent>
                                </CardActionArea>
                                <CardActions>
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
                                </CardActions>
                            </Card>
                        </div>
                    ))}
                </div>
            </div>
        )
    }
}

export default Home;