import React, { Component } from 'react';
import './Header.css';
import FastfoodIcon from '@material-ui/icons/Fastfood';
import SearchOutlinedIcon from "@material-ui/icons/SearchOutlined";
import InputAdornment from '@material-ui/core/InputAdornment';
import { withStyles, ThemeProvider, createTheme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Modal from 'react-modal';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import PropTypes from 'prop-types';
import FormHelperText from '@material-ui/core/FormHelperText';
import SnackbarContent from "@material-ui/core/SnackbarContent";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

const styles = theme => ({
    grow: {
        flexGrow: 1,
    },
    formControl: {
        margin: theme.spacing(),
        width: 250,
    },
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        width: '30ch',
        color: 'white'
    },
    buttonControl: {
        margin: theme.spacing(),
        pointer: "cursor",
    },
});

const theme = createTheme({
    palette: {
        primary: {
            main: '#ffffff',
        }
    }
});

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    }
};

const TabContainer = function (props) {
    return (
        <Typography component="div" style={{ padding: 0, textAlign: 'center' }}>
            {props.children}
        </Typography>
    )
}

TabContainer.propTypes = {
    children: PropTypes.node.isRequired
}

class Header extends Component {

    constructor() {
        super();
        this.state = {

            modalIsOpen: false,
            value: 0,

            logincontactno: "",
            loginContactnoRequired: "dispNone",
            loginPassword: "",
            loginPasswordRequired: "dispNone",

            validLoginContactnoRegEx: "dispNone",

            firstnameRequired: "dispNone",
            firstname: "",
            lastnameRequired: "dispNone",
            lastname: "",
            emailRequired: "dispNone",
            email: "",
            signupPasswordRequired: "dispNone",
            signupPassword: "",
            signupContactnoRequired: "dispNone",
            signupContactno: "",

            validEmailRegEx: "dispNone",
            validSignupPwdRegEx: "dispNone",
            validSignupContactnoRegEx: "dispNone",
            loginResponse: {},
            loggedIn: sessionStorage.getItem("access-token") == null ? false : true,

            anchorEl: null,

        }
    }

    openModalHandler = () => {
        this.setState({
            modalIsOpen: true,
            value: 0,

            logincontactno: "",
            loginContactnoRequired: "dispNone",
            loginPassword: "",
            loginPasswordRequired: "dispNone",

            validLoginContactnoRegEx: "dispNone",
            isLoginSuccess: true,
            loginErrorMsg: "",
            isShowLoginSnackBox: false,

            firstnameRequired: "dispNone",
            firstname: "",
            lastnameRequired: "dispNone",
            lastname: "",
            emailRequired: "dispNone",
            email: "",
            signupPasswordRequired: "dispNone",
            signupPassword: "",
            signupContactnoRequired: "dispNone",
            signupContactno: "",

            validEmailRegEx: "dispNone",
            validSignupPwdRegEx: "dispNone",
            validSignupContactnoRegEx: "dispNone",
            isSignupSuccess: true,
            signupErrorMsg: "",
            isShowSignupSnackBox: false,
        })
    }

    closeModalHandler = () => {
        this.setState({ modalIsOpen: false });
    }

    tabChangeHandler = (event, value) => {
        this.setState({ value });
    }

    inputLoginContactNoChangeHandler = (e) => {
        this.setState({ logincontactno: e.target.value })
    }

    inputLoginPasswordChangeHandler = (e) => {
        this.setState({ loginPassword: e.target.value });
    }

    inputFirstNameChangeHandler = (e) => {
        this.setState({ firstname: e.target.value });
    }

    inputLastNameChangeHandler = (e) => {
        this.setState({ lastname: e.target.value });
    }

    inputEmailChangeHandler = (e) => {
        this.setState({ email: e.target.value });
    }

    inputSignupPasswordChangeHandler = (e) => {
        this.setState({ signupPassword: e.target.value });
    }

    inputSignupContactNoChangeHandler = (e) => {
        this.setState({ signupContactno: e.target.value });
    }

    isValidLoginContactno = () => {
        let contactnoRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
        return contactnoRegex.test(String(this.state.logincontactno));
    }

    loginClickHandler = () => {
        this.state.logincontactno === "" ? this.setState({ loginContactnoRequired: "dispBlock" }) : this.setState({ loginContactnoRequired: "dispNone" });
        this.state.loginPassword === "" ? this.setState({ loginPasswordRequired: "dispBlock" }) : this.setState({ loginPasswordRequired: "dispNone" });
        this.isValidLoginContactno() === false && this.state.logincontactno !== "" ? this.setState({ validLoginContactnoRegEx: "dispBlock" }) : this.setState({ validLoginContactnoRegEx: "dispNone" });
        this.sendLoginDetails();
    }

