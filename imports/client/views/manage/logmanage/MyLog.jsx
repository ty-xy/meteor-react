import React from 'react';
import { Row, Col } from 'antd';
import PropTypes from 'prop-types';
import CardLog from './component/CardLog';
import filter from './component/Filter';

const MyLog = ({ editJump, delLog, searchMyLog, myLogs }) => {
    // 查询条件
    const conditions = {
        // type: '',
        // time: '',
    };
    // 查询我的日志
    const handleChange = (val, type) => {
        if (!val) {
            delete conditions[type];
        } else {
            conditions[type] = val;
        }
        searchMyLog(conditions);
    };
    const types = [
        { name: 'day', value: '日报' },
        { name: 'week', value: '周报' },
        { name: 'month', value: '月报' },
        { name: 'business', value: '营业日报' },
    ];
    const { myDate, mySelect } = filter;
    return (
        <Row className="e-mg-log-filter" gutter={25} type="flex" justify="start">
            <Col span={24} className="margin-bottom-20">
                <span className="margin-right-20">{mySelect({ handleChange, data: types, title: '按模板筛选', keyword: 'type' })}</span>
                <span className="margin-right-20">{myDate({ handleChange, title: '按时间筛选', keyword: 'time' })}</span>
            </Col>
            {myLogs.map(item => (<CardLog edit editLog={editJump} delLog={delLog} key={item._id} {...item} />))}
            {
                myLogs.length === 0 && <Col className="e-mg-text-center" span={23}>暂无日志。</Col>
            }
        </Row>
    );
};

MyLog.propTypes = {
    editJump: PropTypes.func,
    delLog: PropTypes.func,
    searchMyLog: PropTypes.func,
    myLogs: PropTypes.array,
};
export default MyLog;
