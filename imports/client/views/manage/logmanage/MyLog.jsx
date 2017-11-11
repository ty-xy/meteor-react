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

const types = ['日报', '周报', '月报'];

const filterCodition = {
    type: null,
    time: [],
};

class MyLog extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            logs: [],
        };
    }
    componentWillMount() {
        const { AllLogs } = this.props;
        const userId = Meteor.user() && Meteor.user()._id;
        const logs = AllLogs.filter(item => (item.userId === userId && item.company === UserUtil.getCompany()));
        this.setState({ logs });
    }
    // 搜索函数
    filterChange = (date, dateString) => {
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
        vals.userId = Meteor.user()._id;
        let logs = AllLogs;
        if (vals.nickname && vals.type) {
            logs = Log.find({ type: vals.type, nickname: vals.nickname }).fetch();
        } else if (vals.type) {
            logs = Log.find({ type: vals.type }).fetch();
        }
        if (vals.time.length) {
            logs = logs.filter(item => (this.daySecond(vals.time[0]) <= this.daySecond(item.createdAt) && this.daySecond(item.createdAt) <= this.daySecond(vals.time[1])));
        }
        this.setState({ logs });
    }
    render() {
        const { logs } = this.state;
        const { editJump, delLog } = this.props;
        return (
            <Row gutter={25} className="e-mg-log-filter" type="flex" justify="start">
                <Col span={24} className="margin-bottom-20">
                    <Form className="margin-top-20 border-bottom-eee clearfix">
                        <Col span={7}><Select keyword="type" label="查看模板" onChange={this.filterChange} placeholder="请选择审批类型" width="150" {...this.props} data={types} /></Col>
                        <Col span={7}><DatePicker keyword="time" label="查询日期" onChange={this.filterChange} placeholder={['开始时间', '结束时间']} width="300" {...this.props} /></Col>
                    </Form>
                </Col>
                {logs.map(item => (<CardLog edit editLog={editJump} delLog={delLog} key={item._id} {...item} {...this.props} />))}
                {
                    logs.length === 0 && <Col className="e-mg-text-center" span={23}>暂无日志。</Col>
                }
            </Row>
        );
    }
}

MyLog.propTypes = {
    searchLog: PropTypes.func,
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
    return {
        users: Meteor.user() || {},
        AllLogs: Log.find().fetch(),
        allUsers: Meteor.users.find().fetch(),
    };
})(Form.create()(MyLog));

