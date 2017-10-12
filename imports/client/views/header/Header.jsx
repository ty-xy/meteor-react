import React, { Component } from 'react';
import classnames from 'classnames';
import pureRender from 'pure-render-decorator';
import PropTypes from 'prop-types';
import AvatarSelf from '../../components/AvatarSelf';

import Notice from './Notice';


@pureRender
class Header extends Component {
    static contextTypes = {
        history: PropTypes.object,
        location: PropTypes.object,
    }
    constructor(...args) {
        super(...args);
        this.state = {
            isShowNotice: false,
            isShowAccount: false,
        };
    }
    handleClick = () => {
        this.setState({
            isShowNotice: !this.state.isShowNotice,
        });
    }
    handleShowAccount = () => {
        this.setState({
            isShowAccount: !this.state.isShowAccount,
        });
    }
    clickTab = (path) => {
        this.context.history.push(path);
    }
    handleLogin = () => {
        this.context.history.push('/login');
    }

    render() {
        return (
            <div className="ejianlianHeader">
                <div className="ejianlian-header-bar">
                    <div className="ejianlian-header-logo">
                        <img src="/logo.png" />
                    </div>
                    <div className="ejianlian-header-bar-tab">
                        <ul className="header-bar-tab">
                            <li
                                className={classnames('header-tab chat', { 'header-tab-active': this.context.location.pathname === '/chat' })}
                                onClick={this.clickTab.bind(this, '/chat')}
                            >消息</li>
                            <li
                                className={classnames('header-tab chat', { 'header-tab-active': this.context.location.pathname === '/project' })}
                                onClick={this.clickTab.bind(this, '/project')}
                            >项目</li>
                            <li
                                className={classnames('header-tab chat', { 'header-tab-active': this.context.location.pathname === '/manage' })}
                                onClick={this.clickTab.bind(this, '/manage')}
                            >管理</li>
                            <li
                                className={classnames('header-tab chat', { 'header-tab-active': this.context.location.pathname === '/baike' })}
                                onClick={this.clickTab.bind(this, '/baike')}
                            >百科</li>
                        </ul>
                    </div>
                    <ul className="ejianlian-header-account">
                        {/* <li className="header-search-all">
                            <input type="text" placeholder="请输入关键词"/>>
                            <span className="close-search">X</span>
                        </li> */}
                        <li>
                            <i className="icon icon-ejianlain-search">&#xe628;</i>
                        </li>
                        <li className="icon-all-notice" onClick={this.handleClick}>
                            <p className="icon-notice-redDot" />
                            <i className="icon icon-ejianlain-notice">&#xe65e;</i>
                        </li>
                        <li>
                            <i className="icon icon-ejianlain-pc">&#xe77c;</i>
                        </li>
                        <li className="admin-account" onClick={this.handleShowAccount}>
                            <p className="account-avatar">
                                <AvatarSelf />
                            </p>
                        </li>
                    </ul>
                    <ul className="account-setting" style={{ display: this.state.isShowAccount ? 'block' : 'none' }}>
                        <div className="triangle-up" />
                        <li className="account-message" onClick={this.clickTab.bind(this, '/adminInfo')}>个人资料</li>
                        <li>下载应用</li>
                        <li>使用帮助</li>
                        <li onClick={this.handleLogin}>退出登录</li>
                    </ul>
                </div>
                <Notice style={{ display: this.state.isShowNotice ? 'block' : 'none' }} handleNotice={this.handleClick} />
            </div>
        );
    }
}

export default Header;
