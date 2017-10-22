import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import MyIcon from '../../../components/Icon';

export default class DefaultProject extends Component {
    render() {
        return (
            <div className="list-item">
                <p className="project-icon-avatar">
                    <MyIcon icon="icon-yanshi icon" />
                </p>
                <p>项目示例</p>
            </div>
        );
    }
}

