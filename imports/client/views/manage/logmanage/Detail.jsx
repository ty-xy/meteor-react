import React, { PureComponent, Component } from 'react';
import { Row, Col } from 'antd';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { userIdToInfo } from '../../../../util/user';


class Detail extends (PureComponent || Component) {
    goback = (e) => {
        e.preventDefault();
        this.props.history.goBack();
    }
    render() {
        const { nickname, plan, finish, _id, help, num, peos } = this.props.location.state;
        const { allUsers } = this.props;
        // console.log('location', this.props);
        return (
            <Row className="e-mg-log-details">
                <Col span={24} className="e-mg-log-details-header">
                    <a href="" onClick={this.goback}>关闭</a>
                    <span>{nickname}的日志</span>
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
                        <p>{num || 0}人已读</p>
                        <Col span={24} data-peos={peos}>
                            <span>
                                <img src="http://k2.jsqq.net/uploads/allimg/1706/7_170629152344_5.jpg" width="36" />
                                <p>王晓儿</p>
                            </span>
                            <span>
                                <img src="http://k2.jsqq.net/uploads/allimg/1706/7_170629152344_5.jpg" width="36px" />
                                <p>王晓儿</p>
                            </span>
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
    return {
        allUsers: Meteor.users.find().fetch(),
    };
})(Detail);

