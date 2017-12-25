import React, { PureComponent, Component } from 'react';
import { Row, Col, Button, Input } from 'antd';
import { Meteor } from 'meteor/meteor';
import format from 'date-format';
import { withTracker } from 'meteor/react-meteor-data';
import { userIdToInfo } from '../../../../util/user';
import Notice from '../../../../schema/notice';
import Log from '../../../../schema/log';
import File from '../../../../schema/file';
import feedback from '../../../../util/feedback';

import ImageViewer from '../../../features/ImageViewer';

const { TextArea } = Input;

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
    // 提交评论
    handleSubmitComment = () => {
        const { id } = this.props.match.params || {};
        const { content, to } = this.state;
        console.log('to', content, to);
        Meteor.call(
            'commentLog',
            {
                _id: id,
                content,
                to: to || this.props.logInfo.userId,
                noticeType: to ? '评论回复' : '日报评论',
            },
            (err, res) => {
                if (res) {
                    feedback.successToast('评论成功');
                    this.setState({ content: '' });
                } else {
                    feedback.successToast('评论失败');
                }
            },
        );
    }
    handleChange = (e) => {
        this.setState({ content: e.target.value });
    }
    // 回复
    handleFocus = (e, to) => {
        e.preventDefault();
        this.setState({
            content: `回复@${userIdToInfo.getName(this.props.allUsers, to)}：`,
            to,
        });
        this.comments.focus();
    }
    render() {
        let members = [];
        const { allUsers, toMembers, logInfo } = this.props;
        const { nickname, finish, plan, help, userId, noticeId, img = [], file = [], comments = [] } = logInfo || {};
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
            '#7986CB', '#4DB6AC', '#9575CD', '#F06292',
        ];
        const styles = {
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            color: '#fff',
            marginRight: '0px',
            lineHeight: '36px',
            marginBottom: '5px',
        };
        return (
            <Row className="e-mg-log-details">
                <Col span={24} className="e-mg-log-details-header">
                    <a href="" onClick={this.goback}>关闭</a>
                    <span>{nickname}的日志</span>
                </Col>
                <Col span={24} className="e-mg-log-details-content">
                    <Col span={24} className="e-mg-log-details-area">
                        {userIdToInfo.getAvatar(allUsers, userId) ?
                            <img src={userIdToInfo.getAvatar(allUsers, userId) || '无头像'} width="36" />
                            : <span className="e-mg-log-card-noAvatar">{(nickname || '').substr(-2, 3)}</span>
                        }
                    </Col>
                    <Col span={24} className="e-mg-log-details-area">
                        <p>今日完成任务</p>
                        {finish ? <div dangerouslySetInnerHTML={{ __html: finish }} /> : <p>暂无输入</p>}
                    </Col>
                    <Col span={24} className="e-mg-log-details-area">
                        <p>未完成任务</p>
                        {plan ? <div dangerouslySetInnerHTML={{ __html: plan }} /> : <p>暂无输入</p>}
                    </Col>
                    <Col span={24} className="e-mg-log-details-area">
                        <p>需要协调的任务</p>
                        {help ? <div dangerouslySetInnerHTML={{ __html: help }} /> : <p>暂无输入</p>}
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
                    <Col span={24} className="e-mg-log-details-footer-readed">
                        <p>已读 {num}人</p>
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
                    <Col span={24} className="e-mg-log-details-footer-comment">
                        <p>评论 {comments.length}</p>
                        <Col span={24} data-peos={members}>
                            {
                                comments.map((item, index) => (
                                    <div href="" className="e-log-comment" key={index}>
                                        <div className="e-log-comment-avatar">
                                            {userIdToInfo.getAvatar(allUsers, item.from) ?
                                                <img src={userIdToInfo.getAvatar(allUsers, item.from) || '无头像'} width="36" />
                                                : <span style={{ ...styles, background: colors[index % 4] }}>{userIdToInfo.getName(allUsers, item.from).substr(-2, 3)}</span>
                                            }
                                        </div>
                                        <div className="e-log-comment-content">
                                            <p><a className="comment-a" href="" onClick={e => this.handleFocus(e, item.from)}>{userIdToInfo.getName(allUsers, item.from)}<span>{format('yyyy-MM-dd', item.createAt)}</span></a></p>
                                            <p style={{ marginTop: '6px' }}>{item.content}</p>
                                        </div>
                                    </div>
                                ))
                            }
                        </Col>
                        <Col span={24} className="e-log-comment-btn">
                            <Col span={24}>
                                <TextArea placeholder="评论日志" value={this.state.content} rows={3} ref={i => this.comments = i} onChange={this.handleChange} />
                            </Col>
                            <Col span={24} style={{ marginTop: '8px' }}>
                                <Button type="primary" onClick={this.handleSubmitComment}>发送</Button>
                            </Col>
                        </Col>
                    </Col>
                </Col>
            </Row>
        );
    }
}
export default withTracker(({ match }) => {
    Meteor.subscribe('users');
    Meteor.subscribe('notice');
    Meteor.subscribe('log');
    Meteor.subscribe('files');
    return {
        allUsers: Meteor.users.find().fetch(),
        toMembers: Notice.find().fetch(),
        logInfo: Log.findOne({ _id: match.params.id }),
        files: File.find().fetch(),
    };
})(Detail);

