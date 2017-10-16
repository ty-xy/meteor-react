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
            avatar ?
                <img
                    alt={name.slice(name.length - 2, name.length)}
                    src={avatar}
                    className="avatar"
                />
                :
                <span className="avatar" style={{ backgroundColor: `${avatarColor}` }}>{name.slice(name.length - 2, name.length)}</span>
        );
    }
}
export default Avatar;
