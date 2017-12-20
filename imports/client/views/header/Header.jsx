import React, { Component } from 'react';
import classnames from 'classnames';
import pureRender from 'pure-render-decorator';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Modal } from 'antd';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import format from 'date-format';

import AvatarSelf from '../../components/AvatarSelf';
import SelectBackendTeam from '../../features/SelectBackendTeam';
import feedback from '../../../util/feedback';
import UserUtil, { userIdToInfo } from '../../../util/user';
import fields from '../../../util/fields';
import Company from '../../../schema/company';
import Notice from '../../../schema/notice';
import MyNotification from '../../components/Notification';
import MyModel from '../manage/audit/component/MyModel';


// import Notice from './Notice';
const colors = ['#7986CB', '#4DB6AC', '#9575CD', '#F06292'];
const auditTypes = ['事假', '病假', '年假', '调休', '婚假', '产假', '陪产假', '路途假', '其他', '出差', '报销', '通用审批'];

const logTypes = ['日报', '月报', '周报'];


@pureRender
class Header extends Component {
    static contextTypes = {
        history: PropTypes.object,
        location: PropTypes.object,
    }
    static propTypes = {
        currentCompanyId: PropTypes.string,
        notices: PropTypes.array,
        allUsers: PropTypes.array,
        companys: PropTypes.array,
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
            isShowNotice: true,
        });
    }
    // 关闭全局提醒
    handleCloseNotice = () => {
        this.setState({
            isShowNotice: false,
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
        Meteor.logout();
    }
    closeMenu = () => {
        this.setState({
            isShowAccount: false,
        });
        document.removeEventListener('click', this.closeMenu);
    }
    showModal = () => {
        if (!this.props.currentCompanyId) {
            this.setState({
                isShowBackend: true,
            });
            return;
        }
        this.context.history.push('/companySetting');
    }
    handleCancel = () => {
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
    // 前往查看
    gotoLook = (e, arg) => {
        e.preventDefault();
        const { logId, _id, noticeType } = arg;
        this.setState({ isShowNotice: false }, () => {
            Meteor.call(
                'readLog',
                (_id),
                (err) => {
                    if (!err) {
                        if (auditTypes.indexOf(noticeType) > -1) {
                            this.context.history.push('/manage/audit/approvaling');
                        } else if (noticeType === '公告') {
                            this.context.history.push(`/manage/notice/detail/${logId}`);
                        } else {
                            this.context.history.push({ pathname: `/manage/logging/detail/${logId}` });
                        }
                    }
                },
            );
        });
    }
    // 全局消息model
    globalModel = (notices, allUsers, companys) => (
        <div className="e-global-notification">
            {
                notices.map((item, index) => {
                    const { userCompany, toMembers } = item;
                    let companyName = '';
                    let isRead;
                    for (let i = 0; i < toMembers.length; i++) {
                        if (toMembers[i].userId === Meteor.userId()) {
                            isRead = toMembers[i].isRead;
                            break;
                        }
                    }
                    for (let i = 0; i < companys.length; i++) {
                        if (companys[i]._id === userCompany) {
                            companyName = companys[i].name;
                            break;
                        }
                    }

                    if (item.noticeType === '公告') {
                        return (
                            <div key={item._id} className="list list-notice">
                                <p className="title">来自 &nbsp;{companyName}<span>{format('yyyy.MM.dd hh:mm', item.createdAt)}</span></p>
                                <div className="list-content clearfix margin-top-20">
                                    <div className="list-avatar">
                                        {userIdToInfo.getAvatar(allUsers, item.from) ?
                                            <img src={userIdToInfo.getAvatar(allUsers, item.from)} />
                                            : <span className="no-avatar" style={{ background: colors[index % 4] }}>{userIdToInfo.getName(allUsers, item.from).substr(-2, 2)}</span>
                                        }
                                    </div>
                                    <div className="list-desc">
                                        <p className="title">「{item.noticeType}」— {userIdToInfo.getName(allUsers, item.from)}的{item.noticeType}</p>
                                        <p className="desc">&nbsp;{userIdToInfo.getName(allUsers, item.from)}发布的{item.noticeType}，<a href="" onClick={e => this.gotoLook(e, { ...item })}>点击前往查看</a></p>
                                    </div>
                                    {!isRead && <div className="list-pointer"><span /></div>}
                                </div>
                            </div>
                        );
                    }
                    return null;
                })
            }
            {
                notices.map((item, index) => {
                    const { toMembers = [], userCompany } = item;
                    let isRead;
                    for (let i = 0; i < toMembers.length; i++) {
                        if (toMembers[i].userId === Meteor.userId()) {
                            isRead = toMembers[i].isRead;
                            break;
                        }
                    }
                    let companyName = '';
                    for (let i = 0; i < companys.length; i++) {
                        if (companys[i]._id === userCompany) {
                            companyName = companys[i].name;
                            break;
                        }
                    }
                    const logAuditTypes = [...logTypes, ...auditTypes];
                    if (logAuditTypes.indexOf(item.noticeType) > -1) {
                        return (
                            !isRead ?
                                <div key={item._id} className="list">
                                    <p className="title">来自 &nbsp;{companyName}<span>{format('yyyy.MM.dd hh:mm', item.createdAt)}</span></p>
                                    <div className="list-content clearfix margin-top-20">
                                        <div className="list-avatar">{userIdToInfo.getAvatar(allUsers, item.from) ?
                                            <img src={userIdToInfo.getAvatar(allUsers, item.from)} />
                                            : <span className="no-avatar" style={{ background: colors[index % 4] }}>{userIdToInfo.getName(allUsers, item.from).substr(-2, 2)}</span>
                                        }
                                        </div>
                                        <div className="list-desc">
                                            <p className="title">「{item.noticeType}」— {userIdToInfo.getName(allUsers, item.from)}的{item.noticeType}</p>
                                            <p className="desc">&nbsp;{userIdToInfo.getName(allUsers, item.from)}发布的{item.noticeType}，<a href="" onClick={e => this.gotoLook(e, { ...item })}>点击前往查看</a></p>
                                        </div>
                                        {!item.isRead && <div className="list-pointer"><span /></div>}
                                    </div>
                                </div> : null
                        );
                    }
                    return null;
                })
            }
        </div>
    )
    render() {
        const { notices, allUsers, companys } = this.props;
        const { isShowNotice } = this.state;
        return (
            <div className="ejianlianHeader">
                <div className="e-notification-wrap clearfix">
                    {
                        notices.map((item) => {
                            let isRead; let rejectRead;
                            for (let i = 0; i < item.toMembers.length; i++) {
                                if (item.toMembers[i].userId === Meteor.userId()) {
                                    isRead = item.toMembers[i].isRead;
                                    rejectRead = item.toMembers[i].rejectRead;
                                    break;
                                }
                            }
                            if (!isRead && !rejectRead) {
                                return <MyNotification key={item._id} {...item} {...this.props} {...this.context} />;
                            }
                            return null;
                        },
                        )
                    }
                </div>
                <div className="ejianlian-header-bar">
                    <div className="ejianlian-header-logo">
                        <Link to="/chat">
                            <img src="/logo_slougo.jpg" />
                            <span>一键联通好管理</span>
                        </Link>
                    </div>
                    <div className="ejianlian-header-bar-tab">
                        <ul className="header-bar-tab">
                            <li
                                className={classnames('header-tab chat', { active: this.context.location.pathname === '/chat' })}
                                onClick={this.clickTab.bind(this, '/chat')}
                            ><i className="iconfont icon-mimiliwu" />消息</li>
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
                            {(notices && notices.length) ? <p className="icon-notice-redDot" /> : null}
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
                <MyModel
                    handleCancel={this.handleCloseNotice}
                    show={isShowNotice}
                    mask={isShowNotice}
                    footer={<div />}
                    title="通知"
                    height="100%"
                >
                    {this.globalModel(notices, allUsers, companys)}
                </MyModel>
                {/* <Notice style={{ display: this.state.isShowNotice ? 'block' : 'none' }} handleNotice={this.handleClick} /> */}
            </div>
        );
    }
}

export default withTracker(() => {
    Meteor.subscribe('company');
    Meteor.subscribe('notices');
    Meteor.subscribe('users');
    const currentCompanyId = UserUtil.getCurrentBackendCompany();
    const userId = Meteor.userId();
    let notices = [];
    notices = Notice.find({ 'toMembers.userId': userId }, { sort: { createdAt: -1 } }).fetch();
    notices = notices.filter(item => (item.from !== userId));
    return {
        currentCompanyId,
        notices,
        companys: Company.find({}, { fields: fields.createdcompany }).fetch(),
        allUsers: Meteor.users.find({}, { fields: fields.getUsername }).fetch(),
    };
})(Header);

