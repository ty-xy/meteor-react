import React from 'react';
import { Col } from 'antd';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import format from 'date-format';
import { userIdToInfo } from '../../../../../util/user';

const CardLog = ({ edit, delLog, editLog, finish, plan, type, nickname, help, _id, createdAt = new Date(), allUsers }) => (
    <Col className="e-mg-log-card">
        <div className="e-mg-log-card-header">
            <Col span={16}>
                <img src={userIdToInfo.getAvatar(allUsers, _id) || 'http://k2.jsqq.net/uploads/allimg/1706/7_170629152344_5.jpg'} width="56px" alt="" />
                <span className="e-mg-log-card-header-left">{nickname}</span>
            </Col>
            <Col span={8} className="e-mg-log-card-header-right">{type}</Col>
        </div>
        <div className="e-mg-log-card-body">
            <p><span>已完成工作：</span>{finish}</p>
            <p><span>未完成工作：</span>{plan}</p>
            <p><span>需协调工作：</span>{help}</p>
        </div>
        <div className="e-mg-log-card-footer">
            <Col span={12}>{format('yyyy-MM-dd', createdAt)}</Col>
            {
                edit ? (<Col span={12} className="right">
                    <a href="" onClick={e => delLog(e, _id)}>删除</a>
                    <a href="" onClick={e => editLog('#write', e, _id)} className="margin-left-10">修改</a></Col>)
                    : (<Col span={12} className="right"><Link to={{ pathname: '/manage/logging/detail', state: { edit, delLog, editLog, finish, plan, type, nickname, help, _id } }}>查看详情</Link></Col>)
            }
        </div>
    </Col>
);

CardLog.propTypes = {
    edit: PropTypes.bool,
    delLog: PropTypes.func,
    _id: PropTypes.string,
    editLog: PropTypes.func,
    finish: PropTypes.string,
    plan: PropTypes.string,
    help: PropTypes.string,
    type: PropTypes.string,
    nickname: PropTypes.string,
    createdAt: PropTypes.object,
    allUsers: PropTypes.array,
};

export default CardLog;
