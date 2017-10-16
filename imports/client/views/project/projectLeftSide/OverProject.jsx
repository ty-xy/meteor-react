import React, { Component } from 'react';
import pureRender from 'pure-render-decorator';
@pureRender
export default class OverProject extends Component {
    render() {
        return (
            <div className="ejianlian-add-project">
                <div className="project-notice user-avatar">
                    <i className="icon">&#xe610;</i>
                </div>
                <p className="over-project">已归档的项目</p>
            </div>
        );
    }
}
