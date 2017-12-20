import React, { PureComponent } from 'react';
import { Col, Row, Form } from 'antd';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import format from 'date-format';
import Log from '../../../../../imports/schema/log';
import CardLog from './component/CardLog';
import Select from '../audit/component/Select';
import MyInput from '../audit/component/Input';
import DatePicker from '../audit/component/DatePicker';
import Company from '../../../../../imports//schema/company';
import UserUtil from '../../../../util/user';

const types = ['日报', '周报', '月报'];

const filterCodition = {
    type: null,
    nickname: null,
    time: [],
};

class Look extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
        };
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
            logs = logs.filter(item => (item.nickname === vals.nickname && item.type === vals.type));
        } else if (vals.nickname) {
            logs = logs.filter(item => (item.nickname === vals.nickname));
        } else if (vals.type) {
            logs = logs.filter(item => (item.type === vals.type));
        }
        if (vals.time.length) {
            logs = logs.filter(item => (this.daySecond(vals.time[0]) <= this.daySecond(item.createdAt) && this.daySecond(item.createdAt) <= this.daySecond(vals.time[1])));
        }
        this.setState({ logs });
    }
    render() {
        const { logs } = this.state;
        const { AllLogs } = this.props;
        const data = logs || AllLogs;
        const TYPE = types.map(item => ({ id: item, name: item }));
        console.log('AllLogs', AllLogs);
        return (
            <Row gutter={25} className="e-mg-log-filter" type="flex" justify="start">
                <Col span={24} className="margin-bottom-20">
                    <Form className="margin-top-20 border-bottom-eee clearfix">
                        <Col span={7}><Select keyword="type" label="查看类型" onChange={this.filterChange} placeholder="请选择审批类型" width="150" {...this.props} data={TYPE} /></Col>
                        <Col span={7}><MyInput keyword="nickname" label="查看人员" onChange={this.filterChange} placeholder="请输入关键词" width="150" {...this.props} /></Col>
                        <Col span={7}><DatePicker keyword="time" label="查询日期" onChange={this.filterChange} placeholder={['开始时间', '结束时间']} width="300" {...this.props} /></Col>
                    </Form>
                </Col>
                {data.map((item, index) => (<CardLog key={item._id} index={index} {...item} />))}
                {
                    data.length === 0 && <Col className="e-mg-text-center" span={23}>暂无日志。</Col>
                }
            </Row>
        );
    }
}

Look.propTypes = {
    searchLog: PropTypes.func,
    logs: PropTypes.array,
    allUser: PropTypes.array,
    AllLogs: PropTypes.array,
    type: PropTypes.string,
    username: PropTypes.array,
    time: PropTypes.array,
    allusers: PropTypes.array,
};
export default withTracker(() => {
    Meteor.subscribe('log');
    Meteor.subscribe('company');
    const allusers = Company.find({ _id: UserUtil.getMainCompany() }).fetch();
    const mainCompany = UserUtil.getMainCompany();

    const userId = Meteor.userId();
    let group = '';
    let AllLogs = [];
    for (let i = 0; i < allusers.length; i++) {
        if (allusers[i].userId === userId) {
            group = allusers[i].dep;
            break;
        }
    }
    const search = { peo: userId, company: mainCompany };
    const searchGroup = { group, company: mainCompany };
    AllLogs = Log.find({ $or: [{ ...search }, { ...searchGroup }] }, { sort: { createdAt: -1 } }).fetch();
    AllLogs = AllLogs.filter(item => (item.userId !== Meteor.userId()));
    return {
        users: Meteor.user() || {},
        AllLogs,
        allusers,
    };
})(Form.create()(Look));

