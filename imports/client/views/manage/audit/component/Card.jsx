import React from 'react';
import { Col } from 'antd';
import PropTypes from 'prop-types';

// const types = {
//     day: '日报',
//     week: '周报',
//     month: '月报',
//     business: '营业日报',
// };

const CardAudit = ({ handlerAudit, name, avatar, type, reason, num, date, status, _id }) => (
    <Col className="e-mg-log-card" style={{ width: '260px', marginRight: '30px' }}>
        <div className="e-mg-log-card-header">
            <Col span={16}>
                <img src={avatar || 'http://k2.jsqq.net/uploads/allimg/1706/7_170629152344_5.jpg'} width="56px" alt="" />
                <span className="e-mg-log-card-header-left">{name}</span>
            </Col>
            <Col span={8} className="e-mg-log-card-header-right">{type}</Col>
        </div>
        <div className="e-mg-log-card-body">
            <p><span>{type}事由：</span>{reason}</p>
            <p><span>{type}类型：</span>{type}</p>
            <p><span>{type}天数：</span>{num}</p>
        </div>
        <div className="e-mg-log-card-footer">
            <Col span={12}>{date}</Col>
            <Col span={12} className="right">{status === '待审核' ? (<a onClick={e => handlerAudit(e, _id)} href=""><span style={{ color: '#FFA200' }}>{status}</span></a>) : null}</Col>
        </div>
    </Col>
);

CardAudit.propTypes = {
    handlerAudit: PropTypes.func,
    _id: PropTypes.string,
    name: PropTypes.string,
    avatar: PropTypes.string,
    reason: PropTypes.string,
    type: PropTypes.string,
    num: PropTypes.string,
    date: PropTypes.string,
    status: PropTypes.string,
};

export default CardAudit;
