import React, { Component } from 'react';
import pureRender from 'pure-render-decorator';
import PropTypes from 'prop-types';

@pureRender
export default class AddProject extends Component {
    static propTypes = {
        onClick: PropTypes.func.isRequired,
    }
    render() {
        return (
            <div className="ejianlian-add-project">
                <div className="add-button">
                    <input type="button" onClick={this.props.onClick} value="创建项目" />
                </div>
            </div>
        );
    }
}
