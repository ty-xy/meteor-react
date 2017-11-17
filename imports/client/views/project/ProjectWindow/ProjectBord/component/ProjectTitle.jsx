import React from 'react';
import PropTypes from 'prop-types';
// import { Input } from 'antd';
import Icon from '../../../../../components/Icon';

// const { TextArea } = Input;
export default function ProjectTitle({ title, onClick, onCancel }) {
    return (
        <div className="common-title-set">
            <Icon icon="icon-fanhui icon" size="10px" iconColor="#BDBDBD" onClick={onClick} />
            <p>{title}</p>
            <Icon icon="icon-guanbi1 icon-second" size="10px" iconColor="#BDBDBD" onClick={onCancel} />
        </div>
    );
}
ProjectTitle.propTypes = {
    title: PropTypes.string,
    onClick: PropTypes.func,
    onCancel: PropTypes.func,
};
