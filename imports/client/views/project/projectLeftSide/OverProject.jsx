import React, { Component } from 'react';
import pureRender from 'pure-render-decorator';
import Icon from '../../../components/Icon';
@pureRender
export default class OverProject extends Component {
    render() {
        return (
            <div className="ejianlian-add-project">
                <div className="project-notice user-avatar">
                    <Icon icon="icon-guidangxiangmu  icon" />
                </div>
                <p className="over-project">已归档的项目</p>
            </div>
        );
    }
}
