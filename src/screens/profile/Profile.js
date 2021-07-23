import React, { Component } from 'react';
import './Profile.css';

class Profile extends Component {
    render() {
        if (sessionStorage.getItem("access-token") === null) {
            this.props.history.push("/");
        }
        return (
            <div className="profile-section">
                Profile Page
            </div>
        )
    }
}

export default Profile;