import React, { PureComponent } from 'react';
import { Table, Row } from 'antd';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import format from 'date-format';
import notification from '../../../../../schema/notification';
import feedback from '../../../../../util/feedback';


class Read extends PureComponent {
    static propTypes = {
        notices: PropTypes.array,
    }
    constructor(props) {
        super(props);
        this.state = {
            notices: [],
        };
    }
    setUp = (e, _id, val) => {
        e.preventDefault();
        const { notices } = this.props;
        const _idOld = notices[0] && notices[0]._id;
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
                    <p style={{ color: '#bdbdbd' }}>{format('yyyy-MM-dd ', record.createdAt)}  {record.author}</p>
                </div>
            ),
        }, {
            title: '状态',
            dataIndex: 'age',
            key: 'age',
            render: () => ('88人已读 未读12人'),
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
                </span>
            ),
        }]
    )
    reCall = (e, _id) => {
        e.preventDefault();
        feedback.dealDelete('温馨提示', '此操作不可撤回', () => {
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
        console.log('read', this.props);
        const { notices } = this.props;
        return (
            <Row className="margin-top-20">
                <Table
                    rowKey="_id"
                    columns={this.getColumns()}
                    dataSource={notices || []}
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
        notices: notification.find({}, { sort: { up: -1 } }).fetch(),
    };
})(Read);
