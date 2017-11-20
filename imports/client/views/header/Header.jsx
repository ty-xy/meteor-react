import React, { Component } from 'react';
import classnames from 'classnames';
import pureRender from 'pure-render-decorator';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import AvatarSelf from '../../components/AvatarSelf';

// import Notice from './Notice';
import eventUtil from '../../../util/eventUtil';


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
        eventUtil.addEvent(document, 'click', this.closeMenu);
    }
    clickTab = (path) => {
        this.context.history.push(path);
    }
    handleLogin = () => {
        this.context.history.push('/login');
    }
    handleBackEnd = () => {
        this.context.history.push('/companySetting');
    }
    closeMenu = (e) => {
        this.setState({
            isShowAccount: false,
        });
        eventUtil.stopProPagation(e);
        eventUtil.removeEvent(document, 'click', this.closeMenu);
    }
    render() {
        return (
            <div className="ejianlianHeader">
                <div className="ejianlian-header-bar">
                    <div className="ejianlian-header-logo">
                        <Link to="/"><img style={{ width: '80px', margin: '12px 20px' }} src="/logo.png" /></Link>
                    </div>
                    <div className="ejianlian-header-bar-tab">
                        <ul className="header-bar-tab">
                            <li
                                className={classnames('header-tab chat', { active: this.context.location.pathname === '/chat' })}
                                onClick={this.clickTab.bind(this, '/chat')}
                            >消息</li>
                            <li
                                className={classnames('header-tab chat', { active: this.context.location.pathname === '/project' })}
                                onClick={this.clickTab.bind(this, '/project')}
                            >项目</li>
                            <li
                                className={classnames('header-tab chat', { active: this.context.location.pathname === '/manage' })}
                                onClick={this.clickTab.bind(this, '/manage')}
                            >管理</li>
                            <li
                                className={classnames('header-tab chat', { active: this.context.location.pathname === '/baike' })}
                                onClick={this.clickTab.bind(this, '/baike')}
                            >百科</li>
                        </ul>
                    </div>
                    <ul className="ejianlian-header-account">
                        <li onClick={this.clickTab.bind(this, '/search')}>
                            <i className="iconfont icon-ejianlain-search icon-sousuo" />
                        </li>
                        <li className="icon-all-notice" onClick={this.handleClick}>
                            <p className="icon-notice-redDot" />
                            <i className="iconfont icon-ejianlain-notice icon-tongzhi" />
                        </li>
                        <li onClick={this.handleBackEnd}>
                            <i className="iconfont icon-ejianlain-pc icon-diannao" />
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
                {/* <Notice style={{ display: this.state.isShowNotice ? 'block' : 'none' }} handleNotice={this.handleClick} /> */}
            </div>
        );
    }
}

export default Header;
