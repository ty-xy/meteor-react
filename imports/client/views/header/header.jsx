import React, { Component } from 'react';
import classnames from 'classnames';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import pureRender from 'pure-render-decorator';
import PropTypes from 'prop-types';

import Notice from './Notice';


@pureRender
class Header extends Component {
    static propTypes = {
        goto: PropTypes.func,
        user: PropTypes.object,
    }
    constructor(...args) {
        super(...args);
        this.state = {
            isShowNotice: false,
            isShowAccount: false,
            selected: 1,
            name: '',
            avatarColor: '',
        };
    }
    componentWillMount() {
        console.log(111, this.props.user);
        if (this.props.user) {
            this.setState({
                name: this.props.user.profile.name,
                avatarColor: this.props.user.profile.avatarColor,
            });
        }
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
    clickTab = (path, index) => {
        this.props.goto(path);
        this.setState({
            selected: index,
        });
        // switch (path) {
        // case '/chat':
        //     this.setState({
        //         selected: 1,
        //     });
        //     break;
        // case '/project':
        //     this.setState({
        //         selected: 2,
        //     });
        //     break;
        // case '/manage':
        //     this.setState({
        //         selected: 3,
        //     });
        //     break;
        // case '/baike':
        //     this.setState({
        //         selected: 4,
        //     });
        //     break;
        // default:
        //     break;
        // }
    }
    handleLogin = () => {
        this.props.goto('/login');
    }

    render() {
        return (
            <div className="ejianlianHeader">
                <div className="ejianlian-header-bar">
                    <div className="ejianlian-header-logo">
                        <img src="/logo.png" />
                    </div>
                    <div className="ejianlian-header-bar-tab">
                        {/* <span>{this.state.selected}</span> */}
                        <ul className="header-bar-tab">
                            <li
                                className={classnames('header-tab chat', this.state.selected === 1 ? 'header-tab-active' : '')}
                                onClick={this.clickTab.bind(this, '/chat', 1)}
                            >消息</li>
                            <li
                                className={classnames('header-tab chat', this.state.selected === 2 ? 'header-tab-active' : '')}
                                onClick={this.clickTab.bind(this, '/project', 2)}
                            >项目</li>
                            <li
                                className={classnames('header-tab chat', this.state.selected === 3 ? 'header-tab-active' : '')}
                                onClick={this.clickTab.bind(this, '/manage', 3)}
                            >管理</li>
                            <li
                                className={classnames('header-tab chat', this.state.selected === 4 ? 'header-tab-active' : '')}
                                onClick={this.clickTab.bind(this, '/baike', 4)}
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
                                <img alt={this.state.name.slice(this.state.name.length - 2, this.state.name.length)} style={{ backgroundColor: `${this.state.avatarColor}` }} />
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

// export default Header;
export default withTracker(() => {
    Meteor.subscribe('userData');
    return {
        user: Meteor.user(),
    };
})(Header);
