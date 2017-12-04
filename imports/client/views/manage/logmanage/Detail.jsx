import React, { PureComponent, Component } from 'react';
import { Row, Col } from 'antd';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { userIdToInfo } from '../../../../util/user';
import Notice from '../../../../schema/notice';
import Log from '../../../../schema/log';


class Detail extends (PureComponent || Component) {
    state = {
        members: {},
    }
    goback = (e) => {
        e.preventDefault();
        this.props.history.push('/chat');
    }
    render() {
        const { id } = this.props.match.params || {};
        let logInfo = {};
        let members = [];
        const { allUsers, toMembers, logs } = this.props;

        logs.forEach((item) => {
            if (item._id === id) {
                logInfo = item;
            }
        });
        const { nickname, finish, plan, help, _id, noticeId } = logInfo;
        if (noticeId) {
            toMembers.forEach((item) => {
                if (noticeId === item._id) {
                    members = item.toMembers;
                }
            });
        }
        let num = 0;
        members.forEach((item) => {
            if (item.isRead) {
                num++;
            }
        });
        const colors = [
            '#7986CB', '#4DB6AC', '#9575CD', '#F06292', '#7986CB',
            '#4DB6AC', '#9575CD', '#F06292', '#7986CB', '#4DB6AC',
            '#9575CD', '#F06292', '#7986CB', '#4DB6AC', '#9575CD',
            '#F06292', '#7986CB', '#4DB6AC', '#9575CD', '#F06292',
            '#7986CB', '#4DB6AC', '#9575CD', '#F06292', '#7986CB',
            '#4DB6AC', '#9575CD', '#F06292', '#7986CB', '#4DB6AC',
            '#9575CD', '#F06292', '#7986CB', '#4DB6AC', '#9575CD',
            '#F06292', '#7986CB', '#4DB6AC', '#9575CD', '#F06292',
        ];
        const styles = {
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: colors[Math.round(Math.random() * 4)],
            color: '#fff',
            marginRight: '0px',
            lineHeight: '36px',
            marginBottom: '0px',
        };
        return (
            <Row className="e-mg-log-details">
                <Col span={24} className="e-mg-log-details-header">
                    <a href="" onClick={this.goback}>关闭</a>
                    <span>{userIdToInfo.getName(allUsers, _id)}的日志</span>
                </Col>
                <Col span={24} className="e-mg-log-details-content">
                    <Col span={24} className="e-mg-log-details-area">
                        <img src={userIdToInfo.getAvatar(allUsers, _id) || 'http://k2.jsqq.net/uploads/allimg/1706/7_170629152344_5.jpg'} width="56px" /><span className="title">{nickname}</span>
                    </Col>
                    <Col span={24} className="e-mg-log-details-area">
                        <p>今日完成任务</p>
                        <p>{finish || '暂无输入'}</p>
                    </Col>
                    <Col span={24} className="e-mg-log-details-area">
                        <p>未完成任务</p>
                        <p>{plan || '暂无输入'}</p>
                    </Col>
                    <Col span={24} className="e-mg-log-details-area">
                        <p>需要协调的任务</p>
                        <p>{help || '暂无输入'}</p>
                    </Col>
                    <Col span={24} className="e-mg-log-details-footer">
                        <p>{num}人已读</p>
                        <Col span={24} data-peos={members}>
                            {
                                members.map((item) => {
                                    if (item.isRead) {
                                        return (
                                            <span key={item.userId}>
                                                {userIdToInfo.getAvatar(allUsers, item.userId) ?
                                                    <img src={userIdToInfo.getAvatar(allUsers, item.userId) || '无头像'} width="36" />
                                                    : <span style={styles}>{userIdToInfo.getName(allUsers, item.userId).substr(-2, 3)}</span>
                                                }
                                                <p>{userIdToInfo.getName(allUsers, item.userId)}</p>
                                            </span>
                                        );
                                    }
                                    return null;
                                })
                            }
                        </Col>
                    </Col>
                </Col>
            </Row>
        );
    }
}
// Detail.propTypes = {
//     nickname: PropTypes.string,
//     avatar: PropTypes.string,
//     plan: PropTypes.string,
//     finish: PropTypes.string,
//     help: PropTypes.string,
//     num: PropTypes.string,
//     peos: PropTypes.array,
// };
export default withTracker(() => {
    Meteor.subscribe('users');
    Meteor.subscribe('notice');
    Meteor.subscribe('log');
    return {
        allUsers: Meteor.users.find().fetch(),
        toMembers: Notice.find().fetch(),
        logs: Log.find().fetch(),
    };
})(Detail);

