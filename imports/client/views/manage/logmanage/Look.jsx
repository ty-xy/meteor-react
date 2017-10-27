import React from 'react';
import { Col, Row } from 'antd';
import PropTypes from 'prop-types';
import CardLog from './component/CardLog';
import filter from './component/Filter';

const Look = ({ searchLog, logs, allUser }) => {
    // 查询条件
    const conditions = {
        type: '',
        username: '',
        time: '',
    };
    const types = [
        { name: 'day', value: '日报' },
        { name: 'week', value: '周报' },
        { name: 'month', value: '月报' },
        { name: 'business', value: '营业日报' },
    ];

    // 查询我的日志
    const handleChange = (val, type) => {
        // if (!val) {
        //     delete conditions[type];
        // } else {
        //     conditions[type] = val;
        // }
        conditions[type] = val || '';
        searchLog(val, type);
    };
    const { myDate, mySelect } = filter;
    return (
        <Row gutter={25} className="e-mg-log-filter" type="flex" justify="start">
            <Col span={24} className="margin-bottom-20">
                <span className="margin-right-20">{mySelect({ handleChange, data: types, title: '按模板筛选', width: 150, keyword: 'type' })}</span>
                <span className="margin-right-20">{mySelect({ handleChange, data: allUser, title: '发送人', width: 150, keyword: 'username' })}</span>
                <span className="margin-right-20">{myDate({ handleChange, title: '时间', keyword: 'time' })}</span>
            </Col>
            {logs.map(item => (<CardLog key={item._id} {...item} />))}
            {
                logs.length === 0 && <Col className="e-mg-text-center" span={23}>暂无日志。</Col>
            }
        </Row>
    );
};

Look.propTypes = {
    searchLog: PropTypes.func,
    logs: PropTypes.array,
    allUser: PropTypes.array,
};
export default Look;
