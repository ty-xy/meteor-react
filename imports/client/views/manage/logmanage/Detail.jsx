import React, { PureComponent, Component } from 'react';
import { Row, Col } from 'antd';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { userIdToInfo } from '../../../../util/user';
import Notice from '../../../../schema/notice';
import Log from '../../../../schema/log';
import File from '../../../../schema/file';

import ImageViewer from '../../../features/ImageViewer';


class Detail extends (PureComponent || Component) {
    state = {
        members: {},
    }
    componentDidMount() {
        const { id } = this.props.match.params || {};
        const { toMembers } = this.props;
        toMembers.forEach((item) => {
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
    closeImageViewer = (index, bool) => {
        this.setState({
            [`showImgViewer${index}`]: bool,
        });
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
        const { nickname, finish, plan, help, _id, noticeId, img = [], file = [] } = logInfo;
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
                    {
                        img.length ? <Col span={24} className="margin-top-20">
                            <p>图片</p>
                            {img.map((item, index) => (<span key={item}>
                                <span className="margin-right-10">
                                    <img
                                        width="80"
                                        src={`http://oxldjnom8.bkt.clouddn.com/${item}`}
                                        ref={i => this.img = i}
                                        onLoad={this.imageLoad}
                                        onDoubleClick={() => this.closeImageViewer(index, true)}
                                        onError={() => this.img.src = 'http://oxldjnom8.bkt.clouddn.com/404Img.jpeg'}
                                    />
                                </span>
                                {
                                    this.state[`showImgViewer${index}`] ?
                                        <ImageViewer
                                            download
                                            image={`http://oxldjnom8.bkt.clouddn.com/${item}`}
                                            closeImage={() => this.closeImageViewer(index, false)}
                                        />
                                        : null
                                }
                            </span>))}
                        </Col> : null
                    }
                    {
                        file.length ? <Col span={24} className="e-mg-log-details-area">
                            <p>附件</p>
                            {file.map(item => (<p key={item}><a download href={File.findOne({ _id: item }) && File.findOne({ _id: item }).url}>{File.findOne({ _id: item }) && File.findOne({ _id: item }).name}</a></p>))}
                        </Col> : null
                    }
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
                                                    : <span style={{ ...styles, background: colors[index] }}>{userIdToInfo.getName(allUsers, item.userId).substr(-2, 3)}</span>
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
export default withTracker(() => {
    Meteor.subscribe('users');
    Meteor.subscribe('notice');
    Meteor.subscribe('log');
    Meteor.subscribe('files');
    return {
        allUsers: Meteor.users.find().fetch(),
        toMembers: Notice.find().fetch(),
        logs: Log.find().fetch(),
        files: File.find().fetch(),
    };
})(Detail);

