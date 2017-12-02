import React, { Component } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import UserUtil, { userIdToInfo } from '../../util/user';

class Notification extends Component {
    static contextTypes = {
        history: PropTypes.object,
        location: PropTypes.object,
    }
    static propTypes = {
        history: PropTypes.object,
        _id: PropTypes.string,
        peo: PropTypes.array,
        companys: PropTypes.array,
        allUsers: PropTypes.array,
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
            (err, res) => {
                console.log('readLog', err, res);
            },
        );
    }
    // 前往查看
    gotoLook = (e, _id, arg) => {
        e.preventDefault();
        const { nickname, plan, finish, help, num, peos } = arg;
        Meteor.call(
            'readLog',
            (_id),
            (err) => {
                if (!err) {
                    this.context.history.push({ pathname: '/manage/logging/detail', state: { nickname, plan, finish, _id, help, num, peos } });
                }
            },
        );
    }
    render() {
        // const { isRead } = this.state;
        const { _id, peo, companys, allUsers, ...arg } = this.props;
        let isRead; let rejectLook;
        for (let i = 0; i < peo.length; i++) {
            if (peo[i].userId === Meteor.userId()) {
                isRead = peo[i].isRead;
                rejectLook = peo[i].rejectLook;
                break;
            }
        }
        let companyName = '';
        for (let i = 0; i < companys.length; i++) {
            if (companys[i]._id === UserUtil.getMainCompany()) {
                companyName = companys[i].name;
                break;
            }
        }
        return (
            <div className={classnames('e-notification', { 'e-notification-show': !isRead && !rejectLook })}>
                <i className="iconfont icon-guanbi e-notification-close" onClick={() => this.hideNotification(_id)} />
                <p>来自 {companyName}</p>
                <div className="e-notification-content clearfix margin-top-20">
                    <div className="e-notification-avatar"><img src="/start.png" /></div>
                    <div className="e-notification-desc">
                        <p className="title">「{arg.type}」— {userIdToInfo.getName(allUsers, arg.userId)}的{arg.type}</p>
                        <p className="desc">&nbsp;{userIdToInfo.getName(allUsers, arg.userId)}向您提交了{arg.type}，<a href="" onClick={e => this.gotoLook(e, _id, arg)}>点击前往查看</a></p>
                    </div>
                </div>
            </div>
        );
    }
}

export default Notification;
