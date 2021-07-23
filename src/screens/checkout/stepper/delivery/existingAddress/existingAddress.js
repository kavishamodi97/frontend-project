import React, { Component } from 'react';
import './ExistingAddress.css';
import Typography from '@material-ui/core/Typography';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import IconButton from '@material-ui/core/IconButton';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { green, grey } from '@material-ui/core/colors';

class ExistingAddress extends Component {
    constructor(props) {
        super(props);
        this.state = {
            addresses: [],
            defaultAddress: true //fetch address details
        }
        this.handleDefaultAddress = this.handleDefaultAddress.bind(this);
    }

    UNSAFE_componentWillMount() {
        this.fetchAddress();
    }

    fetchAddress = () => {
        let token = sessionStorage.getItem('access-token');
        let xhr = new XMLHttpRequest();
        let that = this;

        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                that.setState({ addresses: JSON.parse(this.responseText).addresses });
            }
        });

        let url = this.props.baseUrl + 'address/customer';
        xhr.open('GET', url);
        xhr.setRequestHeader('authorization', 'Bearer ' + token);
        xhr.setRequestHeader("Cache-Control", "no-cache");
        xhr.send();
    }

    handleDefaultAddress(addressId) {
        this.setState({
            defaultAddressId: addressId
        })
        this.props.setDeliveryAddress(addressId)
        this.props.handleSteps(true);
    }

    render() {
        const { addresses } = this.state;

        return (
            <div className="root">
                <GridList className="gridList">
                    {addresses && addresses.length > 0 && addresses.map(address => {
                        const defaultAddress = address.id === this.state.defaultAddressId;
                        return (
                            <GridListTile key={"address-" + address.id} className={defaultAddress ? "grid-main default" : "grid-main"}
                                onClick={this.handleDefaultAddress.bind(this, address.id)}>
                                <span className="address-container">
                                    <Typography component="p" style={{ marginBottom: '5px' }}>
                                        {address.flat_building_name}
                                    </Typography>
                                    <Typography component="p" style={{ marginBottom: '5px' }}>
                                        {address.locality}
                                    </Typography>
                                    <Typography component="p" style={{ marginBottom: '5px' }}>
                                        {address.city}
                                    </Typography>
                                    <Typography component="p" style={{ marginBottom: '5px' }}>
                                        {address.state.state_name}
                                    </Typography>
                                    <Typography component="p" style={{ marginBottom: '5px' }}>
                                        {address.pincode}
                                    </Typography>
                                </span>
                                <IconButton className="checked-icon">
                                    <CheckCircleIcon style={defaultAddress ? { color: green[500] } : { color: grey[500] }} />
                                </IconButton>
                            </GridListTile>
                        )
                    })}
                    {addresses.length === 0 && <Typography style={{ width: '100%', color: "#ccc" }}>There are no saved addresses!
                        You can save an address using the 'New Address' tab or using your ‘Profile’ menu option.</Typography>}
                </GridList>
            </div>
        )
    }
}

export default ExistingAddress;