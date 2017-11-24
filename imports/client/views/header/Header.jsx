import React, { Component } from 'react';
import classnames from 'classnames';
import pureRender from 'pure-render-decorator';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Modal } from 'antd';
import { Meteor } from 'meteor/meteor';

import AvatarSelf from '../../components/AvatarSelf';
import SelectBackendTeam from '../../features/SelectBackendTeam';
import feedback from '../../../util/feedback';


// import Notice from './Notice';

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
            isShowBackend: false,
            value: 1,
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
        document.addEventListener('click', this.closeMenu);
    }
    clickTab = (path) => {
        this.context.history.push(path);
    }
    handleLogin = () => {
        this.context.history.push('/login');
    }
    closeMenu = () => {
        this.setState({
            isShowAccount: false,
        });
        document.removeEventListener('click', this.closeMenu);
    }
    showModal = () => {
        this.setState({
            isShowBackend: true,
        });
    }
    handleCancel = (e) => {
        console.log(e);
        this.setState({
            isShowBackend: false,
        });
    }
    selectBackendTeam = (companyId) => {
        Meteor.call('selectBackendTeam', companyId, (error) => {
            if (error) {
                feedback.dealError(error);
            }
            feedback.successToast('选择成功');
            this.context.history.push('/companySetting');
        });
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
                        <li onClick={this.showModal}>
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
                <Modal
                    title="选择团队"
                    visible={this.state.isShowBackend}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    wrapClassName="create-team-mask"
                    footer={null}
                >
                    <SelectBackendTeam selectBackendTeam={this.selectBackendTeam} />
                </Modal>
                {/* <Notice style={{ display: this.state.isShowNotice ? 'block' : 'none' }} handleNotice={this.handleClick} /> */}
            </div>
        );
    }
}

export default Header;
