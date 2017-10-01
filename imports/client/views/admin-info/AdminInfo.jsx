import React, { Component } from 'react';
import PropTypes from 'prop-types';
import pureRender from 'pure-render-decorator';

@pureRender
class AdminInfo extends Component {
    static propTypes = {
        goto: PropTypes.func,
    }
    clickTab = (path) => {
        this.props.goto(path);
    }
    render() {
        return (
            <div>
                这是个人资料
            </div>
        );
    }
}

export default AdminInfo;
