import React from 'react';
import { Row, Col } from 'antd';
import PropTypes from 'prop-types';
import CardLog from './component/CardLog';
import filter from './component/Filter';

const templates = [
    { name: 'dasy', value: '日报', hash: '#write' },
    { name: 'weesk', value: '周报', hash: '#send' },
    { name: 'monsth', value: '月报', hash: '#get' },
    { name: 'busdiness', value: '营业日报', hash: '#send' },
    { name: 'week', value: '周报', hash: '#send' },
    { name: 'month', value: '月报', hash: '#get' },
    { name: 'business', value: '营业日报', hash: '#send' },
];
const MyLog = ({ editJump, delLog, searchMyLog }) => {
    // 查询条件
    const conditions = {
        type: '',
        time: '',
    };
    // 查询我的日志
    const handleChange = (val, type) => {
        conditions[type] = val;
        searchMyLog(conditions);
        console.log('searchMyLog', val, conditions);
    };
    const { myDate, mySelect } = filter;
    const data = [{ name: 2 }];
    return (
        <Row className="e-mg-log-filter" gutter={25} type="flex" justify="space-between">
            <Col span={24} className="margin-bottom-20">
                <span className="margin-right-20">{mySelect({ data, handleChange, title: '按模板筛选', keyword: 'type' })}</span>
                <span className="margin-right-20">{myDate({ handleChange, title: '按时间筛选', keyword: 'time' })}</span>
            </Col>
            {templates.map(item => (<CardLog edit editLog={editJump} delLog={delLog} key={item.name} {...item} />))}
        </Row>
    );
};

MyLog.propTypes = {
    editJump: PropTypes.func,
    delLog: PropTypes.func,
    searchMyLog: PropTypes.func,
};
export default MyLog;
