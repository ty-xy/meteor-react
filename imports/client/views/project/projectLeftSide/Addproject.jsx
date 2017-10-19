import React, { Component } from 'react';
import pureRender from 'pure-render-decorator';
import PropTypes from 'prop-types';

@pureRender
export default class AddProject extends Component {
    static propTypes = {
        onClick: PropTypes.func.isRequired,
        value: PropTypes.string,
    }
    render() {
        return (
            <div className="ejianlian-add-projectf">
                <div className="add-button" onClick={this.props.onClick}>
                    {/* <input type="button" value="创建项目" >' */}
                    {this.props.value}
                </div>
            </div>
        );
    }
}
