import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';

class Avatar extends Component {
    static propTypes = {
        user: PropTypes.object,
    }
    constructor(...args) {
        super(...args);
        this.state = {
            name: '',
            avatarColor: '',
        };
    }
    componentWillMount() {
        if (this.props.user) {
            this.setState({
                name: this.props.user.profile.name,
                avatarColor: this.props.user.profile.avatarColor,
            });
        }
    }
    render() {
        return (
            <img
                alt={this.state.name.slice(this.state.name.length - 2, this.state.name.length)}
                style={{ backgroundColor: `${this.state.avatarColor}` }}
                className="avatar"
            />
        );
    }
}

export default withTracker(() => {
    Meteor.subscribe('userData');
    return {
        user: Meteor.user(),
    };
})(Avatar);
