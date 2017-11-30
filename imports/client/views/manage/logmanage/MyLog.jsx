import React, { PureComponent } from 'react';
import { Col, Row, Form } from 'antd';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import format from 'date-format';
import Log from '../../../../../imports/schema/log';
import CardLog from './component/CardLog';
import Select from '../audit/component/Select';
import DatePicker from '../audit/component/DatePicker';
import UserUtil from '../../../../util/user';
import feedback from '../../../../util/feedback';

const types = ['日报', '周报', '月报'];

const filterCodition = {
    type: null,
    time: [],
};

class MyLog extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    // 搜索函数
    filterChange = (date, dateString, k) => {
        console.log(k);
        if (dateString && date.length > 0) {
            dateString[0] = date[0]._d;
            dateString[1] = date[1]._d;
            filterCodition.time = dateString;
        }
        if (dateString && date.length === 0) {
            filterCodition.time = [];
        }

        if (Object.prototype.toString.call(date) === '[object Object]') {
            filterCodition.nickname = date.target.value;
        }
        if (typeof date === 'string' || (typeof date === 'undefined')) {
            filterCodition.type = date;
        }
        this.searchLog(filterCodition);
    }
    // 时间整天毫米获取
    daySecond = (date) => {
        const _formatdate = format('yyyy-MM-dd', date);
        const _date = new Date(Date.parse(_formatdate.replace(/-/g, '/')));
        return _date.getTime() / 1000;
    }
    // 搜索所有日志
    searchLog = (vals) => {
        const { AllLogs } = this.props;
        let logs = AllLogs;
        if (vals.nickname && vals.type) {
            logs = logs.filter(item => (item.nickname === vals.nickname && item.type === vals.type));
        } else if (vals.type) {
            logs = logs.filter(item => (item.type === vals.type));
        }
        if (vals.time.length) {
            logs = logs.filter(item => (this.daySecond(vals.time[0]) <= this.daySecond(item.createdAt) && this.daySecond(item.createdAt) <= this.daySecond(vals.time[1])));
        }
        // console.log('filterChange', vals, AllLogs, logs);
        this.setState({ logs });
    }
    // 编辑跳转
    editJump = (e, _id, type) => {
        e.preventDefault();
        let editInfo = {};
        this.props.AllLogs.forEach((item) => {
            if (item._id === _id) {
                editInfo = item;
            }
        });
        editInfo.edit = true;
        let pathname = '/manage/logging';
        if (type === '周报') {
            pathname = '/manage/logging/week';
        } else if (type === '月报') {
            pathname = '/manage/logging/month';
        }
        this.props.history.push({
            pathname,
            state: editInfo,
        });
    }
    // 删除日志
    delLog = (e, _id) => {
        e.preventDefault();
        feedback.dealDelete('温馨提示！', '确认删除此条日志吗？', () => this.del(_id));
    }
    del = (_id) => {
        Meteor.call(
            'deleteLog',
            { _id },
            (err) => {
                if (err) {
                    return console.error(err.reason);
                }
                feedback.successToast('删除成功');
            },
        );
    }
    render() {
        const { AllLogs } = this.props;
        const { logs } = this.state;
        const data = logs || AllLogs;
        const TYPE = types.map(item => ({ id: item, name: item }));
        return (
            <Row gutter={25} className="e-mg-log-filter" type="flex" justify="start">
                <Col span={24} className="margin-bottom-20">
                    <Form className="margin-top-20 border-bottom-eee clearfix">
                        <Col span={7}><Select keyword="type" label="查看模板" onChange={this.filterChange} placeholder="请选择审批类型" width="150" {...this.props} data={TYPE} /></Col>
                        <Col span={7}><DatePicker keyword="time" label="查询日期" onChange={this.filterChange} placeholder={['开始时间', '结束时间']} width="300" {...this.props} /></Col>
                    </Form>
                </Col>
                {data.map(item => (<CardLog edit editLog={this.editJump} delLog={this.delLog} key={item._id} {...item} {...this.props} />))}
                {
                    data.length === 0 && <Col className="e-mg-text-center" span={23}>暂无日志。</Col>
                }
            </Row>
        );
    }
}

MyLog.propTypes = {
    searchLog: PropTypes.func,
    history: PropTypes.object,
    logs: PropTypes.array,
    allUser: PropTypes.array,
    AllLogs: PropTypes.array,
    type: PropTypes.string,
    username: PropTypes.array,
    time: PropTypes.array,
    editJump: PropTypes.func,
    delLog: PropTypes.func,
};
export default withTracker(() => {
    Meteor.subscribe('log');
    const userId = Meteor.user() && Meteor.user()._id;
    return {
        users: Meteor.user() || {},
        AllLogs: Log.find({ userId, company: UserUtil.getMainCompany(), cache: false }).fetch(),
    };
})(Form.create()(MyLog));

