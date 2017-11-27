import React, { Component } from 'react';
import classnames from 'classnames';
import pureRender from 'pure-render-decorator';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Button, Tooltip, Icon } from 'antd';
import { Meteor } from 'meteor/meteor';

import feedback from '../../../util/feedback';

const text = <span>帮助</span>;

@pureRender
class BackEnd extends Component {
    static contextTypes = {
        history: PropTypes.object,
        location: PropTypes.object,
    }
    clickTab = (path) => {
        this.context.history.push(path);
    }
    // 退出当前后台
    quitBackend = () => {
        this.context.history.push('/chat');
        Meteor.call('quitBackendTeam', (error, result) => {
            feedback.dealError(error);
            if (result) {
                feedback.dealSuccess('退出成功');
            }
        });
    }
    render() {
        return (
            <div className="ejianlianHeader">
                <div className="ejianlian-header-bar">
                    <div className="ejianlian-header-logo">
                        <Link to="/chat"><img src="/logo.png" style={{ width: '80px', margin: '12px 20px' }} /></Link>
                    </div>
                    <div className="ejianlian-header-bar-tab">
                        <ul className="header-bar-tab backend-nav">
                            <li
                                className={classnames('header-tab chat', { active: this.context.location.pathname === '/companySetting' })}
                                onClick={this.clickTab.bind(this, '/companySetting')}
                            >企业设置</li>
                            <li
                                className={classnames('header-tab chat', { active: this.context.location.pathname === '/organization' })}
                                onClick={this.clickTab.bind(this, '/organization')}
                            >组织结构</li>
                            <li
                                className={classnames('header-tab chat', { active: this.context.location.pathname === '/position' })}
                                onClick={this.clickTab.bind(this, '/position')}
                            >职务角色</li>
                            <li
                                className={classnames('header-tab chat', { active: this.context.location.pathname === '/applySettings' })}
                                onClick={this.clickTab.bind(this, '/applySettings')}
                            >
                                应用设置</li>
                            <li
                                className={classnames('header-tab chat', { active: this.context.location.pathname === '/statistics' })}
                                onClick={this.clickTab.bind(this, '/statistics')}
                            >数据统计</li>
                        </ul>
                    </div>
                    <ul className="backend-right">
                        <li className="backend-help">
                            <Tooltip placement="top" title={text}>
                                <Icon type="question-circle-o" />&nbsp;
                                <span>帮助</span>
                            </Tooltip>
                        </li>
                        <li >
                            <Button onClick={this.quitBackend}>安全退出</Button>
                        </li>
                    </ul>
                </div>
            </div>
        );
    }
}

export default BackEnd;
