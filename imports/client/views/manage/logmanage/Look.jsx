import React from 'react';
import { Col, Row } from 'antd';
import PropTypes from 'prop-types';
import CardLog from './component/CardLog';
import filter from './component/Filter';

const templates = [
    { name: 'day', value: '日报' },
    { name: 'week', value: '周报' },
    { name: 'month', value: '月报' },
    { name: 'business', value: '营业日报' },
];
const Look = ({ searchLog }) => {
    // 查询条件
    const conditions = {
        type: '',
        obj: '',
        time: '',
    };
    // 查询我的日志
    const handleChange = (val, type) => {
        conditions[type] = val;
        searchLog(conditions);
        console.log('searchLog', val, conditions);
    };
    const { myDate, mySelect } = filter;
    return (
        <Row gutter={25} className="e-mg-log-filter" type="flex" justify="space-between">
            <Col span={24} className="margin-bottom-20">
                <span className="margin-right-20">{mySelect({ handleChange, data: [], title: '按模板筛选', width: 150, keyword: 'type' })}</span>
                <span className="margin-right-20">{mySelect({ handleChange, data: [], title: '发送人', width: 150, keyword: 'obj' })}</span>
                <span className="margin-right-20">{myDate({ handleChange, title: '时间', keyword: 'time' })}</span>
            </Col>
            {templates.map(item => (<CardLog key={item.name} {...item} />))}
        </Row>
    );
};

Look.propTypes = {
    searchLog: PropTypes.func,
};
export default Look;
