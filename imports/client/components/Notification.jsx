import React, { Component } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';

class Notification extends Component {
    static contextTypes = {
        history: PropTypes.object,
        location: PropTypes.object,
    }
    static propTypes = {
        history: PropTypes.object,
        _id: PropTypes.string,
        peo: PropTypes.array,
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
        console.log('arg', _id, { ...arg });
        e.preventDefault();
        const { nickname, plan, finish, help, num, peos } = arg;
        Meteor.call(
            'readLog',
            (_id),
            (err, res) => {
                console.log('readLog', err, res);
            },
        );
        this.context.history.push({ pathname: '/manage/logging/detail', state: { nickname, plan, finish, _id, help, num, peos } });
    }
    render() {
        // const { isRead } = this.state;
        const { _id, peo, ...arg } = this.props;
        let isRead; let rejectLook;
        for (let i = 0; i < peo.length; i++) {
            if (peo[i].userId === Meteor.userId()) {
                isRead = peo[i].isRead;
                rejectLook = peo[i].rejectLook;
                break;
            }
        }
        // console.log('Notification', isRead, rejectLook, peo);
        return (
            <div className={classnames('e-notification', { 'e-notification-show': !isRead && !rejectLook })}>
                <i className="iconfont icon-guanbi e-notification-close" onClick={() => this.hideNotification(_id)} />
                <p>来自 知工小分队</p>
                <div className="e-notification-content clearfix margin-top-20">
                    <div className="e-notification-avatar"><img src="/start.png" /></div>
                    <div className="e-notification-desc">
                        <p className="title">「日志」— 老徐的日志</p>
                        <p className="desc">&nbsp;老徐向您提交了日志，<a href="" onClick={e => this.gotoLook(e, _id, arg)}>点击前往查看</a></p>
                    </div>
                </div>
            </div>
        );
    }
}

export default Notification;
