import React from 'react';
import PropTypes from 'prop-types';

export default function Avatar({ name, avatar, avatarColor }) {
    console.log('users, userId', name, avatar);
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
Avatar.propTypes = {
    name: PropTypes.string.isRequired,
    avatarColor: PropTypes.string,
    avatar: PropTypes.string,
};

