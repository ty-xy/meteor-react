import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Avatar extends Component {
    static propTypes = {
        name: PropTypes.string,
        avatarColor: PropTypes.string,
        avatar: PropTypes.string,
    }
    render() {
        const { name, avatar, avatarColor } = this.props;
        return (
            <img
                alt={name.slice(name.length - 2, name.length)}
                style={{ backgroundColor: `${avatarColor}` }}
                src={avatar}
                className="avatar"
            />
        );
    }
}
export default Avatar;
