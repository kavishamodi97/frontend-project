import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import ExistingAddress from './existingAddress/ExistingAddress';
import NewAddress from './newAddress/NewAddress';

function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box p={3}>{children}</Box>}
        </Typography>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

// Tabs Styles
const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
}));

// Delivery Component
export default function Delivery(props) {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);

    // Handle Tab Switching
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    // Render Existing Address And New Address Tabs Inside Delivery Stepper
    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Tabs value={value} onChange={handleChange} aria-label="tabs">
                    <Tab label="Existing Address" {...a11yProps(0)} />
                    <Tab label="New Address" {...a11yProps(1)} />
                </Tabs>
            </AppBar>
            <TabPanel value={value} index={0}>
                <ExistingAddress handleSteps={props.handleSteps} setDeliveryAddress={props.setDeliveryAddress} baseUrl={props.baseUrl} />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <NewAddress handleSteps={props.handleSteps} handleChange={handleChange} baseUrl={props.baseUrl} />
            </TabPanel>
        </div>
    );
}
