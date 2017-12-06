import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { userIdToInfo } from '../../util/user';

class Notification extends Component {
    static contextTypes = {
        history: PropTypes.object,
        location: PropTypes.object,
    }
    static propTypes = {
        history: PropTypes.object,
        _id: PropTypes.string,
        toMembers: PropTypes.array,
        companys: PropTypes.array,
        allUsers: PropTypes.array,
        userCompany: PropTypes.string,
        from: PropTypes.string,
    }
    constructor(...args) {
        super(...args);
        this.state = {
        };
    }
    hideNotification = (_id) => {
        Meteor.call(
            'rejectLook',
            (_id),
        );
    }
    // 前往查看
    gotoLook = (e, _id, arg) => {
        e.preventDefault();
        const { nickname, plan, finish, help, num, toMembers, logId } = arg;
        const types = ['事假', '病假', '年假', '调休', '婚假', '产假', '陪产假', '路途假', '其他', '出差', '报销', '通用审批'];
        Meteor.call(
            'readLog',
            (_id),
            (err) => {
                if (!err) {
                    if (types.indexOf(arg.noticeType) > -1) {
                        this.context.history.push('/manage/audit/approvaling');
                    } else if (arg.noticeType === '公告') {
                        this.context.history.push(`/manage/notice/detail/${logId}`);
                    } else {
                        this.context.history.push({ pathname: `/manage/logging/detail/${logId}`, state: { nickname, plan, finish, _id, help, num, toMembers } });
                    }
                }
            },
        );
    }
    render() {
        // const { isRead } = this.state;
        const { _id, toMembers = [], companys, userCompany, from, allUsers, ...arg } = this.props;
        let isRead; let rejectRead;
        for (let i = 0; i < toMembers.length; i++) {
            if (toMembers[i].userId === Meteor.userId()) {
                isRead = toMembers[i].isRead;
                rejectRead = toMembers[i].rejectRead;
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
        return (
            !isRead && !rejectRead ?
                <div className="e-notification">
                    <i className="iconfont icon-guanbi e-notification-close" onClick={() => this.hideNotification(_id)} />
                    <p>来自 {companyName}</p>
                    <div className="e-notification-content clearfix margin-top-20">
                        <div className="e-notification-avatar"><img src="/start.png" /></div>
                        <div className="e-notification-desc">
                            <p className="title">「{arg.noticeType}」— {userIdToInfo.getName(allUsers, from)}的{arg.noticeType}</p>
                            <p className="desc">&nbsp;{userIdToInfo.getName(allUsers, from)}提交了{arg.noticeType}，<a href="" onClick={e => this.gotoLook(e, _id, { toMembers, companys, userCompany, from, allUsers, ...arg })}>点击前往查看</a></p>
                        </div>
                    </div>
                </div>
                : <div />
        );
    }
}

export default Notification;
