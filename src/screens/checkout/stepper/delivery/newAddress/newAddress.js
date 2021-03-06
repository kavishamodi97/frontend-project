import React, { Component } from 'react';
import './NewAddress.css';
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import Button from "@material-ui/core/Button";
import FormHelperText from "@material-ui/core/FormHelperText";
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

// New Address Tab UI
class NewAddress extends Component {
    constructor(props) {
        super(props);
        this.state = {
            states: [],
            flatNo: '',
            city: '',
            locality: '',
            pinCode: '',
            pinCodeErrorMsg: '',
            stateValue: '',
            showMsg: false,
            value: '',
        }
        this.handleChange = this.handleChange.bind(this);
        this.getStates = this.getStates.bind(this);
        this.handleSaveBtn = this.handleSaveBtn.bind(this);
        this.handleValueChange = this.handleValueChange.bind(this)
    }

    //Fetch List Of States Data Before Rendering Components
    UNSAFE_componentWillMount() {
        this.getStates(this.props.baseUrl);
        this.props.handleSteps(false);
    }

    // Get List Of States
    getStates(baseUrl) {
        let xhr = new XMLHttpRequest();
        let that = this;

        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                that.setState({ states: JSON.parse(this.responseText).states });
            }
        });

        let url = `${baseUrl}/states`;
        xhr.open('GET', url);
        xhr.setRequestHeader("Cache-Control", "no-cache");
        xhr.send();
    }

    // State Change Handler 
    handleChange(event) {
        this.setState({
            stateValue: event.target.value
        })
    }

    // Post Address Into 'restaurantdb' using Fetch API
    handleSaveBtn() {
        if (this.state.pinCode) {
            if (this.state.pinCode.length !== 6) {
                this.setState({
                    pinCodeErrorMsg: "Pincode must only contain numbers and must be 6 digits long."
                })
            }
        }
        this.setState({
            showMsg: true
        })

        const { baseUrl } = this.props;
        const newAddress = {
            city: this.state.city,
            flat_building_name: this.state.flatNo,
            locality: this.state.locality,
            pincode: this.state.pinCode,
            state_uuid: this.state.stateValue
        }
        let canSubmit = true;
        Object.keys(newAddress).forEach(key => {
            if (!newAddress[key]) {
                canSubmit = false
            }
        })

        if (!canSubmit) return;

        // Post Address Into 'restaurant db' Using AJax Calls
        let token = sessionStorage.getItem('access-token');
        let xhr = new XMLHttpRequest();
        let that = this;

        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                if (this.status === 201) {
                    that.setState({
                        open: true,
                        message: 'Address Saved Successfully'
                    })
                    let e;
                    that.props.handleChange(e, 0);
                }
                that.setState({
                    addresses: JSON.parse(this.responseText).addresses,
                });
            }
        });

        let url = `${baseUrl}/address/`;
        xhr.open('POST', url);
        xhr.setRequestHeader('authorization', 'Bearer ' + token);
        xhr.setRequestHeader("Cache-Control", "no-cache");
        xhr.setRequestHeader('content-type', 'application/json');
        xhr.send(JSON.stringify(newAddress));
    }


    handleValueChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    //Render Form Into New Address Tab
    render() {
        const { stateValue, city, locality, flatNo, showMsg, pinCode, states, pinCodeErrorMsg } = this.state;
        return (
            <div>
                <form className="root-main" onnoValidate autoComplete="off">
                    <FormControl>
                        <InputLabel htmlFor="flatNumber">Flat/Building No.<sup>*</sup></InputLabel>
                        <Input
                            id="flatNumber"
                            value={flatNo}
                            onChange={this.handleValueChange}
                            aria-describedby="error"
                            name="flatNo"
                        />
                        {(showMsg && !flatNo) && <FormHelperText id="error">required</FormHelperText>}
                    </FormControl>
                    <FormControl>
                        <InputLabel htmlFor="locality">Locality<sup>*</sup></InputLabel>
                        <Input
                            id="locality"
                            value={locality}
                            onChange={this.handleValueChange}
                            aria-describedby="error"
                            name="locality"
                        />
                        {(showMsg && !locality) && <FormHelperText id="error" className="field">required</FormHelperText>}
                    </FormControl>
                    <FormControl>
                        <InputLabel htmlFor="city">City<sup>*</sup></InputLabel>
                        <Input
                            id="city"
                            value={city}
                            onChange={this.handleValueChange}
                            aria-describedby="error"
                            name="city"
                        />
                        {(showMsg && !city) && <FormHelperText id="error">required</FormHelperText>}
                    </FormControl>
                    <FormControl>
                        <InputLabel id="label">State<sup>*</sup></InputLabel>
                        <Select
                            labelId="label"
                            id="select"
                            value={stateValue}
                            onChange={this.handleChange}>
                            {states.length > 0 && states.map((state, index) =>
                                <MenuItem value={state.id} name={state.state_name} key={index}>{state.state_name}</MenuItem>)}
                        </Select>
                        {(showMsg && !stateValue) && <FormHelperText id="error">required</FormHelperText>}
                    </FormControl>
                    <FormControl>
                        <InputLabel htmlFor="pinCode">Pin code<sup>*</sup></InputLabel>
                        <Input
                            id="pinCode"
                            value={pinCode}
                            onChange={this.handleValueChange}
                            aria-describedby="pinCode"
                            name="pinCode"
                        />
                        {((showMsg && !pinCode) || pinCodeErrorMsg) && <FormHelperText id="error">{pinCodeErrorMsg ? pinCodeErrorMsg : 'required'}</FormHelperText>}
                    </FormControl>
                    <Button variant="contained" color="secondary" className="action-btn" onClick={this.handleSaveBtn}>
                        Save Address
                    </Button>
                </form>
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
            </div>
        );
    }
}

export default NewAddress;