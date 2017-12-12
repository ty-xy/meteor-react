import React, { PureComponent, Component } from 'react';
import { Row, Col } from 'antd';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { userIdToInfo } from '../../../../../util/user';
import Notice from '../../../../../schema/notice';
import Notifications from '../../../../../schema/notification';


class Detail extends (PureComponent || Component) {
    state = {
        members: {},
    }
    componentDidMount() {
        const { id } = this.props.match.params || {};
        const { notices } = this.props;
        notices.forEach((item) => {
            if (item.logId === id) {
                Meteor.call(
                    'readLog',
                    (item._id),
                );
            }
        });
    }
    goback = (e) => {
        e.preventDefault();
        this.props.history.goBack();
    }
    render() {
        const { id } = this.props.match.params || {};
        let logInfo = {};
        let members = [];
        const { allUsers, notices, notifications } = this.props;
        // console.log('detail', this.props);
        notifications.forEach((item) => {
            if (item._id === id) {
                logInfo = item;
            }
        });
        const { title, noticeId, content, userId, username } = logInfo;
        if (noticeId) {
            notices.forEach((item) => {
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
            '#7986CB', '#4DB6AC', '#9575CD', '#F06292',
        ];
        const styles = {
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            color: '#fff',
            marginRight: '0px',
            lineHeight: '36px',
            marginBottom: '0px',
        };
        return (
            <Row className="e-mg-log-details">
                <Col span={24} className="e-mg-log-details-header">
                    <a href="" onClick={this.goback}>关闭</a>
                    <span>{userIdToInfo.getName(allUsers, userId)}发布的公告</span>
                </Col>
                <Col span={24} className="e-mg-log-details-content">
                    <Col span={24} className="e-mg-log-details-area">
                        {userIdToInfo.getAvatar(allUsers, userId) ?
                            <img src={userIdToInfo.getAvatar(allUsers, userId) || '无头像'} width="36" />
                            : <span className="e-mg-log-card-noAvatar">{(username || '').substr(-2, 3)}</span>
                        }
                    </Col>
                    <Col span={24} className="e-mg-log-details-area">
                        <p>题目</p>
                        <p>{title || '暂无内容'}</p>
                    </Col>
                    <Col span={24} className="e-mg-log-details-area">
                        <p>内容</p>
                        <p>{content || '暂无内容'}</p>
                    </Col>
                    <Col span={24} className="e-mg-log-details-footer">
                        <p>{num}人已读</p>
                        <Col span={24} data-peos={members}>
                            {
                                members.map((item, index) => {
                                    if (item.isRead) {
                                        return (
                                            <span key={item.userId}>
                                                {userIdToInfo.getAvatar(allUsers, item.userId) ?
                                                    <img src={userIdToInfo.getAvatar(allUsers, item.userId) || '无头像'} width="36" />
                                                    : <span style={{ ...styles, background: colors[index % 4] }}>{userIdToInfo.getName(allUsers, item.userId).substr(-2, 3)}</span>
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
Detail.propTypes = {

    // notifications: PropTypes.array,
};
export default withTracker(() => {
    Meteor.subscribe('users');
    Meteor.subscribe('notice');
    Meteor.subscribe('notification');
    return {
        allUsers: Meteor.users.find().fetch(),
        notices: Notice.find({ noticeType: '公告' }).fetch(),
        notifications: Notifications.find().fetch(),
    };
})(Detail);

