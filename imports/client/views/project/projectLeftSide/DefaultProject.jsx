import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MyIcon from '../../../components/Icon';


export default class DefaultProject extends Component {
    static propTypes = {
        click: PropTypes.func,
    }
    constructor(...args) {
        super(...args);
        this.state = {
            showClose: false,
        };
    }
    onMouseEnter = () => {
        this.setState({
            showClose: true,
        });
    }
    onmouseout = () => {
        this.setState({
            showClose: false,
        });
    }
    render() {
        return (
            <div className="list-item" onMouseEnter={this.onMouseEnter} onMouseOut={this.onmouseout}>
                <p className="project-icon-avatar">
                    <MyIcon icon="icon-yanshi icon" size={20} />
                </p>
                <p>项目示例</p>
                {this.state.showClose ?
                    <p><MyIcon icon="icon-guanbi icon-close" onClick={this.props.click} /></p> : null}
            </div>
        );
    }
}

