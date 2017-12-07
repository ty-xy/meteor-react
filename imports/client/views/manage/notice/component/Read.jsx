import React, { PureComponent } from 'react';
import { Table, Row } from 'antd';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import format from 'date-format';
import notification from '../../../../../schema/notification';
import notice from '../../../../../schema/notice';
import feedback from '../../../../../util/feedback';
import UserUtil from '../../../../../util/user';


class Read extends PureComponent {
    static propTypes = {
        notices: PropTypes.array,
        notifications: PropTypes.array,
    }
    constructor(props) {
        super(props);
        this.state = {
            notices: [],
        };
    }
    setUp = (e, _id, val) => {
        e.preventDefault();
        const { notifications } = this.props;
        const _idOld = notifications[0] && notifications[0]._id;
        Meteor.call(
            'setNoticeUp',
            { _id, _idOld, val },
        );
    }
    getColumns = () => (
        [{
            title: '公告名称',
            dataIndex: '',
            key: 'name',
            render: record => (
                <div>
                    <p>
                        {record.title}
                        {record.up ? (<span className="e-mg-notice-up">置顶</span>) : null}
                        {record.isSecrecy ? (<span className="e-mg-notice-up">保密</span>) : null}
                    </p>
                    <p style={{ color: '#bdbdbd' }}>{record.username} {format('yyyy-MM-dd ', record.createdAt)}  {record.author}</p>
                </div>
            ),
        }, {
            title: '状态',
            dataIndex: '',
            key: 'age',
            render: (record) => {
                const { notices } = this.props;
                let noticed = [];
                let isRead = 0;
                for (let i = 0; i < notices.length; i++) {
                    if (notices[i].logId === record._id) {
                        noticed = notices[i].toMembers;
                        break;
                    }
                }
                noticed.forEach((item) => {
                    if (item.isRead) {
                        isRead++;
                    }
                });
                return <span>{isRead}人已读 未读{noticed.length - isRead}人</span>;
            },
        }, {
            title: '操作',
            key: 'action',
            render: (text, record) => (
                <span>
                    {
                        record.up ? (<a href="" style={{ color: '#BDBDBD' }} onClick={e => this.setUp(e, record._id, record.up)}>置顶</a>)
                            : <a href="" onClick={e => this.setUp(e, record._id)}>置顶</a>
                    }
                    <span className="ant-divider" />
                    <Link to={{ pathname: '/manage/notice', state: { editData: record } }}>编辑</Link>
                    <span className="ant-divider" />
                    <a href="" className="ant-dropdown-link" onClick={e => this.reCall(e, record._id, record.up)}>撤回</a>
                    <span className="ant-divider" />
                    <Link to={`/manage/notice/detail/${record._id}`}>查看详情</Link>
                </span>
            ),
        }]
    )
    reCall = (e, _id) => {
        e.preventDefault();
        feedback.dealDelete('温馨提示', '你确定要撤回公告吗？', () => {
            Meteor.call(
                'deleteNotice',
                { _id },
                (err) => {
                    if (err) {
                        feedback.dealError(err);
                    } else {
                        feedback.successToast('撤回成功');
                    }
                },
            );
        });
    }
    render() {
        const { notifications } = this.props;
        return (
            <Row className="margin-top-20">
                <Table
                    rowKey="_id"
                    columns={this.getColumns()}
                    dataSource={notifications || []}
                    pagination={false}
                />
            </Row>
        );
    }
}

export default withTracker(() => {
    Meteor.subscribe('notification');
    return {
        users: Meteor.user() || {},
        notifications: notification.find({ company: UserUtil.getMainCompany() }, { sort: { up: -1 } }).fetch(),
        notices: notice.find({ noticeType: '公告' }).fetch(),
    };
})(Read);
