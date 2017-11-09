import React from 'react';
import { Col } from 'antd';
import PropTypes from 'prop-types';
import format from 'date-format';
import { userIdToInfo } from '../../../../../util/user';


const CardAudit = ({ handlerAudit, type, reason, daynum, createdAt, status, userId, _id, allUsers }) => (
    <Col className="e-mg-log-card" style={{ width: '260px', marginRight: '30px' }}>
        <div className="e-mg-log-card-header">
            <Col span={16}>
                <img src={userIdToInfo.getAvatar(allUsers, userId) || 'http://k2.jsqq.net/uploads/allimg/1706/7_170629152344_5.jpg'} width="56px" alt="" />
                <span className="e-mg-log-card-header-left">{userIdToInfo.getName(allUsers, userId)}</span>
            </Col>
            <Col span={8} className="e-mg-log-card-header-right">{type}</Col>
        </div>
        <div className="e-mg-log-card-body">
            <p><span>请假事由：</span>{reason}</p>
            <p><span>请假类型：</span>{type}</p>
            <p><span>请假天数：</span>{daynum}</p>
        </div>
        <div className="e-mg-log-card-footer">
            <Col span={12}>{format('MM月dd日', createdAt)}</Col>
            <Col span={12} className="right">
                <a onClick={e => handlerAudit(e, _id)} href="">
                    {status === '待审核' ? (<span style={{ color: '#FFA200' }}>审核</span>)
                        : <span style={{ color: '#ef5350' }}>已{status}</span>}</a>
            </Col>
        </div>
    </Col>
);

CardAudit.propTypes = {
    handlerAudit: PropTypes.func,
    _id: PropTypes.string,
    userId: PropTypes.string,
    reason: PropTypes.string,
    type: PropTypes.string,
    daynum: PropTypes.number,
    createdAt: PropTypes.object,
    status: PropTypes.string,
    allUsers: PropTypes.array,
};

export default CardAudit;