    sendLoginDetails = () => {
        const loginData = null;
        let xhrLogin = new XMLHttpRequest();
        const loginContext = this;
        xhrLogin.addEventListener("readystatechange", function () {
            if (this.readyState === 4 && this.status === 200) {
                let loginResponse = JSON.parse(this.responseText);
                console.log(this);
                console.log(this.responseText);
                sessionStorage.setItem("uuid", JSON.parse(this.responseText).id);
                sessionStorage.setItem("access-token", xhrLogin.getResponseHeader("access-token"));
                sessionStorage.setItem("first-name", loginResponse.first_name)
                loginContext.setState({
                    loggedIn: true
                });
                loginContext.setState({
                    isLoginSuccess: true
                });
                loginContext.setState({
                    loginErrorMsg: ""
                });

                loginContext.setState({ loginResponse: JSON.parse(this.responseText) });
                loginContext.setState({ isShowLoginSnackBox: true });

                setTimeout(function () {
                    loginContext.setState({ isShowLoginSnackBox: false });
                }, 3000);

                loginContext.closeModalHandler();

            } else if (this.readyState === 4 && this.status === 401) {
                console.log(this);
                loginContext.setState({
                    isLoginSuccess: false
                });
                loginContext.setState({
                    loginErrorMsg: JSON.parse(this.responseText).message
                });
            }
        });
        xhrLogin.open("POST", this.props.baseUrl + "customer/login");
        xhrLogin.setRequestHeader("authorization", "Basic " + window.btoa(this.state.logincontactno + ":" + this.state.loginPassword));
        xhrLogin.setRequestHeader("Content-Type", "application/json");
        xhrLogin.setRequestHeader("Cache-Control", "no-cache");
        xhrLogin.send(loginData);
    }

    signupClickHandler = () => {
        this.state.firstname === "" ? this.setState({ firstnameRequired: "dispBlock" }) : this.setState({ firstnameRequired: "dispNone" });
        this.state.email === "" ? this.setState({ emailRequired: "dispBlock" }) : this.setState({ emailRequired: "dispNone" });
        this.state.signupPassword === "" ? this.setState({ signupPasswordRequired: "dispBlock" }) : this.setState({ signupPasswordRequired: "dispNone" });
        this.state.signupContactno === "" ? this.setState({ signupContactnoRequired: "dispBlock" }) : this.setState({ signupContactnoRequired: "dispNone" });
        this.isValidEmail() === false && this.state.email !== "" ? this.setState({ validEmailRegEx: "dispBlock" }) : this.setState({ validEmailRegEx: "dispNone" });
        this.isValidPassword() === false && this.state.signupPassword !== "" ? this.setState({ validSignupPwdRegEx: "dispBlock" }) : this.setState({ validSignupPwdRegEx: "dispNone" });
        this.isValidSignupContactno() === false && this.state.signupContactno !== "" ? this.setState({ validSignupContactnoRegEx: "dispBlock" }) : this.setState({ validSignupContactnoRegEx: "dispNone" });

        this.sendSignupDetails();
    }

    sendSignupDetails = () => {

        if (
            this.state.firstname === "" ||
            this.state.email === "" ||
            this.state.signupPassword === "" ||
            this.state.signupContactno === "" ||
            this.isValidEmail() === false ||
            this.isValidSignupContactno() === false ||
            this.isValidPassword() === false
        ) {
            return;
        }

        let signupData = {
            contact_number: this.state.signupContactno,
            email_address: this.state.email,
            first_name: this.state.firstname,
            last_name: this.state.lastname,
            password: this.state.signupPassword
        };
        const signupContext = this;
        let xhrSignup = new XMLHttpRequest();
        let that = this;
        xhrSignup.addEventListener("readystatechange", function () {
            if (this.readyState === 4 && this.status === 201) {
                that.setState({
                    signupSuccess: true
                });
                signupContext.setState({
                    isSignupSuccess: true
                });
                signupContext.setState({
                    signupErrorMsg: ""
                });
                signupContext.setState({ isShowSignupSnackBox: true });
                signupContext.setState({ value: 0 });
                setTimeout(function () {
                    signupContext.setState({ isShowSignupSnackBox: false });
                }, 3000);
            } else if (this.readyState === 4 && this.status === 400) {
                console.log(this);
                signupContext.setState({
                    isSignupSuccess: false
                });
                signupContext.setState({
                    signupErrorMsg: JSON.parse(this.responseText).message
                });
            }
        });
        console.log(this.props.baseUrl);
        xhrSignup.open("POST", this.props.baseUrl + "customer/signup");
        xhrSignup.setRequestHeader("Content-Type", "application/json");
        xhrSignup.send(JSON.stringify(signupData));
    }

