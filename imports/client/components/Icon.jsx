import React from 'react';
import PropTypes from 'prop-types';

export default function Icon({ icon, size, iconColor, onClick }) {
    return (
        <i className={`iconfont ${icon}`} style={{ fontSize: size, color: iconColor }} onClick={onClick} />
    );
}
Icon.propTypes = {
    icon: PropTypes.string.isRequired,
    size: PropTypes.number,
    iconColor: PropTypes.string,
    onClick: PropTypes.func,
};