    isValidEmail = () => {
        // eslint-disable-next-line
        let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return emailRegex.test(String(this.state.email).toLowerCase());
    };

    isValidPassword = () => {
        let pwdRegex = /^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*\W).*$/;
        return pwdRegex.test(String(this.state.signupPassword));
    }

    isValidSignupContactno = () => {
        let contactnoRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
        return contactnoRegex.test(String(this.state.signupContactno));
    }

    handleClick = event => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    profileClickHandler = () => {
        this.props.history.push("/profile");
    };

    logoutClickHandler = (e) => {
        sessionStorage.removeItem("uuid");
        sessionStorage.removeItem("access-token");

        this.setState({
            loggedIn: false
        });
    }

    render() {
        const { classes } = this.props;
        return (
            <div>
                <header>
                    <div className="app-header">
                        <div className="header-logo">
                            <FastfoodIcon style={{ fontSize: 30 }} />
                        </div>
                        <div className="header-search-box">
                            <ThemeProvider theme={theme}>
                                <Input
                                    id="search-box-input"
                                    type="search"
                                    className="search-field"
                                    variant="outlined"
                                    onChange={this.props.searchHandler}
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <SearchOutlinedIcon style={{ fontSize: 30, color: 'white' }} />
                                        </InputAdornment>
                                    }
                                    placeholder="Search by Restaurant Name"
                                    classes={{
                                        root: classes.inputRoot,
                                        input: classes.inputInput,
                                    }}
                                />
                            </ThemeProvider>
                        </div>
                        {!this.state.loggedIn && (
                            <div className="header-login-button">
                                <Button variant="contained" color="default" startIcon={<AccountCircleIcon />} onClick={this.openModalHandler}>Login</Button>
                            </div>
                        )
                        }
                        {this.state.loggedIn && (
                            <div className="header-login-button">
                                <Button variant="contained" color="default" onClick={this.handleClick}>
                                    <AccountCircleIcon />
                                    {sessionStorage.getItem("first-name")}
                                </Button>
                            </div>
                        )}
                        <Menu
                            id="fade-menu"
                            anchorEl={this.state.anchorEl}
                            keepMounted
                            open={Boolean(this.state.anchorEl)}>
                            <MenuItem
                                style={{
                                    fontSize: "medium",
                                    fontWeight: "bold",
                                    cursor: "pointer"
                                }}
                                onClick={() => {
                                    this.handleClose();
                                    this.profileClickHandler();
                                }}
                            >
                                My Profile
                            </MenuItem>
                            <MenuItem
                                style={{
                                    fontSize: "medium",
                                    fontWeight: "bold",
                                    cursor: "pointer"
                                }}
                                onClick={() => {
                                    this.handleClose();
                                    this.logoutClickHandler();
                                }}
                            >
                                Logout
                            </MenuItem>
                        </Menu>
                    </div>
                </header>
                <div>
                    <Modal
                        ariaHideApp={false}
                        isOpen={this.state.modalIsOpen}
                        contentLabel="Login"
                        onRequestClose={this.closeModalHandler}
                        style={customStyles}

                    >
                        <Tabs className="tabs" value={this.state.value} onChange={this.tabChangeHandler}>
                            <Tab label="LOGIN" />
                            <Tab label="SIGNUP" />
                        </Tabs>

                        {this.state.value === 0 &&
                            <TabContainer>
                                <FormControl className={classes.formControl} required>
                                    <InputLabel htmlFor="contactNo">Contact No.</InputLabel>
                                    <Input id="contactNo" type="text" logincontactno={this.state.logincontactno} onChange={this.inputLoginContactNoChangeHandler} />
                                    <FormHelperText className={this.state.loginContactnoRequired}>
                                        <span className="red">required</span>
                                    </FormHelperText>
                                    <FormHelperText className={this.state.validLoginContactnoRegEx}>
                                        <span className="red">Invalid Contact</span>
                                    </FormHelperText>
                                </FormControl>
                                <br /><br />
                                <FormControl className={classes.formControl} required>
                                    <InputLabel htmlFor="loginPassword">Password</InputLabel>
                                    <Input id="loginPassword" type="password" loginpassword={this.state.loginPassword} onChange={this.inputLoginPasswordChangeHandler} />
                                    <FormHelperText className={this.state.loginPasswordRequired}>
                                        <span className="red">required</span>
                                    </FormHelperText>
                                </FormControl>
                                <br /><br />
                                {this.state.isLoginSuccess === false && (
                                    <FormHelperText>
                                        <span className="red">{this.state.loginErrorMsg}</span>
                                    </FormHelperText>

                                )}
                                <FormControl className={classes.buttonControl} required>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={this.loginClickHandler}
                                    >
                                        LOGIN
                                    </Button>
                                </FormControl>
                            </TabContainer>
                        }
                        {this.state.value === 1 &&
                            <TabContainer>
                                <FormControl className={classes.formControl} required>
                                    <InputLabel htmlFor="firstname">First Name</InputLabel>
                                    <Input id="firstname" type="text" firstname={this.state.firstname} onChange={this.inputFirstNameChangeHandler} />
                                    <FormHelperText className={this.state.firstnameRequired}>
                                        <span className="red">required</span>
                                    </FormHelperText>
                                </FormControl>
                                <br /><br />
                                <FormControl className={classes.formControl} required>
                                    <InputLabel htmlFor="lastname">Last Name</InputLabel>
                                    <Input id="lastname" type="text" lastname={this.state.lastname} onChange={this.inputLastNameChangeHandler} />
                                    <FormHelperText className={this.state.lastnameRequired}>
                                        <span className="red">required</span>
                                    </FormHelperText>
                                </FormControl>
                                <br /><br />
                                <FormControl className={classes.formControl} required>
                                    <InputLabel htmlFor="email">Email</InputLabel>
                                    <Input id="email" type="text" email={this.state.email} onChange={this.inputEmailChangeHandler} />
                                    <FormHelperText className={this.state.emailRequired}>
                                        <span className="red">required</span>
                                    </FormHelperText>
                                    <FormHelperText className={this.state.validEmailRegEx}>
                                        <span className="red">Invalid Email</span>
                                    </FormHelperText>
                                </FormControl>
                                <br /><br />
                                <FormControl className={classes.formControl} required>
                                    <InputLabel htmlFor="signupPassword">Password</InputLabel>
                                    <Input id="signupPassword" type="password" signupPassword={this.state.signupPassword} onChange={this.inputSignupPasswordChangeHandler} />
                                    <FormHelperText className={this.state.signupPasswordRequired}>
                                        <span className="red">required</span>
                                    </FormHelperText>
                                    <FormHelperText className={this.state.validSignupPwdRegEx}>
                                        <span className="red">Password must contain at least one capital letter, one small letter, one number, and one special character</span>
                                    </FormHelperText>
                                </FormControl>
                                <br /><br />
                                <FormControl className={classes.formControl} required>
                                    <InputLabel htmlFor="contactNo">Contact No.</InputLabel>
                                    <Input id="contactNo" type="text" signupContactno={this.state.signupContactno} onChange={this.inputSignupContactNoChangeHandler} />
                                    <FormHelperText className={this.state.signupContactnoRequired}>
                                        <span className="red">required</span>
                                    </FormHelperText>
                                    <FormHelperText className={this.state.validSignupContactnoRegEx}>
                                        <span className="red">Contact No. must contain only numbers and must be 10 digits long</span>
                                    </FormHelperText>
                                </FormControl>
                                <br /><br />
                                {this.state.isSignupSuccess === false && (
                                    <div>
                                        <FormHelperText>
                                            <span className="red">{this.state.signupErrorMsg}</span>
                                        </FormHelperText>
                                        <br />
                                    </div>
                                )}
                                <FormControl className={classes.buttonControl} required>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={this.signupClickHandler}
                                    >
                                        SIGNUP
                                    </Button>
                                </FormControl>
                            </TabContainer>
                        }
                    </Modal>

                    {this.state.isShowLoginSnackBox && (
                        <div style={{ maxWidth: "400px" }} className="snackbox">
                            <SnackbarContent message="Logged in successfully!" />
                        </div>
                    )}

                    {this.state.isShowSignupSnackBox && (
                        <div style={{ maxWidth: "400px" }} className="snackbox">
                            <SnackbarContent message="Registered successfully! Please login now!" />
                        </div>
                    )}
                </div>
            </div>
        )
    }
}

export default withStyles(styles)(Header);